import logger from "@/lib/logger";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

/**
 * Standard fetch helper for Auth API endpoints.
 * Includes credentials so browser sets/sends HttpOnly session cookies.
 */
async function postRequest(endpoint, body, customHeaders = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        ...customHeaders,
      },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    if (!text || !text.trim()) {
      return {
        success: response.ok,
        ok: response.ok,
        httpStatus: response.status,
        messageStatus: response.ok ? "SUCCESS" : "ERROR",
      };
    }

    const json = JSON.parse(text);
    return {
      ...json,
      ok: response.ok,
      httpStatus: response.status,
    };
  } catch (error) {
    logger.error(`Auth request failed for ${endpoint}:`, error);
    return {
      success: false,
      ok: false,
      messageStatus: "ERROR",
      message: "تعذر الاتصال بخدمة المصادقة",
    };
  }
}

/**
 * Logs in a user.
 * Dispatches POST /auth/login with only email and password in request body.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ ok: boolean, success: boolean, messageStatus: string, message: string, data?: any }>}
 */
export async function loginApi({ email, password }) {
  return postRequest("/auth/login", {
    email,
    password,
  });
}

/**
 * Logs in or registers a user via Google OAuth2 ID token.
 * Sets ACCESS_TOKEN and REFRESH_TOKEN as HttpOnly cookies on the backend.
 *
 * @param {{ idToken: string }} payload
 * @returns {Promise<{ ok: boolean, success: boolean, messageStatus: string, message: string, data?: any }>}
 */
export async function googleLoginApi({ idToken }) {
  return postRequest("/auth/google", {
    idToken,
  });
}

/**
 * Completes Google registration for a new user with chosen role.
 * Issues session cookies and returns user profile data.
 *
 * @param {{ pendingToken: string, role: string }} payload
 * @returns {Promise<{ ok: boolean, success: boolean, messageStatus: string, message: string, data?: any }>}
 */
export async function completeGoogleRegistrationApi({ pendingToken, role }) {
  return postRequest("/auth/google/complete", {
    pendingToken,
    role,
  });
}

/**
 * Registers a new user account.
 *
 * @param {{ firstName: string, middleName?: string, lastName: string, email: string, password: string, role: string }} payload
 * @returns {Promise<{ messageStatus: string, message: string }>}
 */
export async function registerApi(payload) {
  return postRequest("/auth/register", payload);
}

/**
 * Verifies email via OTP code.
 *
 * @param {{ email: string, code: string }} payload
 * @returns {Promise<{ messageStatus: string, message: string }>}
 */
export async function verifyEmailApi(payload) {
  return postRequest("/auth/verify", payload);
}

/**
 * Resends verification code to the given email.
 *
 * @param {{ email: string }} payload
 * @returns {Promise<{ messageStatus: string, message: string }>}
 */
export async function resendVerificationCodeApi(payload) {
  return postRequest("/auth/send-re-verify", payload);
}

/**
 * Sends a password reset verification code to email.
 *
 * @param {{ email: string }} payload
 * @returns {Promise<{ messageStatus: string, message: string }>}
 */
export async function sendPasswordResetApi(payload) {
  return postRequest("/auth/send-reset", payload);
}

/**
 * Resets user password with OTP code.
 *
 * @param {{ email: string, code: string, newPassword: string }} payload
 * @returns {Promise<{ messageStatus: string, message: string }>}
 */
export async function resetPasswordApi(payload) {
  return postRequest("/auth/reset-password", payload);
}

/**
 * Refreshes an existing access token using HttpOnly cookie or optional token string.
 *
 * @param {string} [refreshToken]
 * @returns {Promise<{ ok: boolean, success: boolean, messageStatus: string, message: string, data?: any }>}
 */
export async function refreshTokenApi(refreshToken) {
  return postRequest(
    "/auth/refresh-token",
    refreshToken ? { refreshToken } : undefined
  );
}

/**
 * Logs out the user on the server, revoking the session and clearing HttpOnly cookies.
 *
 * @param {string} [refreshToken]
 * @returns {Promise<{ ok: boolean, success: boolean, messageStatus: string, message: string, data?: any }>}
 */
export async function logoutApi(refreshToken) {
  return postRequest(
    "/auth/logout",
    refreshToken ? { refreshToken } : undefined
  );
}
