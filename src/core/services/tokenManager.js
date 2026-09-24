import { useAuthStore } from "../store/authStore";
import { decodeJwt, isJwtExpired } from "./jwtDecoder";
import { refreshTokenApi } from "../api/authApi";
import logger from "@/lib/logger";

// ---------------------------------------------------------------------------
// Configurable Token Lifetime (in Minutes) loaded from environment variable.
// Default fallback is 15 minutes if not specified.
// ---------------------------------------------------------------------------
export const TOKEN_EXPIRY_MINUTES =
  Number(import.meta.env.VITE_TOKEN_EXPIRY_MINUTES) || 15;

// Millisecond equivalent used internally
export const TOTAL_TOKEN_EXPIRY = TOKEN_EXPIRY_MINUTES * 60 * 1000;

/**
 * Calculates remaining lifetime and target refresh time (at 80% elapsed, i.e., 20% remaining).
 * Reads actual JWT claims (`exp` and `iat`) when available for precision.
 *
 * @param {string|null} token
 * @param {number} fallbackTotalMs
 * @returns {{ remainingMs: number, totalLifespanMs: number, refreshDelayMs: number, isExpiringSoon: boolean }}
 */
export function calculateTokenTiming(token, fallbackTotalMs = TOTAL_TOKEN_EXPIRY) {
  if (!token) {
    return {
      remainingMs: 0,
      totalLifespanMs: fallbackTotalMs,
      refreshDelayMs: 0,
      isExpiringSoon: true,
    };
  }

  const payload = decodeJwt(token);
  const now = Date.now();

  let totalLifespanMs = fallbackTotalMs;
  let remainingMs = 0;

  if (payload?.exp) {
    const expiresAt = payload.exp * 1000;
    remainingMs = expiresAt - now;

    if (payload.iat && payload.exp > payload.iat) {
      totalLifespanMs = (payload.exp - payload.iat) * 1000;
    }
  } else {
    // If no exp in payload, use fallback
    remainingMs = fallbackTotalMs;
  }

  // Refresh target is at 80% elapsed (when only 20% of life remains)
  const refreshThresholdMs = Math.max(30 * 1000, Math.floor(totalLifespanMs * 0.2));
  const isExpiringSoon = remainingMs <= refreshThresholdMs;

  // Exact time until we hit the 80% mark
  const refreshDelayMs = Math.max(0, remainingMs - refreshThresholdMs);

  return {
    remainingMs,
    totalLifespanMs,
    refreshDelayMs,
    isExpiringSoon,
  };
}

/**
 * Backward compatibility exports.
 */
export function calculateRefreshThreshold(totalExpiry = TOTAL_TOKEN_EXPIRY) {
  const duration = typeof totalExpiry === "number" && totalExpiry > 0 ? totalExpiry : TOTAL_TOKEN_EXPIRY;
  return Math.max(30 * 1000, Math.floor(duration * 0.2));
}

export function calculateCheckInterval(totalExpiry = TOTAL_TOKEN_EXPIRY) {
  const threshold = calculateRefreshThreshold(totalExpiry);
  return Math.max(5 * 1000, Math.min(60 * 1000, Math.floor(threshold * 0.25)));
}

import { hasSessionHint, setSessionHint } from "./sessionHint";
export { hasSessionHint, setSessionHint };

class TokenManager {
  constructor(totalExpiry = TOTAL_TOKEN_EXPIRY) {
    this.totalExpiry = totalExpiry;
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.refreshTimeoutId = null;

    // Reactively monitor token changes in Zustand to schedule dynamic refresh
    if (typeof window !== "undefined") {
      useAuthStore.subscribe((state) => {
        this.scheduleDynamicRefresh(state.token);
      });
    }
  }

  /**
   * Dynamically schedules next refresh call at 80% of current token's lifetime.
   * Cancels any pending scheduled refresh timer whenever a new token arrives.
   *
   * @param {string|null} [token]
   */
  scheduleDynamicRefresh(token) {
    if (typeof window === "undefined") return;

    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }

    const currentToken = token ?? this.getToken();
    const isAuth = useAuthStore.getState().isAuthenticated;

    if (!currentToken || !isAuth) {
      return;
    }

    const { refreshDelayMs, isExpiringSoon } = calculateTokenTiming(currentToken, this.totalExpiry);

    if (isExpiringSoon) {
      // If token is already past 80% lifespan, refresh promptly with small buffer
      logger.debug("Token past 80% lifetime, refreshing now.");
      this.safeRefresh().catch(() => {});
      return;
    }

    logger.debug(
      `Next token refresh dynamically scheduled in ${Math.round(refreshDelayMs / 1000)}s (at 80% of token time).`
    );

    this.refreshTimeoutId = setTimeout(() => {
      if (useAuthStore.getState().isAuthenticated) {
        this.safeRefresh().catch(() => {});
      }
    }, refreshDelayMs);
  }

  /**
   * Retrieves the current in-memory token from the Zustand store.
   */
  getToken() {
    return useAuthStore.getState().token;
  }

  /**
   * Retrieves the current in-memory refresh token.
   */
  getRefreshToken() {
    return useAuthStore.getState().refreshToken;
  }

  /**
   * Checks if active token has reached 80% of its lifetime.
   */
  isTokenExpiringSoon(token) {
    const { isExpiringSoon } = calculateTokenTiming(token, this.totalExpiry);
    return isExpiringSoon;
  }

  /**
   * Safe fallback for callers needing a valid token.
   * If the token is still valid, returns it immediately without issuing a network refresh.
   * Routine refreshing is handled strictly in the background by scheduleDynamicRefresh().
   */
  async refreshIfNeeded() {
    const token = this.getToken();

    // If active in-memory token is not expired, return it immediately without calling /refresh
    if (token && !isJwtExpired(token)) {
      return token;
    }

    const isAuth = useAuthStore.getState().isAuthenticated;
    const isInit = useAuthStore.getState().isInitialized;

    // Do not attempt refresh if unauthenticated and either already initialized or no session hint exists
    if (!isAuth && (isInit || !hasSessionHint())) {
      return null;
    }

    return await this.safeRefresh();
  }

  /**
   * Initializes session on application startup by checking HttpOnly cookies.
   * Only calls backend refresh if a prior session hint exists (or forced by guard),
   * completely eliminating unwanted 401 console errors for regular visitors.
   */
  async initSession(options = {}) {
    const { force = false } = options;

    if (!hasSessionHint() && !force) {
      useAuthStore.getState().setInitialized(true);
      return null;
    }

    try {
      return await this.safeRefresh();
    } catch {
      setSessionHint(false);
      useAuthStore.getState().clearAuth();
      return null;
    }
  }

  /**
   * Ensures only one refresh request is in flight simultaneously.
   */
  async safeRefresh() {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = this.callRefreshAPI()
      .then((newToken) => {
        this.isRefreshing = false;
        this.refreshPromise = null;
        return newToken;
      })
      .catch((err) => {
        this.isRefreshing = false;
        this.refreshPromise = null;
        throw err;
      });

    return this.refreshPromise;
  }

  /**
   * Performs the API refresh call and updates the Zustand store.
   * Leverages HttpOnly cookies via credentials: "include".
   */
  async callRefreshAPI() {
    try {
      const storedRefreshToken = this.getRefreshToken();
      const res = await refreshTokenApi(storedRefreshToken);

      if (!res || !res.ok) {
        const isAuthError =
          res?.httpStatus === 401 ||
          res?.status === 401 ||
          res?.statusCode === 401 ||
          res?.httpStatus === 403;

        if (isAuthError) {
          logger.debug("No active session on refresh check.");
          setSessionHint(false);
          useAuthStore.getState().clearAuth();
          return null;
        }

        // If network or server error but we have an unexpired in-memory token, retain it
        const currentToken = this.getToken();
        if (currentToken && !isJwtExpired(currentToken)) {
          logger.warn("Server error on refresh, retaining current valid token.");
          return currentToken;
        }

        setSessionHint(false);
        useAuthStore.getState().clearAuth();
        return null;
      }

      // Extract new token from parsed API response
      let newToken = null;
      let newRefreshToken = null;

      if (res.data) {
        if (typeof res.data === "string") {
          newToken = res.data;
        } else if (typeof res.data === "object") {
          newToken = res.data.accessToken || res.data.token || null;
          newRefreshToken = res.data.refreshToken || null;
        }
      }

      if (newToken) {
        setSessionHint(true);
        useAuthStore.getState().setAuth({
          token: newToken,
          accessToken: newToken,
          refreshToken: newRefreshToken || storedRefreshToken,
          data: res.data,
        });
        return newToken;
      }

      // If response succeeded but returned no token body, mark state initialized
      useAuthStore.getState().setInitialized(true);
      return null;
    } catch (err) {
      logger.error("Refresh token error:", err);
      setSessionHint(false);
      useAuthStore.getState().clearAuth();
      return null;
    }
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;

