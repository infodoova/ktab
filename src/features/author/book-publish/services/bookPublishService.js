import {
  getHelper,
  postFormDataHelper,
} from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches all available genres and subgenres for book creation.
 */
export async function fetchGenresList() {
  const res = await getHelper({ url: `${API_BASE}/genres` });
  return res?.data ?? [];
}

/**
 * Fetches existing book draft or details for editing.
 *
 * @param {string|number} draftId
 */
export async function fetchBookDraft(draftId) {
  const safeId = encodeURIComponent(sanitizeId(draftId));
  const res = await getHelper({
    url: `${API_BASE}/authors/me/books/${safeId}`,
  });
  return res?.data ?? res;
}

/**
 * Publishes or creates a new book with multipart form data:
 * - bookDto (JSON Blob containing BookRequestDto with status: 'PUBLISHED' or 'DRAFT')
 * - coverImage (Binary file)
 * - pdfFile (Binary file)
 *
 * @param {FormData} formData
 * @param {Function} onProgress
 */
export async function publishNewBook(formData, onProgress) {
  return postFormDataHelper({
    url: `${API_BASE}/authors/me/books`,
    formData,
    onUploadProgress: onProgress,
  });
}

/**
 * Updates an existing author book (status can be 'PUBLISHED' or 'DRAFT').
 *
 * @param {string|number} bookId
 * @param {FormData} formData
 */
export async function updateAuthorBook(bookId, formData) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return patchHelper({
    url: `${API_BASE}/authors/me/books/${safeId}`,
    body: formData,
  });
}

/**
 * Saves a book as draft (calls POST /authors/me/books with status: 'DRAFT').
 * Kept for backward compatibility if called directly.
 *
 * @param {FormData} formData
 * @param {Function} onProgress
 */
export async function saveBookDraft(formData, onProgress) {
  return postFormDataHelper({
    url: `${API_BASE}/authors/me/books`,
    formData,
    onUploadProgress: onProgress,
  });
}

/**
 * Updates an existing book draft.
 * Kept for backward compatibility with updateAuthorBook.
 *
 * @param {string|number} draftId
 * @param {FormData} formData
 */
export async function updateBookDraft(draftId, formData) {
  return updateAuthorBook(draftId, formData);
}


