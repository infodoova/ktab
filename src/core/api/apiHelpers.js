import tokenManager from "../services/tokenManager";
import { useAuthStore } from "../store/authStore";
import logger from "@/lib/logger";

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

function buildHeaders(custom = {}) {
  const token = tokenManager.getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    ...defaultHeaders,
    ...authHeader,
    ...custom,
  };
}

function buildQuery(pagination, page, size, url) {
  if (!pagination) return "";

  const hasQuery = url.includes("?");
  const prefix = hasQuery ? "&" : "?";

  return `${prefix}page=${page ?? 0}&size=${size ?? 10}`;
}

/**
 * Safely parses response as JSON, falling back to structured error object on failure.
 */
async function parseResponse(res) {
  if (res.status === 401) {
    logger.warn("Received 401 Unauthorized from API. Invaliding session.");
    useAuthStore.getState().clearAuth();
  }

  try {
    const text = await res.text();
    if (!text || !text.trim()) {
      return { success: res.ok, status: res.status, messageStatus: res.ok ? "SUCCESS" : "ERROR" };
    }
    return JSON.parse(text);
  } catch (err) {
    logger.warn("Non-JSON API response received:", err);
    return {
      messageStatus: "ERROR",
      message: res.ok ? "استجابة غير متوقعة من الخادم" : `خطأ في الخادم (${res.status})`,
      status: res.status,
    };
  }
}

export async function getHelper({ url, headers = {}, pagination, page, size }) {
  const query = buildQuery(pagination, page, size, url);

  try {
    const res = await fetch(url + query, {
      method: "GET",
      headers: buildHeaders(headers),
      credentials: "include",
    });

    return await parseResponse(res);
  } catch (err) {
    logger.error("GET request failed:", err);
    throw err;
  }
}

export async function postHelper({ url, body, headers = {} }) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    return await parseResponse(res);
  } catch (err) {
    logger.error("POST request failed:", err);
    throw err;
  }
}

export async function putHelper({ url, body, headers = {} }) {
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    return await parseResponse(res);
  } catch (err) {
    logger.error("PUT request failed:", err);
    throw err;
  }
}

export async function deleteHelper({ url, headers = {} }) {
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: buildHeaders(headers),
      credentials: "include",
    });

    return await parseResponse(res);
  } catch (err) {
    logger.error("DELETE request failed:", err);
    throw err;
  }
}

export async function patchHelper({ url, body, headers = {} }) {
  const token = tokenManager.getToken();
  const finalHeaders = {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "ngrok-skip-browser-warning": "true",
  };

  const fetchOptions = {
    method: "PATCH",
    headers: finalHeaders,
    credentials: "include",
  };

  if (body instanceof FormData) {
    fetchOptions.body = body;
  } else {
    finalHeaders["Content-Type"] = "application/json";
    fetchOptions.body = body !== undefined ? JSON.stringify(body) : undefined;
  }

  try {
    const res = await fetch(url, fetchOptions);
    return await parseResponse(res);
  } catch (err) {
    logger.error("PATCH request failed:", err);
    throw new Error(
      err.message || "Error occurred while processing the PATCH request."
    );
  }
}

export async function postFormDataHelper({ url, formData }) {
  const token = tokenManager.getToken();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
      body: formData,
    });

    return await parseResponse(response);
  } catch (err) {
    logger.error("FormData request failed:", err);
    return {
      messageStatus: "ERROR",
      message: "فشل إرسال الملفات إلى الخادم",
    };
  }
}

