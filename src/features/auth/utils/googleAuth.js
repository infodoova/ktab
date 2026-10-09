import { fetchGoogleNonceApi } from "../../../core/api/authApi.js";
import logger from "../../../lib/logger.js";

let _noncePromise = null;

/**
 * Detects whether the current device is an iOS or iPadOS device (iPhone, iPad, iPod).
 * Handles iPadOS desktop mode reporting platform as "MacIntel" with touch points.
 *
 * @param {Navigator|null} [nav]
 * @returns {boolean}
 */
export function isIOSDevice(nav = (typeof navigator !== "undefined" ? navigator : null)) {
  if (!nav) return false;
  const ua = nav.userAgent || "";
  const isIOSUserAgent = /iPhone|iPad|iPod/i.test(ua);
  const isIPadOS =
    nav.platform === "MacIntel" &&
    typeof nav.maxTouchPoints === "number" &&
    nav.maxTouchPoints > 1;

  return Boolean(isIOSUserAgent || isIPadOS);
}

/**
 * Returns the absolute login_uri for Google redirect mode.
 * e.g. https://api.ktab.app/api/v1/auth/google/redirect
 *
 * @param {string} [envApiUrl]
 * @param {string} [origin]
 * @returns {string}
 */
export function getGoogleRedirectUri(
  envApiUrl = import.meta?.env?.VITE_API_URL,
  origin = (typeof window !== "undefined" ? window.location?.origin : "https://ktab.app")
) {
  const base = (envApiUrl || "/api/v1").replace(/\/$/, "");
  const path = "/auth/google/redirect";

  if (base.startsWith("http://") || base.startsWith("https://")) {
    return `${base}${path}`;
  }

  const cleanOrigin = (origin || "https://ktab.app").replace(/\/$/, "");
  const cleanBase = base.startsWith("/") ? base : `/${base}`;
  return `${cleanOrigin}${cleanBase}${path}`;
}

/**
 * Fetches the Google nonce once per page load and reuses the Promise
 * to prevent React StrictMode from triggering two requests that overwrite the cookie.
 *
 * @param {Function} [fetcher]
 * @returns {Promise<string|null>}
 */
export function getCachedGoogleNonce(fetcher = fetchGoogleNonceApi) {
  if (!_noncePromise) {
    _noncePromise = fetcher()
      .then((res) => {
        if (res?.ok && res?.nonce) {
          return res.nonce;
        }
        _noncePromise = null;
        return null;
      })
      .catch((err) => {
        logger.error("Failed to obtain nonce:", err);
        _noncePromise = null;
        return null;
      });
  }
  return _noncePromise;
}

/**
 * Resets the cached nonce Promise (e.g. on user retry or testing).
 */
export function resetGoogleNonceCache() {
  _noncePromise = null;
}

/**
 * Parses query-string style key-value pairs from URL hash fragment.
 * e.g. "#pending=TOKEN_ABC" -> { pending: "TOKEN_ABC" }
 *
 * @param {string} [hash]
 * @returns {Record<string, string>}
 */
export function parseUrlFragment(hash = "") {
  if (!hash || typeof hash !== "string") return {};
  const clean = hash.replace(/^#/, "");
  if (!clean) return {};
  const params = new URLSearchParams(clean);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * Removes ?google= parameter and hash fragment from the address bar
 * via history.replaceState to prevent reload replay.
 *
 * @param {string} [currentHref]
 */
export function cleanGoogleRedirectUrl(
  currentHref = (typeof window !== "undefined" ? window.location.href : "")
) {
  if (typeof window === "undefined" || !window.history?.replaceState) return;
  try {
    const url = new URL(currentHref || window.location.href);
    url.searchParams.delete("google");
    url.hash = "";
    const cleanPath = url.pathname + (url.search ? url.search : "");
    window.history.replaceState(null, "", cleanPath);
  } catch {
    window.history.replaceState(null, "", window.location.pathname || "/login");
  }
}
