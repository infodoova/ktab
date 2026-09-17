import { postFormDataHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Creates a new interactive story via multipart form-data.
 *
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export async function createNewInteractiveStory(formData) {
  return postFormDataHelper({
    url: `${API_BASE}/stories`,
    formData,
  });
}

export default createNewInteractiveStory;
