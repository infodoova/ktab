/* -------------------------------------------------------
   Decode JWT payload
--------------------------------------------------------- */
export function decodeJwt(token) {
  try {
    // Decode base64 URL-safe string
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Failed to decode JWT:", e);
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
    return null;
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 
        },
      }
    );

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/Screens/auth/login";
      return null;
    }

    const data = await res.json();

    // backend returns a new token inside data.data.token
    const newToken = data.data.token;

    localStorage.setItem("token", newToken);
    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("token");
    window.location.href = "/Screens/auth/login";
    return null;
  }
}
