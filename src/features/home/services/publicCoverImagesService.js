const API_BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");
const pendingRequests = new Map();

export function fetchPublicCoverImages(collection, count) {
  const path = `/public/books/cover-images?page=0&size=${count}`;

  // Share pending requests during Strict Mode's effect replay; signed URLs
  // are kept only by mounted consumers and refetched on the next visit.
  if (pendingRequests.has(path)) return pendingRequests.get(path);
  const request = (async () => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: "omit",
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    if (!response.ok) {
      const error = new Error(response.status === 429
        ? "طلبات كثيرة، حاول مرة أخرى بعد قليل."
        : "تعذر تحميل الأغلفة، حاول مرة أخرى لاحقًا.");
      error.status = response.status;
      throw error;
    }
    const envelope = await response.json();
    const urls = envelope.data?.content || envelope.data;
    if (envelope.success === false || !Array.isArray(urls)) {
      throw new Error("تعذر تحميل الأغلفة، حاول مرة أخرى لاحقًا.");
    }
    return [...new Set(urls.filter((url) => typeof url === "string" && url.trim()))];
  })().finally(() => pendingRequests.delete(path));
  pendingRequests.set(path, request);
  return request;
}
