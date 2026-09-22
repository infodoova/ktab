/**
 * Manages the non-sensitive session hint flag in browser storage.
 * Contains ZERO tokens, passwords, or personal data.
 * Purely serves as a local signal telling the app on page reload whether
 * an active HttpOnly cookie session might exist, avoiding unnecessary 401 calls for guests.
 */

const SESSION_HINT_KEY = "ktab_has_session";

export function setSessionHint(hasSession = true) {
  try {
    if (hasSession) {
      localStorage.setItem(SESSION_HINT_KEY, "1");
    } else {
      localStorage.removeItem(SESSION_HINT_KEY);
    }
  } catch {}
}

export function hasSessionHint() {
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === "1";
  } catch {
    return false;
  }
}
