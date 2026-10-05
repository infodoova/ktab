import { create } from "zustand";
import {
  isJwtExpired,
  extractUserFromToken,
  decodeJwt,
} from "../services/jwtDecoder";
import { logoutApi } from "../api/authApi";
import { setSessionHint } from "../services/sessionHint";
import logger from "@/lib/logger";

const USER_STORAGE_KEY = "ktab_user";

import { normalizeRole } from "../constants/roles";
export { normalizeRole };

/**
 * Saves user profile to storage for session persistence across reloads.
 * Contains zero tokens or passwords.
 */
function saveUserToStorage(user) {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {}
}

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      parsed.userId = parsed.userId ?? parsed.id;
      parsed.id = parsed.id ?? parsed.userId;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Ensures legacy localStorage tokens are completely removed.
 * Strictly adheres to zero-localStorage policy for auth tokens.
 */
function purgeLegacyLocalStorage() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  } catch (e) {
    logger.error("Failed to purge legacy storage tokens:", e);
  }
}

const initialUser = getUserFromStorage();

export const useAuthStore = create((set, get) => ({
  token: null,
  refreshToken: null,
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isInitialized: false,
  isLoading: false,

  /**
   * Sets authentication state and user data faithfully as returned by the backend.
   * Never invents placeholder properties or default roles.
   *
   * @param {string|Object} payload - Raw JWT token or response object
   */
  setAuth: (payload) => {
    if (!payload) {
      get().clearAuth();
      return;
    }

    let tokenStr = null;
    let refreshTokenStr = null;
    let userObj = null;

    if (typeof payload === "string") {
      tokenStr = payload;
      const decoded = extractUserFromToken(payload);
      if (decoded) {
        userObj = {
          ...decoded,
          role: normalizeRole(decoded.role),
        };
      }
    } else if (typeof payload === "object") {
      const dataObj = payload.data || payload;
      tokenStr =
        dataObj.accessToken ||
        dataObj.token ||
        (typeof payload.token === "string" ? payload.token : null);
      refreshTokenStr = dataObj.refreshToken || payload.refreshToken || null;

      // Save backend user data directly as returned without fabricated defaults
      if (dataObj && (dataObj.id !== undefined || dataObj.userId !== undefined || dataObj.email !== undefined || dataObj.role !== undefined)) {
        userObj = {
          ...dataObj,
          userId: dataObj.userId ?? dataObj.id,
          id: dataObj.id ?? dataObj.userId,
          role: normalizeRole(dataObj.role),
        };
      } else if (payload.user) {
        userObj = {
          ...payload.user,
          userId: payload.user.userId ?? payload.user.id,
          id: payload.user.id ?? payload.user.userId,
          role: normalizeRole(payload.user.role),
        };
      } else if (tokenStr) {
        const decoded = extractUserFromToken(tokenStr);
        if (decoded) {
          userObj = {
            ...decoded,
            userId: decoded.userId ?? decoded.id,
            id: decoded.id ?? decoded.userId,
            role: normalizeRole(decoded.role),
          };
        }
      }
    }

    if (tokenStr && isJwtExpired(tokenStr)) {
      logger.warn("Attempted to set an expired token in memory.");
      get().clearAuth();
      return;
    }

    purgeLegacyLocalStorage();
    const finalUser = userObj !== null ? userObj : get().user;
    const isAuth = Boolean(finalUser || tokenStr);

    setSessionHint(isAuth);
    saveUserToStorage(finalUser);

    set({
      token: tokenStr,
      refreshToken: refreshTokenStr || get().refreshToken,
      user: finalUser,
      isAuthenticated: isAuth,
      isInitialized: true,
      isLoading: false,
    });
  },

  /**
   * Clears authentication, in-memory tokens, and resets user state.
   */
  clearAuth: () => {
    purgeLegacyLocalStorage();
    setSessionHint(false);
    saveUserToStorage(null);
    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false,
    });
  },

  /**
   * Logs out the user by revoking backend session and clearing local state.
   */
  logout: async () => {
    const refreshToken = get().refreshToken;
    try {
      await logoutApi(refreshToken);
    } catch (e) {
      logger.error("Logout API call error:", e);
    } finally {
      get().clearAuth();
    }
  },

  /**
   * Updates user profile object in state.
   */
  setUser: (user) => set({ user }),

  /**
   * Sets loading flag.
   */
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Sets initialized flag directly.
   */
  setInitialized: (isInitialized) => set({ isInitialized }),

  /**
   * Revalidates and initializes session via tokenManager.
   */
  initAuth: async () => {
    purgeLegacyLocalStorage();
    try {
      const { tokenManager } = await import("../services/tokenManager");
      return await tokenManager.initSession();
    } catch (e) {
      logger.error("Auth initialization failed:", e);
      get().clearAuth();
    }
  },
}));

// Compatibility procedural helpers
export function saveToken(value) {
  useAuthStore.getState().setAuth(value);
}

export function token() {
  return useAuthStore.getState().token;
}

export function clearToken() {
  useAuthStore.getState().clearAuth();
}

export function logout() {
  return useAuthStore.getState().logout();
}

export function isTokenExpired(rawToken) {
  const t = rawToken !== undefined ? rawToken : token();
  return isJwtExpired(t);
}

export function getDecodedToken(rawToken) {
  const t = rawToken !== undefined ? rawToken : token();
  return decodeJwt(t);
}

export function getUserData(rawToken) {
  if (rawToken !== undefined) {
    return extractUserFromToken(rawToken);
  }
  return useAuthStore.getState().user;
}
