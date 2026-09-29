import { getHelper, postHelper, deleteHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const RAW_API_BASE = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const API_BASE = RAW_API_BASE.endsWith("/api/v1")
  ? RAW_API_BASE
  : (RAW_API_BASE ? `${RAW_API_BASE}/api/v1` : "/api/v1");

/**
 * Service for AI Book Page Image Generation and Gallery Management.
 * Communicates with backend /api/v1/books/{bookId}/images/* endpoints.
 */

/**
 * Fetches dynamic themes and aspect ratio filters for image generation.
 * GET /api/v1/books/{bookId}/images/filters
 *
 * @param {string|number} bookId
 * @returns {Promise<{ status: number, message: string, data: { themes: Array, aspectRatios: Array } }>}
 */
export async function fetchImageFilters(bookId) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  return getHelper({
    url: `${API_BASE}/books/${safeId}/images/filters`,
  });
}

/**
 * Triggers image generation for a specific page context.
 * POST /api/v1/books/{bookId}/images/generate
 *
 * @param {string|number} bookId
 * @param {Object} payload
 * @param {string} payload.context - Text context from current page
 * @param {string} payload.theme - Filter theme value (e.g. WATERCOLOR)
 * @param {string} payload.aspectRatio - Filter aspect ratio value (e.g. PORTRAIT_3_4)
 * @param {string} [payload.styleNotes] - Optional creative direction
 * @returns {Promise<{ status: number, message: string, data: Object }>}
 */
export async function triggerImageGeneration(bookId, { context, theme, aspectRatio, styleNotes }) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const body = {
    context: String(context || "").trim(),
    theme: String(theme || "").trim(),
    aspectRatio: String(aspectRatio || "").trim(),
    ...(styleNotes ? { styleNotes: String(styleNotes).trim() } : {}),
  };

  return postHelper({
    url: `${API_BASE}/books/${safeId}/images/generate`,
    body,
  });
}

/**
 * Polls the current status of an ongoing image generation job.
 * GET /api/v1/books/{bookId}/images/{imageId}/status
 *
 * @param {string|number} bookId
 * @param {string} imageId
 * @returns {Promise<{ status: number, message: string, data: Object }>}
 */
export async function pollImageGenerationStatus(bookId, imageId) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  const safeImageId = encodeURIComponent(sanitizeId(imageId));

  return getHelper({
    url: `${API_BASE}/books/${safeBookId}/images/${safeImageId}/status`,
  });
}

/**
 * Fetches paginated gallery of generated images for a book.
 * GET /api/v1/books/{bookId}/images?page={page}&size={size}
 *
 * @param {string|number} bookId
 * @param {Object} [params]
 * @param {number} [params.page=0]
 * @param {number} [params.size=12]
 * @returns {Promise<{ status: number, message: string, data: Object }>}
 */
export async function fetchBookGeneratedImages(bookId, { page = 0, size = 12 } = {}) {
  const safeId = encodeURIComponent(sanitizeId(bookId));
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.max(1, parseInt(size, 10) || 12);

  return getHelper({
    url: `${API_BASE}/books/${safeId}/images?page=${safePage}&size=${safeSize}`,
  });
}

/**
 * Deletes a previously generated image.
 * DELETE /api/v1/books/{bookId}/images/{imageId}
 *
 * @param {string|number} bookId
 * @param {string} imageId
 * @returns {Promise<any>}
 */
export async function deleteBookGeneratedImage(bookId, imageId) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  const safeImageId = encodeURIComponent(sanitizeId(imageId));

  return deleteHelper({
    url: `${API_BASE}/books/${safeBookId}/images/${safeImageId}`,
  });
}

/**
 * Fetches full details for a single generated image.
 * GET /api/v1/books/{bookId}/images/{imageId}
 *
 * @param {string|number} bookId
 * @param {string} imageId
 * @returns {Promise<{ status: number, message: string, data: Object }>}
 */
export async function fetchImageDetails(bookId, imageId) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  const safeImageId = encodeURIComponent(sanitizeId(imageId));

  return getHelper({
    url: `${API_BASE}/books/${safeBookId}/images/${safeImageId}`,
  });
}

/**
 * Fetches all generated images across the reader's account, optionally filtered by bookId.
 * GET /api/v1/reader/images?bookId={bookId}&page={page}&size={size}
 *
 * @param {Object} [params]
 * @param {string|number} [params.bookId] - Optional filter by specific book
 * @param {number} [params.page=0]
 * @param {number} [params.size=12]
 * @returns {Promise<{ status: number, message: string, data: Object }>}
 */
export async function fetchAllReaderImages({ bookId, page = 0, size = 12, sort } = {}) {
  const queryParams = new URLSearchParams();
  if (bookId !== undefined && bookId !== null && String(bookId).trim()) {
    queryParams.append("bookId", encodeURIComponent(sanitizeId(bookId)));
  }
  queryParams.append("page", Math.max(0, parseInt(page, 10) || 0));
  queryParams.append("size", Math.max(1, parseInt(size, 10) || 12));
  if (sort) {
    queryParams.append("sort", sort);
  }

  return getHelper({
    url: `${API_BASE}/reader/images?${queryParams.toString()}`,
  });
}

/**
 * Fetches reader images grouped/separated by book sections.
 * GET /api/v1/reader/images/grouped
 *
 * @returns {Promise<{ status: number, message: string, data: Array<{ bookId: number, bookTitle: string, totalImages: number, images: Array }> }>}
 */
export async function fetchReaderImagesGrouped() {
  return getHelper({
    url: `${API_BASE}/reader/images/grouped`,
  });
}

/**
 * Fetches distinct books with image counts for filter tabs/pills.
 * GET /api/v1/reader/images/books
 *
 * @returns {Promise<{ status: number, message: string, data: Array<{ bookId: number, bookTitle: string, imageCount: number }> }>}
 */
export async function fetchReaderImageBooks() {
  return getHelper({
    url: `${API_BASE}/reader/images/books`,
  });
}
