// use only for tokenized request . it could damage if used in not tokenized once 
import { apiFetch } from "./ApiFetchInterceptor";

const defaultHeaders = {
  "Content-Type": "application/json",
   "ngrok-skip-browser-warning": "true",
};

function buildHeaders(custom = {}) {
  return { ...defaultHeaders, ...custom };
}

function buildQuery(pagination, page, size) {
  if (!pagination) return "";
  return `?page=${page || 1}&size=${size || 10}`;
}

export async function getHelper({ url, headers = {}, pagination, page, size }) {
  const query = buildQuery(pagination, page, size);
  const res = await apiFetch(url + query, {
    method: "GET",
    headers: buildHeaders(headers),
  });
  return res.json();
}

export async function postHelper({ url, body, headers = {} }) {
  const res = await apiFetch(url, {
    method: "POST",
    headers: buildHeaders(headers),
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function putHelper({ url, body, headers = {} }) {
  const res = await apiFetch(url, {
    method: "PUT",
    headers: buildHeaders(headers),
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteHelper({ url, headers = {} }) {
  const res = await apiFetch(url, {
    method: "DELETE",
    headers: buildHeaders(headers),
  });
  return res.json();
}
export async function postFormDataHelper({ url, formData }) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "ngrok-skip-browser-warning": "true"
    },
    body: formData
  });

  try {
    return await response.json();
  } catch {
    return {};
  }
}

