import logger from "@/lib/logger";

/**
 * Safely decodes a JWT base64url string.
 *
 * @param {string} rawToken
 * @returns {Object|null} Decoded JSON payload or null if invalid
 */
export function decodeJwt(rawToken) {
  if (!rawToken || typeof rawToken !== "string") return null;

  try {
    const parts = rawToken.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    logger.error("Failed to decode JWT token:", error);
    return null;
  }
}


/**
 * Checks if a JWT token is expired.
 *
 * @param {string} rawToken
 * @returns {boolean} True if expired or invalid, false otherwise
 */
export function isJwtExpired(rawToken) {
  if (!rawToken) return true;

  const payload = decodeJwt(rawToken);
  if (!payload || typeof payload.exp !== "number") return true;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds;
}

/**
 * Extracts structured user data from a JWT token.
 *
 * @param {string} rawToken
 * @returns {{ firstName: string, middleName?: string, lastName: string, role: string, userId: string|number, email?: string }|null}
 */
export function extractUserFromToken(rawToken) {
  const payload = decodeJwt(rawToken);
  if (!payload) return null;

  return {
    firstName: payload.firstName || "",
    middleName: payload.middleName || "",
    lastName: payload.lastName || "",
    fullName: [payload.firstName, payload.lastName].filter(Boolean).join(" "),
    role: payload.role || "",
    userId: payload.userId || payload.id || payload.sub || "",
    sub: payload.sub || payload.email || "",
    email: payload.email || payload.sub || "",
  };
}
