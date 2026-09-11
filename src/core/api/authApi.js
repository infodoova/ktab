import logger from "@/lib/logger";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

/**
 * Standard fetch helper for Auth API endpoints.
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    if (!text || !text.trim()) {
      return { success: response.ok, messageStatus: response.ok ? "SUCCESS" : "ERROR" };
    }
    return JSON.parse(text);
  } catch (error) {
    logger.error(`Auth request failed for ${endpoint}:`, error);
    return {
      messageStatus: "ERROR",
      message: "تعذر الاتصال بخدمة المصادقة",
    };
  }
}


/**
 * Logs in a user.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ messageStatus: string, message: string, data?: string }>}
 */
export async function loginApi(credentials) {
  return postRequest("/auth/login", credentials);
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
 * Refreshes an existing access token.
 *
 * @param {string} token
 * @returns {Promise<Response>}
 */
export async function refreshTokenApi(token) {
  const url = `${API_BASE_URL}/auth/refresh-token`;
  return fetch(url, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
    },
  });
}
