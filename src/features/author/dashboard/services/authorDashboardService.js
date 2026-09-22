import { getHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches author analytics summary (ratings, total reads, reviews, books).
 */
export async function fetchAuthorAnalytics() {
  return getHelper({
    url: `${API_BASE}/authors/me/analytics`,
  });
}

/**
 * Fetches author books analytics with pagination.
 *
 * @param {{ page?: number, size?: number }} params
 */
export async function fetchAuthorBookAnalytics({ page = 0, size = 10 } = {}) {
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.max(1, Math.min(50, parseInt(size, 10) || 10));
  return getHelper({
    url: `${API_BASE}/authors/me/book-analytics`,
    pagination: true,
    page: safePage,
    size: safeSize,
  });
}

/**
 * Fetches reader age demographics stats for an author's book.
 *
 * @param {string|number} bookId
 */
export async function fetchBookAgeStats(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const res = await getHelper({
    url: `${API_BASE}/authors/books/${safeId}/ratings/age-stats`,
  });
  return Array.isArray(res?.data || res) ? (res.data || res) : [];
}

/**
 * Fetches most read chapters/stats for an author's book.
 *
 * @param {string|number} bookId
 */
export async function fetchBookMostReadStats(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const res = await getHelper({
    url: `${API_BASE}/authors/books/${safeId}/most-read`,
  });
  return Array.isArray(res?.data || res) ? (res.data || res) : [];
}

/**
 * Fetches all genres.
 */
export async function fetchAllGenres() {
  const res = await getHelper({
    url: `${API_BASE}/genres`,
  });
  return Array.isArray(res?.data) ? res.data : [];
}

