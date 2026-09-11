import { useAuthStore } from "../store/authStore";
import { decodeJwt, isJwtExpired } from "./jwtDecoder";
import { refreshTokenApi } from "../api/authApi";
import logger from "@/lib/logger";

const REFRESH_THRESHOLD = 15 * 60 * 1000; // 15 minutes before expiration
const CHECK_INTERVAL = 60 * 1000; // Check every minute

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
    this.startBackgroundChecker();
  }

  /**
   * Retrieves the current token from the Zustand store or localStorage fallback.
   */
  getToken() {
    return useAuthStore.getState().token || localStorage.getItem("token");
  }

  /**
   * Checks if the active token is nearing expiration.
   */
  isTokenExpiringSoon(token) {
    if (!token) return true;

    const payload = decodeJwt(token);
    if (!payload?.exp) return true;

    const expiresAt = payload.exp * 1000;
    const remaining = expiresAt - Date.now();

    return remaining < REFRESH_THRESHOLD;
  }

  /**
   * Checks and refreshes the token if needed.
   */
  async refreshIfNeeded() {
    const token = this.getToken();
    if (!token) return null;

    if (isJwtExpired(token)) {
      useAuthStore.getState().clearAuth();
      return null;
    }

    if (!this.isTokenExpiringSoon(token)) {
      return token;
    }

    return await this.safeRefresh();
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
   */
  async callRefreshAPI() {
    const token = this.getToken();
    if (!token) throw new Error("No token found");

    try {
      const res = await refreshTokenApi(token);

      if (!res.ok) {
        // Only invalidate auth on genuine 401/403 auth rejections
        if (res.status === 401 || res.status === 403) {
          logger.warn(`Token refresh rejected with auth status ${res.status}. Clearing auth.`);
          useAuthStore.getState().clearAuth();
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/signup")
          ) {
            window.location.replace("/login");
          }
        } else {
          logger.warn(`Token refresh server error (${res.status}). Retaining existing token if valid.`);
        }

        // If current token is still not expired, keep using it
        if (!isJwtExpired(token)) {
          return token;
        }

        throw new Error("Token refresh failed with status " + res.status);
      }

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      let newToken = null;
      if (typeof data === "string") {
        newToken = data;
      } else if (data && typeof data === "object") {
        if (typeof data.data === "string") newToken = data.data;
        else if (data.data && typeof data.data === "object" && data.data.token) {
          newToken = data.data.token;
        } else if (data.token) {
          newToken = data.token;
        } else if (data.data && data.data.accessToken) {
          newToken = data.data.accessToken;
        }
      }

      if (!newToken) {
        if (!isJwtExpired(token)) {
          logger.warn("No token payload in refresh response, retaining active token.");
          return token;
        }
        useAuthStore.getState().clearAuth();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.replace("/login");
        }
        throw new Error("No token returned in refresh response");
      }

      useAuthStore.getState().setAuth(newToken);
      return newToken;
    } catch (err) {
      logger.error("Refresh token error:", err);
      // If current token has not expired yet, don't break in-flight operations
      if (!isJwtExpired(token)) {
        logger.info("Retaining existing non-expired token despite refresh error.");
        return token;
      }
      throw err;
    }
  }

  /**
   * Starts background timer for periodic checks.
   */
  startBackgroundChecker() {
    if (typeof window === "undefined") return;
    setInterval(() => {
      this.refreshIfNeeded().catch(() => {});
    }, CHECK_INTERVAL);
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;

