import {
  getHelper,
  postHelper,
  deleteHelper,
  patchHelper,
} from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches book details metadata by ID.
 *
 * @param {string|number} bookId
 */
export async function fetchBookDetailsById(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/reader/viewBook/${safeId}`,
  });
}

/**
 * Checks if user has already reviewed the book.
 * Matches Swagger: GET /api/v1/reviews/books/{bookId}/reviews/status
 *
 * @param {string|number} bookId
 */
export async function checkBookReviewed(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/reviews/books/${safeId}/reviews/status`,
  });
}

/**
 * Checks if book is already in user's library.
 *
 * @param {string|number} bookId
 */
export async function checkBookAssigned(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/library/isAssigned/${safeId}`,
  });
}

/**
 * Fetches user ratings and reviews for a book.
 *
 * @param {string|number} bookId
 * @param {Object} [params]
 * @param {number} [params.page=0]
 * @param {number} [params.size=10]
 */
export async function fetchBookReviews(bookId, { page = 0, size = 10 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const res = await getHelper({
    url: `${API_BASE}/reader/books/${safeId}/reviews`,
    pagination: true,
    page,
    size,
  });

  const rawData = res?.data ?? res;
  let content = [];
  if (Array.isArray(rawData?.content)) {
    content = rawData.content;
  } else if (Array.isArray(rawData)) {
    content = rawData;
  } else if (Array.isArray(res?.content)) {
    content = res.content;
  }

  return {
    content,
    pageNumber: rawData?.pageNumber ?? page,
    pageSize: rawData?.pageSize ?? size,
    totalElements: rawData?.totalElements ?? content.length,
    totalPages: rawData?.totalPages ?? 1,
    last: rawData?.last ?? true,
  };
}

/**
 * Submits a new user review and rating for a book.
 * Matches Swagger: POST /api/v1/reviews/books/{bookId}/addReview
 *
 * @param {string|number} bookId
 * @param {{ rating: number, comment?: string }} payload
 */
export async function submitBookReview(bookId, { rating, comment = "" } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const numericRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
  return postHelper({
    url: `${API_BASE}/reviews/books/${safeId}/addReview`,
    body: {
      rating: numericRating,
      comment: typeof comment === "string" ? comment.trim() : "",
    },
  });
}

/**
 * Updates an existing review for a book.
 * Matches Swagger: PATCH /api/v1/reviews/books/{bookId}/reviews/{reviewId}
 *
 * @param {string|number} bookId
 * @param {string|number} reviewId
 * @param {{ rating: number, comment?: string }} payload
 */
export async function updateBookReview(bookId, reviewId, { rating, comment = "" } = {}) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  const safeReviewId = encodeURIComponent(sanitizeId(reviewId));
  const numericRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
  return patchHelper({
    url: `${API_BASE}/reviews/books/${safeBookId}/reviews/${safeReviewId}`,
    body: {
      rating: numericRating,
      comment: typeof comment === "string" ? comment.trim() : "",
    },
  });
}

/**
 * Deletes a review for a specific book.
 *
 * @param {string|number} bookId
 * @param {string|number} reviewId
 */
export async function deleteBookReview(bookId, reviewId) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  const safeReviewId = encodeURIComponent(sanitizeId(reviewId));
  return deleteHelper({
    url: `${API_BASE}/reviews/books/${safeBookId}/reviews/${safeReviewId}`,
  });
}

/**
 * Fetches similar books based on genres and author.
 *
 * @param {string|number} bookId
 */
export async function fetchSimilarBooks(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const res = await getHelper({
    url: `${API_BASE}/reader/similar/${safeId}`,
    pagination: true,
    page: 0,
    size: 4,
  });
  return res?.data?.content || [];
}

/**
 * Adds a book to the user's library.
 *
 * @param {string|number} bookId
 */
export async function assignBookToLibrary(bookId) {
  const cleanId = Number(sanitizeId(bookId));
  return postHelper({
    url: `${API_BASE}/library/assignBook`,
    body: {
      bookId: cleanId,
    },
  });
}

/**
 * Removes a book from the user's library.
 *
 * @param {string|number} bookId
 */
export async function removeBookFromLibrary(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return deleteHelper({
    url: `${API_BASE}/library/removeBook/${safeId}`,
  });
}

