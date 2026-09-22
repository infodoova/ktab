import { getHelper, postHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches full book text.
 * Matches: GET /api/v1/books/{bookId}/text
 *
 * @param {string|number} bookId
 * @returns {Promise<any>}
 */
export async function fetchBookText(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/books/${safeId}/text`,
  });
}

/**
 * Fetches text content and pages for reading a book.
 * Calls the primary GET /books/{bookId}/text route with fallback to legacy route.
 *
 * @param {string|number} bookId
 * @returns {Promise<any>}
 */
export async function fetchBookContent(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  try {
    const res = await getHelper({
      url: `${API_BASE}/books/${safeId}/text`,
    });
    if (res?.messageStatus === "SUCCESS" || res?.data) {
      return res;
    }
  } catch (err) {
    // Fallback to legacy reader endpoint if available
  }
  return getHelper({
    url: `${API_BASE}/reader/books/${safeId}/read`,
  });
}

/**
 * Fetches book text by character range.
 * Matches: GET /api/v1/books/{bookId}/text/range?start={start}&end={end}
 *
 * @param {string|number} bookId
 * @param {Object} range
 * @param {number} [range.start=0] - Starting character index (min: 0)
 * @param {number} [range.end=0] - Ending character index (min: 0)
 * @returns {Promise<any>}
 */
export async function fetchBookTextByRange(bookId, { start = 0, end = 0 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safeStart = Math.max(0, parseInt(start, 10) || 0);
  const safeEnd = Math.max(0, parseInt(end, 10) || 0);
  const query = new URLSearchParams({ start: safeStart, end: safeEnd }).toString();

  return getHelper({
    url: `${API_BASE}/books/${safeId}/text/range?${query}`,
  });
}

/**
 * Fetches book text partitioned by page range.
 * Matches: GET /api/v1/books/{bookId}/text/pages?from={from}&to={to}
 *
 * @param {string|number} bookId
 * @param {Object} pages
 * @param {number} [pages.from=1] - Starting page number (min: 1)
 * @param {number} [pages.to=1] - Ending page number (min: 1)
 * @returns {Promise<any>}
 */
export async function fetchBookTextByPages(bookId, { from = 1, to = 1 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safeFrom = Math.max(1, parseInt(from, 10) || 1);
  const safeTo = Math.max(1, parseInt(to, 10) || 1);
  const query = new URLSearchParams({ from: safeFrom, to: safeTo }).toString();

  return getHelper({
    url: `${API_BASE}/books/${safeId}/text/pages?${query}`,
  });
}

/**
 * Fetches book text statistics (word count, character count, page count, etc.).
 * Matches: GET /api/v1/books/{bookId}/text/stats
 *
 * @param {string|number} bookId
 * @returns {Promise<any>}
 */
export async function fetchBookTextStats(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/books/${safeId}/text/stats`,
  });
}

/**
 * Fetches book text by word range.
 * Matches: GET /api/v1/books/{bookId}/text/words?start={start}&end={end}
 *
 * @param {string|number} bookId
 * @param {Object} words
 * @param {number} [words.start=0] - Starting word index (min: 0)
 * @param {number} [words.end=0] - Ending word index (min: 0)
 * @returns {Promise<any>}
 */
export async function fetchBookTextByWords(bookId, { start = 0, end = 0 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safeStart = Math.max(0, parseInt(start, 10) || 0);
  const safeEnd = Math.max(0, parseInt(end, 10) || 0);
  const query = new URLSearchParams({ start: safeStart, end: safeEnd }).toString();

  return getHelper({
    url: `${API_BASE}/books/${safeId}/text/words?${query}`,
  });
}

/**
 * Searches keywords inside book pages with snippet highlighting.
 * Matches: GET /api/v1/books/{bookId}/text/search?q={q}&page={page}&size={size}
 *
 * @param {string|number} bookId
 * @param {Object} searchParams
 * @param {string} searchParams.q - Search keyword
 * @param {number} [searchParams.page=0] - Page number (zero-indexed)
 * @param {number} [searchParams.size=10] - Page size (1 to 50)
 * @returns {Promise<any>}
 */
export async function searchBookText(bookId, { q = "", page = 0, size = 10 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.min(50, Math.max(1, parseInt(size, 10) || 10));
  const query = new URLSearchParams({
    q: q || "",
    page: safePage,
    size: safeSize,
  }).toString();

  return getHelper({
    url: `${API_BASE}/books/${safeId}/text/search?${query}`,
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
    url: `${API_BASE}/books/${safeId}`,
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
