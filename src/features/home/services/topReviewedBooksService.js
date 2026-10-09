const API_BASE = (import.meta?.env?.VITE_API_URL || "/api/v1").replace(/\/$/, "");

let pendingRequest = null;

/**
 * Normalizes and deduplicates books returned by GET /api/v1/public/books/top-reviewed.
 *
 * @param {Array} rawData
 * @returns {Array} Array of mapped card objects
 */
export function mapTopReviewedBooks(rawData) {
  if (!Array.isArray(rawData)) return [];

  const seenIds = new Set();
  return rawData
    .filter((b) => {
      if (!b || !b.coverImageUrl || typeof b.coverImageUrl !== "string" || !b.coverImageUrl.trim()) {
        return false;
      }
      if (b.id == null || seenIds.has(b.id)) {
        return false;
      }
      seenIds.add(b.id);
      return true;
    })
    .map((b) => ({
      id: b.id,
      bookId: b.id,
      title: b.title || "",
      cover: b.coverImageUrl,
      audioSrc: b.aboutAudio?.url ?? null,
      audioDescription: b.aboutAudio?.description ?? "",
      audioDuration: b.aboutAudio?.durationSeconds ?? null,
    }));
}

/**
 * Fetches featured top-reviewed books from GET /api/v1/public/books/top-reviewed.
 *
 * @param {number} [limit=10]
 * @returns {Promise<Array>} Array of mapped cards
 */
export function fetchTopReviewedBooks(limit = 10) {
  const path = `/public/books/top-reviewed?limit=${limit}`;
  const url = `${API_BASE}${path}`;

  // Deduplicate inflight requests during React Strict Mode mount replays.
  if (pendingRequest) return pendingRequest;

  pendingRequest = (async () => {
    const response = await fetch(url, {
      credentials: "omit",
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    if (!response.ok) {
      const error = new Error(response.status === 429 ? "rate-limit" : "load-failed");
      error.status = response.status;
      throw error;
    }

    const body = await response.json();
    if (!body || body.success === false || !Array.isArray(body.data)) {
      const error = new Error("load-failed");
      error.status = response.status;
      throw error;
    }

    return mapTopReviewedBooks(body.data);
  })().finally(() => {
    pendingRequest = null;
  });

  return pendingRequest;
}

export default fetchTopReviewedBooks;
