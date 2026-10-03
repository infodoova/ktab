import DOMPurify from "dompurify";

/**
 * Strips HTML tags and trims whitespace from a string to prevent XSS.
 *
 * @param {any} input
 * @returns {string}
 */
export function sanitizeText(input) {
  if (input === null || input === undefined) return "";
  if (typeof input !== "string") return String(input).trim();
  
  // Replace HTML tag brackets and trim
  return input
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Sanitizes HTML content using DOMPurify for rich text / markdown rendering.
 *
 * @param {string} dirtyHtml
 * @param {Object} options
 * @returns {string}
 */
export function sanitizeHtml(dirtyHtml, options = {}) {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
  
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "span", "div",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "code", "pre", "a",
      "hr", "table", "thead", "tbody", "tr", "th", "td",
      "sup", "sub", "del", "s", "button"
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "class", "dir", "title",
      "data-page", "data-citation-id", "data-snippet", "type", "role", "tabindex"
    ],
    ...options,
  });
}

/**
 * Sanitizes an ID (or route param) to ensure it contains only safe alphanumeric characters, dashes, or underscores.
 * Prevents URL parameter injection and path traversal.
 *
 * @param {string|number} id
 * @returns {string}
 */
export function sanitizeId(id) {
  if (id === null || id === undefined) return "";
  const strId = String(id).trim();
  // Allow alphanumeric, dashes, underscores
  return strId.replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * Checks if a given target URL is a safe, allowed redirect destination.
 * Prevents Open Redirect and javascript:/data: pseudo-protocol attacks.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isAllowedRedirectUrl(url) {
  if (!url || typeof url !== "string") return false;

  const trimmed = url.trim();

  // 1. Block dangerous protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }

  // 2. Allow safe relative paths (e.g. /reader/home, /login, but NOT //evil.com)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return true;
  }

  // 3. For absolute URLs, verify allowed domains
  try {
    const parsed = new URL(trimmed, typeof window !== "undefined" ? window.location.origin : "https://ktab.app");
    
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    
    // Allowed hostnames
    const allowedHosts = [
      "ktab.app",
      "www.ktab.app",
      "localhost",
      "127.0.0.1",
    ];

    if (allowedHosts.includes(hostname) || hostname.endsWith(".ktab.app") || hostname.endsWith(".ngrok-free.dev")) {
      return true;
    }

    // Match current window origin host if in browser
    if (typeof window !== "undefined" && window.location.hostname === hostname) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Sanitizes and validates standard email format.
 *
 * @param {string} email
 * @returns {string}
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

// Re-export file and security validation functions from centralized validation utility
export {
  validateFile,
  validateSecureBookDocument,
  validateImageDimensions,
} from "@/utils/validation";

