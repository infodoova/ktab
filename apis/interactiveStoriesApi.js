import { getHelper, postHelper } from "./apiHelpers";
import { AlertToast } from "../src/components/myui/AlertToast";

/**
 * Checks if the API response contains an error status and shows a toast
 * @param {Object} response - The API response object
 * @throws {Error} If the messageStatus is "ERROR"
 */
function handleApiError(response) {
  if (response?.messageStatus === "ERROR") {
    const errorMsg = response.message || "حدث خطأ غير متوقع";
    AlertToast(errorMsg, "error", "خطأ في العملية");
    throw new Error(errorMsg);
  }
}

/**
 * Get all interactive stories (paginated)
 *
 * @param {Object} params - Pagination parameters
 * @param {number} params.page - Page number (default: 0)
 * @param {number} params.size - Items per page (default: 10)
 * @returns {Promise<Object>} Paginated list of stories
 */
export async function getStories({ page = 0, size = 8 } = {}) {
  try {
    const res = await getHelper({
      url: `${import.meta.env.VITE_API_URL}/stories`,
      pagination: true,
      page,
      size,
    });
    handleApiError(res);
    return res;
  } catch (error) {
    if (error.message && error.message !== "[object Object]") {
      // If it's an error we threw in handleApiError, it's already toasted
      throw error;
    }
    AlertToast("فشل الاتصال بالخادم", "error", "خطأ في الشبكة");
    throw error;
  }
}

/**
 * Get details for a specific story
 *
 * @param {string|number} storyId - The ID of the story
 * @returns {Promise<Object>} Story details
 */
export async function getStoryDetails(storyId) {
  try {
    const res = await getHelper({
      url: `${import.meta.env.VITE_API_URL}/stories/${storyId}`,
    });
    handleApiError(res);
    return res;
  } catch (error) {
    if (error.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل في جلب تفاصيل القصة", "error", "خطأ");
    throw error;
  }
}

/**
 * Start a new interactive story session
 *
 * @param {string|number} storyId - The ID of the story to start
 * @returns {Promise<Object>} Response containing sessionId, turnIndex, sceneText, and choices A-D
 */
export async function startSession(storyId) {
  try {
    const res = await postHelper({
      url: `${import.meta.env.VITE_API_URL}/sessions/start/${storyId}`,
    });
    handleApiError(res);
    return res;
  } catch (error) {
    if (error.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل في بدء الجلسة", "error", "خطأ");
    throw error;
  }
}

/**
 * Choose an option and generate the next story turn
 *
 * @param {string|number} sessionId - The ID of the active session
 * @param {string} choiceId - The ID of the choice (e.g., "A", "B", "C", "D")
 * @returns {Promise<Object>} Response containing the next turn data (turnIndex, sceneText, choices)
 */
export async function submitChoice(sessionId, choiceId) {
  try {
    const res = await postHelper({
      url: `${import.meta.env.VITE_API_URL}/sessions/${sessionId}/choose`,
      body: { choiceId },
    });
    handleApiError(res);
    return res;
  } catch (error) {
    if (error.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل في إرسال الاختيار", "error", "خطأ");
    throw error;
  }
}

// ============================================================
// API RESPONSE NORMALIZATION HELPERS
// ============================================================

/**
 * Maps the API choice format (A, B, C, D) to a consistent array structure for the UI
 *
 * @param {Object} data - The raw turn data from the API
 * @returns {Array} Array of node objects [{nodeId, nodeText, nodeDescription}]
 */
export function mapApiChoicesToNodes(data) {
  if (!data) return [];

  return ["A", "B", "C", "D"]
    .filter((key) => data[key])
    .map((key) => ({
      nodeId: key,
      nodeText: data[key].text,
      nodeDescription: "", // API currently only provides text
    }));
}
