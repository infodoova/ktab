import { getHelper, postHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches auto-incremented paginated reader content for a book starting with 100% accuracy
 * from the book's true start, strictly excluding appendixes and bibliographies.
 * Matches: GET /api/books/{bookId}/pages?page={page}&wordsPerPage={wordsPerPage}
 *
 * @param {string|number} bookId
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.wordsPerPage=80]
 * @returns {Promise<any>}
 */
export async function fetchReaderPage(bookId, { page = 1, wordsPerPage = 80 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeWords = Math.max(1, parseInt(wordsPerPage, 10) || 80);
  const query = new URLSearchParams({ page: safePage, wordsPerPage: safeWords }).toString();

  try {
    const res = await getHelper({
      url: `${API_BASE}/books/${safeId}/pages?${query}`,
    });
    if (res?.messageStatus === "SUCCESS" || res?.data) {
      return res;
    }
  } catch {
    // Try reader-pages path fallback
  }

  return getHelper({
    url: `${API_BASE}/books/${safeId}/reader-pages?${query}`,
  });
}

/**
 * Fetches the hierarchical navigation tree (chapters, parts) with direct reader page mapping,
 * plus separated appendixes and bibliographies.
 * Matches: GET /api/books/{bookId}/navigator?wordsPerPage={wordsPerPage}
 *
 * @param {string|number} bookId
 * @param {number} [wordsPerPage=80]
 * @returns {Promise<any>}
 */
export async function fetchBookNavigator(bookId, wordsPerPage = 80) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safeWords = Math.max(1, parseInt(wordsPerPage, 10) || 80);
  return getHelper({
    url: `${API_BASE}/books/${safeId}/navigator?wordsPerPage=${safeWords}`,
  });
}

/**
 * Fetches the complete authentic content for a specific section (e.g. appendix, bibliography, glossary)
 * by section ID directly from the database.
 * Matches: GET /api/books/{bookId}/sections/{sectionId}
 *
 * @param {string|number} bookId
 * @param {string|number} sectionId
 * @returns {Promise<any>}
 */
export async function fetchBookSectionContent(bookId, sectionId) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  const safeSectionId = encodeURIComponent(sanitizeId(sectionId));
  return getHelper({
    url: `${API_BASE}/books/${safeBookId}/sections/${safeSectionId}`,
  });
}


/**
 * Saves current reading progress (page number, timestamp).
 * Matches: POST /api/reader/progress/{bookId}
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
