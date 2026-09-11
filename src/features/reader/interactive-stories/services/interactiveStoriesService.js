import { getHelper, postHelper } from "@/core/api/apiHelpers";
import { AlertToast } from "@/components/myui/AlertToast";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Validates API response status and displays error toasts if necessary.
 */
function handleApiError(response) {
  if (response?.messageStatus === "ERROR") {
    const errorMsg = response.message || "حدث خطأ غير متوقع";
    AlertToast(errorMsg, "error", "خطأ في العملية");
    throw new Error(errorMsg);
  }
}

/**
 * Fetches paginated list of interactive stories.
 *
 * @param {{ page?: number, size?: number }} params
 * @returns {Promise<{ content: any[], totalPages: number }>}
 */
export async function fetchInteractiveStories({ page = 0, size = 8 } = {}) {
  try {
    const res = await getHelper({
      url: `${API_BASE}/stories`,
      pagination: true,
      page,
      size,
    });
    handleApiError(res);

    const data = res?.data;
    const content = Array.isArray(data?.content) ? data.content : [];
    const totalPages = typeof data?.totalPages === "number" ? data.totalPages : 1;

    return { content, totalPages };
  } catch (error) {
    if (error?.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل الاتصال بالخادم", "error", "خطأ في الشبكة");
    return { content: [], totalPages: 1 };
  }
}

/**
 * Fetches specific details for an interactive story.
 *
 * @param {string|number} storyId
 * @returns {Promise<any>}
 */
export async function fetchInteractiveStoryDetails(storyId) {
  try {
    const res = await getHelper({
      url: `${API_BASE}/stories/${storyId}`,
    });
    handleApiError(res);
    return res?.data ?? res;
  } catch (error) {
    if (error?.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل في جلب تفاصيل القصة", "error", "خطأ");
    throw error;
  }
}

/**
 * Starts a new interactive story session.
 *
 * @param {string|number} storyId
 * @returns {Promise<any>}
 */
export async function startInteractiveStorySession(storyId) {
  try {
    const res = await postHelper({
      url: `${API_BASE}/sessions/start/${storyId}`,
    });
    handleApiError(res);
    return res?.data ?? res;
  } catch (error) {
    if (error?.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل في بدء الجلسة", "error", "خطأ");
    throw error;
  }
}

/**
 * Submits user's choice to progress the interactive story session.
 *
 * @param {string|number} sessionId
 * @param {string} choiceId
 * @returns {Promise<any>}
 */
export async function submitInteractiveChoice(sessionId, choiceId) {
  try {
    const res = await postHelper({
      url: `${API_BASE}/sessions/${sessionId}/choose`,
      body: { choiceId },
    });
    handleApiError(res);
    return res?.data ?? res;
  } catch (error) {
    if (error?.message && error.message !== "[object Object]") throw error;
    AlertToast("فشل في إرسال الاختيار", "error", "خطأ");
    throw error;
  }
}

/**
 * Normalizes API response choices (A, B, C, D) into an array of UI nodes.
 */
export function mapApiChoicesToNodes(data) {
  if (!data) return [];

  return ["A", "B", "C", "D"]
    .filter((key) => data[key])
    .map((key) => ({
      nodeId: key,
      nodeText: data[key].text,
      nodeDescription: "",
    }));
}
