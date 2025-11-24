const TOKEN_KEY = "token";

export function saveToken(value: string) {
  localStorage.setItem(TOKEN_KEY, value);
}

export function token(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

function parseJwt(rawToken: string): JwtPayload | null {
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

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(): boolean {
  const t = token();
  if (!t) return true;

  const payload = parseJwt(t);
  if (!payload || typeof payload.exp !== "number") {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds;
}

export function getDecodedToken(): JwtPayload | null {
  const t = token();
  if (!t) return null;
  return parseJwt(t);
}

export function getUserFullName(): string | null {
  const payload = getDecodedToken();
  if (!payload) return null;

  const first =
    (payload.firstName ||
      payload.firstname ||
      payload.given_name) as string | undefined;
  const last =
    (payload.lastName ||
      payload.lastname ||
      payload.family_name) as string | undefined;

  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  return null;
}
