import { postFormDataHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Generates an AI-powered ending/synopsis for a book PDF.
 *
 * @param {{ file: File, wordCount: number|string, audience: string }} params
 */
export async function generateBookEnding({ file, wordCount, audience }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("approxWordCountForEnding", wordCount);
  formData.append("audienceProfile", audience);

  return postFormDataHelper({
    url: `${API_BASE}/book-ending/upload`,
    formData,
  });
}
