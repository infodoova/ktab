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
 *
 * @param {string|number} bookId
 */
export async function checkBookReviewed(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/reader/books/${safeId}/isReviewed`,
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
 */
export async function fetchBookReviews(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const res = await getHelper({
    url: `${API_BASE}/reader/books/${safeId}/reviews`,
  });

  let content = [];
  if (Array.isArray(res?.content?.content)) {
    content = res.content.content;
  } else if (Array.isArray(res?.data?.content)) {
    content = res.data.content;
  } else if (Array.isArray(res?.content)) {
    content = res.content;
  } else if (Array.isArray(res?.data)) {
    content = res.data;
  }

  return content;
}

/**
 * Submits a new user review and rating for a book.
 *
 * @param {string|number} bookId
 * @param {{ rate: number, comment: string }} payload
 */
export async function submitBookReview(bookId, payload) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return postHelper({
    url: `${API_BASE}/reviews/addReview/${safeId}`,
    body: payload,
  });
}

/**
 * Updates an existing review for a book.
 *
 * @param {string|number} reviewId
 * @param {{ rate: number, comment: string }} payload
 */
export async function updateBookReview(reviewId, payload) {
  const safeId = encodeURIComponent(sanitizeId(reviewId));
  return patchHelper({
    url: `${API_BASE}/reviews/updateReview/${safeId}`,
    body: payload,
  });
}

/**
 * Deletes a review.
 *
 * @param {string|number} reviewId
 */
export async function deleteBookReview(reviewId) {
  const safeId = encodeURIComponent(sanitizeId(reviewId));
  return deleteHelper({
    url: `${API_BASE}/reviews/deleteReview/${safeId}`,
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
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return postHelper({
    url: `${API_BASE}/library/assignBook/${safeId}`,
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

