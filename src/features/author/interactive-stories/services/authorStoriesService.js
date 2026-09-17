import {
  getHelper,
  postFormDataHelper,
  deleteHelper,
} from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Fetches stories created by the current author.
 *
 * @param {{ page?: number, size?: number }} params
 */
export async function fetchMyStories({ page = 0, size = 8 } = {}) {
  const safePage = Math.max(0, parseInt(page, 10) || 0);
  const safeSize = Math.max(1, Math.min(50, parseInt(size, 10) || 8));
  const res = await getHelper({
    url: `${API_BASE}/stories/me`,
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
 * Fetches story details by ID.
 *
 * @param {string|number} storyId
 */
export async function fetchStoryDetails(storyId) {
  const safeId = encodeURIComponent(sanitizeId(storyId));
  return getHelper({
    url: `${API_BASE}/stories/${safeId}`,
  });
}

/**
 * Creates a new interactive story.
 *
 * @param {FormData} formData
 */
export async function createStory(formData) {
  return postFormDataHelper({
    url: `${API_BASE}/stories`,
    formData,
  });
}

/**
 * Deletes an interactive story.
 *
 * @param {string|number} storyId
 */
export async function deleteStory(storyId) {
  const safeId = encodeURIComponent(sanitizeId(storyId));
  return deleteHelper({
    url: `${API_BASE}/stories/${safeId}`,
  });
}

