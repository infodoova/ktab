import { create } from "zustand";
import {
  isJwtExpired,
  extractUserFromToken,
  decodeJwt,
} from "../services/jwtDecoder";
import logger from "@/lib/logger";

const TOKEN_KEY = "token";

/**
 * Helper to get initial auth state from localStorage.
 */
function getInitialAuthState() {
  try {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken || isJwtExpired(savedToken)) {
      if (savedToken) {
        localStorage.removeItem(TOKEN_KEY);
      }
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    }

    const user = extractUserFromToken(savedToken);
    return {
      token: savedToken,
      user,
      isAuthenticated: Boolean(user),
    };
  } catch {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }
}

export const useAuthStore = create((set, get) => ({
  ...getInitialAuthState(),
  isLoading: false,

  /**
   * Sets new authentication token and extracts user data.
   *
   * @param {string} token - Raw JWT token
   */
  setAuth: (token) => {
    if (!token || typeof token !== "string") {
      get().clearAuth();
      return;
    }

    if (isJwtExpired(token)) {
      logger.warn("Attempted to set an expired token.");
      get().clearAuth();
      return;
    }

    const user = extractUserFromToken(token);
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      logger.error("Failed to save token to storage", e);
    }

    set({
      token,
      user,
      isAuthenticated: Boolean(user),
    });
  },

  /**
   * Clears authentication, deletes token from localStorage, and resets user state.
   */
  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      logger.error("Failed to remove token from storage", e);
    }

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },


  /**
   * Alias for clearAuth.
   */
  logout: () => {
    get().clearAuth();
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
   * Revalidates and initializes the authentication state.
   */
  initAuth: () => {
    const initialState = getInitialAuthState();
    set({ ...initialState });
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
  useAuthStore.getState().clearAuth();
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
