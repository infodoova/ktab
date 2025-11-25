const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// Build headers
function buildHeaders(customHeaders = {}) {
  return {
    ...defaultHeaders,
    ...customHeaders,
  };
}

// Build pagination
function buildQuery(pagination, page, size) {
  if (!pagination) return "";
  const p = page || 1;
  const s = size || 10;
  return `?page=${p}&size=${s}`;
}

// --------------- GET -----------------
export async function getHelper({
  url,
  headers = {},
  pagination = false,
  page = 1,
  size = 10,
}) {
  const finalHeaders = buildHeaders(headers);
  const query = buildQuery(pagination, page, size);

  const res = await fetch(url + query, {
    method: "GET",
    headers: finalHeaders,
  });

  return res.json();
}

// --------------- POST -----------------
export async function postHelper({
  url,
  body = {},
  headers = {},
}) {
  const finalHeaders = buildHeaders(headers);

  const res = await fetch(url, {
    method: "POST",
    headers: finalHeaders,
    body: JSON.stringify(body),
  });

  return res.json();
}

// --------------- PUT -----------------
export async function putHelper({
  url,
  body = {},
  headers = {},
}) {
  const finalHeaders = buildHeaders(headers);

  const res = await fetch(url, {
    method: "PUT",
    headers: finalHeaders,
    body: JSON.stringify(body),
  });

  return res.json();
}

// --------------- DELETE -----------------
export async function deleteHelper({
  url,
  headers = {},
}) {
  const finalHeaders = buildHeaders(headers);

  const res = await fetch(url, {
    method: "DELETE",
    headers: finalHeaders,
  });

  return res.json();
}
