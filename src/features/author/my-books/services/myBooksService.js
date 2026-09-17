import { getHelper, deleteHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches books by author with status and pagination.
 *
 * @param {{ authorId: string|number, status?: string, page?: number, size?: number }} params
 */
export async function fetchAuthorBooks({ authorId, status = "PUBLISHED", page = 0, size = 8 } = {}) {
  const safeAuthorId = encodeURIComponent(sanitizeId(authorId));
  const safeStatus = encodeURIComponent(sanitizeId(status));
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.max(1, Math.min(50, parseInt(size, 10) || 8));

  const res = await getHelper({
    url: `${API_BASE}/authors/getBooksByAuthor/${safeAuthorId}?status=${safeStatus}`,
    pagination: true,
    page: safePage,
    size: safeSize,
  });

  const data = res?.data ?? res ?? {};
  const content = Array.isArray(data.content)
    ? data.content
    : Array.isArray(res?.content)
    ? res.content
    : [];

  const totalElements = typeof data.totalElements === "number"
    ? data.totalElements
    : typeof res?.totalElements === "number"
    ? res.totalElements
    : content.length;

  const totalPages = typeof data.totalPages === "number"
    ? data.totalPages
    : typeof res?.totalPages === "number"
    ? res.totalPages
    : 1;

  return {
    content,
    totalPages,
    totalElements,
    pageNumber: typeof data.pageNumber === "number" ? data.pageNumber : safePage,
    pageSize: typeof data.pageSize === "number" ? data.pageSize : safeSize,
    last: typeof data.last === "boolean" ? data.last : undefined,
    messageStatus: res?.messageStatus,
    message: res?.message,
    data,
  };
}

/**
 * Deletes an author book by ID.
 *
 * @param {string|number} bookId
 */
export async function deleteAuthorBook(bookId) {
  const safeBookId = encodeURIComponent(sanitizeId(bookId));
  return deleteHelper({
    url: `${API_BASE}/authors/deleteBook/${safeBookId}`,
  });
}

