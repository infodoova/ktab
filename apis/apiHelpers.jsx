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
  const finalHeaders = {
    ...headers,
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOptions = {
    method: "PATCH",
    headers: finalHeaders,
  };

  if (body instanceof FormData) {
    fetchOptions.body = body;
  } else {
    finalHeaders['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return res.json(); 
  } catch (err) {
    console.error("Request failed", err);
    throw new Error(err.message || "Error occurred while processing the PATCH request.");
  }
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