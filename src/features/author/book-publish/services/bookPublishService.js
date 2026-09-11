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
  const res = await getHelper({ url: `${API_BASE}/genres/viewAll` });
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
    url: `${API_BASE}/authors/book/${safeId}`,
  });
  return res?.data ?? res;
}

/**
 * Publishes a new book with form data (cover, PDF, metadata).
 *
 * @param {FormData} formData
 * @param {Function} onProgress
 */
export async function publishNewBook(formData, onProgress) {
  return postFormDataHelper({
    url: `${API_BASE}/authors/publishBook`,
    formData,
    onUploadProgress: onProgress,
  });
}

/**
 * Saves a book as draft.
 *
 * @param {FormData} formData
 * @param {Function} onProgress
 */
export async function saveBookDraft(formData, onProgress) {
  return postFormDataHelper({
    url: `${API_BASE}/authors/saveDraft`,
    formData,
    onUploadProgress: onProgress,
  });
}

/**
 * Updates an existing book draft.
 *
 * @param {string|number} draftId
 * @param {FormData} formData
 * @param {Function} onProgress
 */
export async function updateBookDraft(draftId, formData, onProgress) {
  const safeId = encodeURIComponent(sanitizeId(draftId));
  return postFormDataHelper({
    url: `${API_BASE}/authors/updateDraft/${safeId}`,
    formData,
    onUploadProgress: onProgress,
  });
}

