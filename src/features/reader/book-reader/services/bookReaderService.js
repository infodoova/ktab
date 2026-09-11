import { getHelper, postHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches text content and pages for reading a book.
 *
 * @param {string|number} bookId
 * @returns {Promise<any>}
 */
export async function fetchBookContent(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/reader/books/${safeId}/read`,
  });
}

/**
 * Fetches book metadata for the reader header.
 *
 * @param {string|number} bookId
 * @returns {Promise<any>}
 */
export async function fetchBookMeta(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/reader/viewBook/${safeId}`,
  });
}

/**
 * Saves current reading progress (page number, timestamp).
 *
 * @param {string|number} bookId
 * @param {{ page: number, totalPages: number }} payload
 * @returns {Promise<any>}
 */
export async function saveReadingProgress(bookId, payload) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return postHelper({
    url: `${API_BASE}/reader/progress/${safeId}`,
    body: payload,
  });
}

