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

