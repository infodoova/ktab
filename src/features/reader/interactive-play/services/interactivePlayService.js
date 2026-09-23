import { postHelper } from "@/core/api/apiHelpers";
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

// In-flight promise registries to collapse duplicate simultaneous network calls
const inFlightStartRequests = new Map();
const inFlightChoiceRequests = new Map();

/**
 * Starts an interactive story session.
 * Merges concurrent identical start requests to prevent duplicate backend session creation.
 *
 * @param {string|number} storyId
 * @returns {Promise<any>}
 */
export async function startInteractiveStorySession(storyId) {
  const cacheKey = String(storyId);
  if (inFlightStartRequests.has(cacheKey)) {
    return inFlightStartRequests.get(cacheKey);
  }

  const promise = (async () => {
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
    } finally {
      inFlightStartRequests.delete(cacheKey);
    }
  })();

  inFlightStartRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Submits user's choice to progress the interactive story session.
 * Merges concurrent identical submissions to prevent duplicate branch choices.
 *
 * @param {string|number} sessionId
 * @param {string} choiceId
 * @returns {Promise<any>}
 */
export async function submitInteractiveChoice(sessionId, choiceId) {
  const cacheKey = `${sessionId}_${choiceId}`;
  if (inFlightChoiceRequests.has(cacheKey)) {
    return inFlightChoiceRequests.get(cacheKey);
  }

  const promise = (async () => {
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
    } finally {
      inFlightChoiceRequests.delete(cacheKey);
    }
  })();

  inFlightChoiceRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Clears any in-flight request records for a given story.
 * Used during explicit session restarts to guarantee fresh initiation.
 */
export function clearSessionRequestCache(storyId) {
  if (storyId) {
    inFlightStartRequests.delete(String(storyId));
  } else {
    inFlightStartRequests.clear();
  }
  inFlightChoiceRequests.clear();
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
