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

async function fetchWithAuthRetry(url, options) {
  const hadSession = useAuthStore.getState().isAuthenticated;
  const sentAuthorization = new Headers(options.headers).get("Authorization");
  const sentToken = sentAuthorization?.startsWith("Bearer ")
    ? sentAuthorization.slice(7)
    : null;
  let response = await fetch(url, options);
  if (response.status !== 401 || (!sentToken && !hadSession)) return response;

  // A request can leave the phone while its JWT is expiring. Retry once with
  // the rotated token; the refresh endpoint alone decides if the cookie died.
  const currentToken = tokenManager.getToken();
  const freshToken = sentToken && currentToken !== sentToken
    ? currentToken
    : await tokenManager.safeRefresh();
  if (!freshToken && !useAuthStore.getState().isAuthenticated) return response;
  if (sentToken && freshToken === sentToken) return response;

  const headers = new Headers(options.headers);
  if (freshToken) headers.set("Authorization", `Bearer ${freshToken}`);
  response = await fetch(url, { ...options, headers });
  return response;
}

export async function getHelper({ url, headers = {}, pagination, page, size }) {
  const query = buildQuery(pagination, page, size, url);

  try {
    const res = await fetchWithAuthRetry(url + query, {
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
    const res = await fetchWithAuthRetry(url, {
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
    const res = await fetchWithAuthRetry(url, {
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
    const res = await fetchWithAuthRetry(url, {
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
    const res = await fetchWithAuthRetry(url, fetchOptions);
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
    const response = await fetchWithAuthRetry(url, {
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
