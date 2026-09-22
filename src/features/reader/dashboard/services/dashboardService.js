import { getHelper, deleteHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches user's saved/assigned library books.
 *
 * @param {{ page?: number, size?: number }} params
 * @returns {Promise<any>}
 */
export async function fetchMyLibraryBooks({ page = 0, size = 8 } = {}) {
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.max(1, Math.min(50, parseInt(size, 10) || 8));
  return getHelper({
    url: `${API_BASE}/library`,
    pagination: true,
    page: safePage,
    size: safeSize,
  });
}

/**
 * Fetches recommended / catalog books for reader dashboard.
 *
 * @param {{ page?: number, size?: number }} params
 * @returns {Promise<any>}
 */
export async function fetchRecommendedBooks({ page = 0, size = 8 } = {}) {
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.max(1, Math.min(50, parseInt(size, 10) || 8));
  return getHelper({
    url: `${API_BASE}/books`,
    pagination: true,
    page: safePage,
    size: safeSize,
  });
}

/**
 * Removes a book from the user's library.
 *
 * @param {string|number} bookId
 * @returns {Promise<any>}
 */
export async function removeBookFromLibrary(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return deleteHelper({
    url: `${API_BASE}/library/books/${safeId}`,
  });
}

