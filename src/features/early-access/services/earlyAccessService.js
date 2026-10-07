const API_BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

export function parseRetryAfter(value) {
  if (!value) return 60;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? Math.max(0, Math.ceil((timestamp - Date.now()) / 1000)) : 60;
}

export async function submitEarlyAccess(payload, signal) {
  const response = await fetch(`${API_BASE}/public/early-access`, {
    method: "POST",
    credentials: "omit",
    signal,
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => null);
  return { status: response.status, body, retryAfter: parseRetryAfter(response.headers.get("Retry-After")) };
}
