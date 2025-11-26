const TOKEN_KEY = "token";

export function saveToken(value) {
  localStorage.setItem(TOKEN_KEY, value);
}

export function token() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function parseJwt(rawToken) {
  try {
    const base64Url = rawToken.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired() {
  const t = token();
  if (!t) return true;

  const payload = parseJwt(t);
  if (!payload || typeof payload.exp !== "number") return true;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds;
}

export function getDecodedToken() {
  const t = token();
  if (!t) return null;
  return parseJwt(t);
}

export function getUserData() {
  const payload = getDecodedToken();
  if (!payload) return null;

  return {
    firstName: payload.firstName ,
    lastName: payload.lastName ,
    role: payload.role,
    userId: payload.userId
  };
}
