export const TRAILER_MANAGER_ROLES = ["ADMIN", "AUTHOR", "LIBRARIAN", "LIBRARY_ADMIN"];
export const TRAILER_STUDIO_ROLES = ["AUTHOR", "LIBRARY_ADMIN"];
export const ACTIVE_TRAILER_STATUSES = ["QUEUED", "RUNNING", "HARVESTING"];
export const TRAILER_LABELS = {
  QUEUED: "في قائمة الانتظار",
  RUNNING: "جاري إنتاج الإعلان",
  HARVESTING: "جاري تجهيز الفيديو",
  READY: "جاهز للمشاهدة",
  NEEDS_REVIEW: "بانتظار المراجعة",
  FAILED: "تعذر إنتاج الإعلان",
  CANCELLED: "تم الإلغاء",
};
export const isTrailerActive = (status) => ACTIVE_TRAILER_STATUSES.includes(typeof status === "string" ? status.trim().toUpperCase() : status);
export const isTrailerQueued = (status) => (typeof status === "string" ? status.trim().toUpperCase() : status) === "QUEUED";

export function getTrailerQuota(trailers, now = Date.now()) {
  const cutoff = now - 30 * 24 * 60 * 60 * 1000;
  const counted = trailers.filter((trailer) => !["FAILED", "CANCELLED"].includes(trailer.status));
  const isExact = counted.every((trailer) => Number.isFinite(Date.parse(trailer.createdAt)));
  const used = counted.filter((trailer) => {
    const started = Date.parse(trailer.createdAt || trailer.startedAt);
    return started > cutoff && started <= now;
  }).length;
  // startedAt can differ from creation time after queuing or retrying.
  // Only creation timestamps can justify blocking before the API checks its quota.
  return { used, remaining: Math.max(0, 3 - used), isExact };
}

export function presentTrailer(trailer, options = false) {
  const isAdmin = typeof options === "boolean" ? options : Boolean(options?.isAdmin);
  const role = typeof options === "object" ? options?.role : null;
  const isReviewer = isAdmin || ["AUTHOR", "LIBRARY_ADMIN", "ADMIN_LIBRARIAN"].includes(role);

  return {
    ...trailer,
    label: TRAILER_LABELS[trailer.status] || "حالة غير معروفة",
    active: isTrailerActive(trailer.status),
    canCancel: isTrailerQueued(trailer.status) || (isAdmin && isTrailerActive(trailer.status)),
    canPlay: trailer.status === "READY" || (isReviewer && trailer.status === "NEEDS_REVIEW"),
    canReview: isReviewer && trailer.status === "NEEDS_REVIEW",
    canRetry: ["FAILED", "NEEDS_REVIEW"].includes(trailer.status),
    failureMessage: trailer.status === "FAILED"
      ? (isAdmin && trailer.error ? trailer.error : "تعذر إنتاج الإعلان. يمكنك إنشاء إعلان جديد عند توفر الحصة.")
      : null,
    dateLabel: trailer.startedAt
      ? new Date(trailer.startedAt).toLocaleDateString("ar", { day: "numeric", month: "long", year: "numeric" })
      : "",
  };
}

export function safeMediaUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, window.location.origin);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

// Reader integration contract: book details must expose only an approved video.
export function getEmbeddedTrailerVideo(book) {
  if (book?.trailer?.status && book.trailer.status !== "READY") return null;
  return safeMediaUrl(book?.trailer?.video || book?.trailerVideoUrl);
}

export function getTrailerStudioSummary(books, snapshots, isAdmin = false) {
  const finished = books.flatMap((book) => (snapshots[book.id]?.items || [])
    .filter((trailer) => trailer.status === "READY")
    .map((trailer) => ({ book, trailer })));
  finished.sort((a, b) => (Date.parse(b.trailer.finishedAt || b.trailer.startedAt) || 0)
    - (Date.parse(a.trailer.finishedAt || a.trailer.startedAt) || 0) || Number(b.trailer.id) - Number(a.trailer.id));

  const isAttentionStatus = (status) => isTrailerActive(status) || status === "FAILED" || status === "NEEDS_REVIEW";

  const activeBooks = books.filter((book) =>
    snapshots[book.id]?.items.some((trailer) => isAttentionStatus(trailer.status))
  );

  const activeBookIds = new Set(activeBooks.map((b) => b.id));

  const availableBooks = books.filter((book) => {
    // 1. If it's already in the queue / attention section, do not show it in "إنشاء إعلان جديد"
    if (activeBookIds.has(book.id)) return false;

    const snap = snapshots[book.id];
    if (!snap) return true;

    // 2. If the user cannot create an ad for it (e.g. quota exhausted or currently active), don't show it
    if (!isAdmin && snap.quota?.isExact && snap.quota?.remaining === 0) return false;
    if (snap.items?.some((t) => isTrailerActive(t.status))) return false;

    return true;
  });

  return {
    finished,
    activeBooks,
    availableBooks,
    activeBookCount: activeBooks.length,
    galleryLoading: books.some((book) => !snapshots[book.id] || snapshots[book.id].loading),
    galleryHasErrors: books.some((book) => snapshots[book.id]?.error),
  };
}
