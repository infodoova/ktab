import tokenManager from "../services/tokenManager";

const defaultHeaders = {
  "Content-Type": "application/json",
   "ngrok-skip-browser-warning": "true",
};

function buildHeaders(custom = {}) {
  const token = localStorage.getItem("token");
  const authHeader = token ? { "Authorization": `Bearer ${token}` } : {};

  return { 
    ...defaultHeaders, 
    ...authHeader, 
    ...custom 
  };
}

function buildQuery(pagination, page, size) {
  if (!pagination) return "";
  return `?page=${page || 0}&size=${size || 10}`;
}

export async function getHelper({ url, headers = {}, pagination, page, size }) {
    await tokenManager.refreshIfNeeded(); 

  const query = buildQuery(pagination, page, size);
  const res = await fetch(url + query, {
    method: "GET",
    headers: buildHeaders(headers),
  });


  return res.json();
}

export async function postHelper({ url, body, headers = {} }) {
    await tokenManager.refreshIfNeeded(); 

  const res = await fetch(url, { 
    method: "POST",
    headers: buildHeaders(headers),
    body: JSON.stringify(body),
  });


  return res.json();
}

export async function putHelper({ url, body, headers = {} }) {
      await tokenManager.refreshIfNeeded(); 

  const res = await fetch(url, { 
    method: "PUT",
    headers: buildHeaders(headers),
    body: JSON.stringify(body),
  });


  return res.json();
}

export async function deleteHelper({ url, headers = {} }) {
      await tokenManager.refreshIfNeeded(); 

  const res = await fetch(url, { 
    method: "DELETE",
    headers: buildHeaders(headers),
  });

  
  return res.json();
}

export async function patchHelper({ url, body, headers = {} }) {
  await tokenManager.refreshIfNeeded();  

  const res = await fetch(url, {
    method: "PATCH",
    headers: buildHeaders(headers),
    body: JSON.stringify(body),
  });

  return res.json();
}

export async function postFormDataHelper({ url, formData }) {
      await tokenManager.refreshIfNeeded(); 

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