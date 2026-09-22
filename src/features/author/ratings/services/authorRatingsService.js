import { getHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches reviews and ratings for an author's book.
 *
 * @param {string|number} bookId
 */
export async function fetchBookReviews(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const res = await getHelper({
    url: `${API_BASE}/books/${safeId}/reviews`,
  });
  return Array.isArray(res?.data || res) ? (res.data || res) : [];
}


/**
 * Fetches author's overall analytics and rating metrics.
 */
export async function fetchAuthorRatingStats() {
  const res = await getHelper({
    url: `${API_BASE}/authors/me/analytics`,
  });
  return res?.data ?? res;
}
