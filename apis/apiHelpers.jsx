const defaultHeaders = {
  "Content-Type": "application/json",
 // "ngrok-skip-browser-warning": "true",
};

// Build headers
function buildHeaders(customHeaders = {}, role) {
  return {
    ...defaultHeaders,
  //  "x-ktab-role": role,
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
  role = "all",
  pagination = false,
  page = 1,
  size = 10,
}) {
  const finalHeaders = buildHeaders(headers, role);
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
  role = "all",
}) {
  const finalHeaders = buildHeaders(headers, role);

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
  role = "all",
}) {
  const finalHeaders = buildHeaders(headers, role);

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
  role = "all",
}) {
  const finalHeaders = buildHeaders(headers, role);

  const res = await fetch(url, {
    method: "DELETE",
    headers: finalHeaders,
  });

  return res.json();
}
