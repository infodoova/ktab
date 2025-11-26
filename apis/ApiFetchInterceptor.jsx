/* -------------------------------------------------------
   Decode JWT payload
--------------------------------------------------------- */
export function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

/* -------------------------------------------------------
   Refresh token function
--------------------------------------------------------- */
export async function refreshAccessToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    localStorage.removeItem("token");
    window.location.href = "/Screens/auth/login";
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/Screens/auth/login";
      return;
    }

    const data = await res.json();
    const newToken = data.data.token;
    localStorage.setItem("token", newToken);
    return newToken;
  } catch  {
    // If network fails or other error, logout
    localStorage.removeItem("token");
    window.location.href = "/Screens/auth/login";
    return;
  }
}

/* -------------------------------------------------------
   API FETCH WITH SAFE GAP (10 MIN) + AUTO REDIRECT
--------------------------------------------------------- */
export async function apiFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  const SAFE_GAP = 20 * 60 * 1000; 

  // No token → logout
  if (!token) {
    localStorage.removeItem("token");
    window.location.href = "/Screens/auth/login";
    return;
  }

  const payload = decodeJwt(token);


  const now = Date.now();
  const expiresAt = payload.exp * 1000;

  // Token already expired → redirect
  if (now >= expiresAt) {
    localStorage.removeItem("token");
    window.location.href = "/Screens/auth/login";
    return;
  }

  const remaining = expiresAt - now;

  // Near expiry (less than 10 mins remaining) → refresh before call
  if (remaining < SAFE_GAP) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      localStorage.removeItem("token");
      window.location.href = "/Screens/auth/login";
      return;
    }

    token = newToken;
  }

  // Make request with (possibly refreshed) token
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
}