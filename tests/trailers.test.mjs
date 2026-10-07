import test from "node:test";
import assert from "node:assert/strict";
import { getTrailerStudioSummary, getTrailerQuota, isTrailerActive, presentTrailer, getEmbeddedTrailerVideo, safeMediaUrl } from "../src/features/trailers/utils/trailerUtils.js";
import { isRoleAuthorized, normalizeRole } from "../src/core/constants/roles.js";

globalThis.window = { location: { origin: "https://ktab.example" } };
const now = Date.parse("2026-10-07T12:00:00Z");
const daysAgo = (days) => new Date(now - days * 86400000).toISOString();

test("quota is a rolling 30 days, not a calendar month", () => {
  const items = [
    { status: "READY", startedAt: daysAgo(29) },
    { status: "NEEDS_REVIEW", startedAt: daysAgo(8) },
    { status: "RUNNING", startedAt: daysAgo(0) },
    { status: "READY", startedAt: daysAgo(30) },
    { status: "READY", startedAt: daysAgo(31) },
    { status: "FAILED", startedAt: daysAgo(1) },
    { status: "CANCELLED", startedAt: daysAgo(2) },
  ];
  assert.deepEqual(getTrailerQuota(items, now), { used: 3, remaining: 0, isExact: false });
});

test("creation timestamp takes precedence over a later retry's start", () => {
  assert.deepEqual(getTrailerQuota([{ status: "READY", createdAt: daysAgo(40), startedAt: daysAgo(1) }], now), { used: 0, remaining: 3, isExact: true });
});

test("invalid and future timestamps do not consume quota; remaining never negative", () => {
  assert.deepEqual(getTrailerQuota([{ status: "QUEUED", startedAt: null }, { status: "READY", startedAt: daysAgo(-1) }], now), { used: 0, remaining: 3, isExact: false });
  assert.equal(getTrailerQuota(Array.from({ length: 5 }, () => ({ status: "READY", startedAt: daysAgo(1) })), now).remaining, 0);
});

test("only active job stages poll", () => {
  for (const status of ["QUEUED", "RUNNING", "HARVESTING"]) assert.equal(isTrailerActive(status), true);
  for (const status of ["READY", "NEEDS_REVIEW", "FAILED", "CANCELLED"]) assert.equal(isTrailerActive(status), false);
});

test("review videos and technical failures are admin only", () => {
  assert.equal(presentTrailer({ status: "READY" }, false).canPlay, true);
  const review = { status: "NEEDS_REVIEW" };
  assert.equal(presentTrailer(review, false).canPlay, false);
  assert.equal(presentTrailer(review, false).canReview, false);
  assert.equal(presentTrailer(review, true).canPlay, true);
  assert.equal(presentTrailer(review, true).canReview, true);
  const failure = { status: "FAILED", error: "internal-production-detail" };
  assert.equal(presentTrailer(failure, true).failureMessage, failure.error);
  assert.doesNotMatch(presentTrailer(failure, false).failureMessage, /internal-production-detail/);
});

test("reader playback never exposes an unapproved or unsafe embedded video", () => {
  assert.equal(getEmbeddedTrailerVideo({ trailer: { status: "NEEDS_REVIEW", video: "https://cdn.example/video.mp4" } }), null);
  assert.equal(getEmbeddedTrailerVideo({ trailer: { status: "READY", video: "javascript:alert(1)" } }), null);
  assert.equal(getEmbeddedTrailerVideo({ trailer: { status: "READY", video: "https://cdn.example/video.mp4" } }), "https://cdn.example/video.mp4");
  assert.equal(getEmbeddedTrailerVideo({}), null);
  assert.equal(safeMediaUrl("data:text/html,example"), null);
});

test("backend admin librarian alias receives manager permissions, readers do not", () => {
  assert.equal(normalizeRole("ADMIN_LIBRARIAN"), "LIBRARY_ADMIN");
  assert.equal(isRoleAuthorized("ADMIN_LIBRARIAN", ["LIBRARY_ADMIN"]), true);
  assert.equal(isRoleAuthorized("READER", ["ADMIN", "AUTHOR", "LIBRARIAN", "LIBRARY_ADMIN"]), false);
});


test("creation timestamps permit an exact count including queued jobs with no start time", () => {
  const items = [
    { status: "QUEUED", createdAt: daysAgo(0), startedAt: null },
    { status: "READY", createdAt: daysAgo(1) },
    { status: "NEEDS_REVIEW", createdAt: daysAgo(2) },
    { status: "FAILED", startedAt: null },
    { status: "CANCELLED", startedAt: null },
  ];
  assert.deepEqual(getTrailerQuota(items, now), { used: 3, remaining: 0, isExact: true });
});

test("three start times alone cannot justify local quota blocking", () => {
  const items = Array.from({ length: 3 }, () => ({ status: "READY", startedAt: daysAgo(1) }));
  const quota = getTrailerQuota(items, now);
  assert.equal(quota.remaining, 0);
  assert.equal(quota.isExact, false);
});


test("queued books are excluded from creation even if they have an older ready trailer", () => {
  const books = [{ id: 1, title: "Queued book" }, { id: 2, title: "Available book" }];
  const summary = getTrailerStudioSummary(books, {
    1: { items: [{ id: 10, status: "QUEUED" }, { id: 9, status: "READY" }], loading: false },
    2: { items: [], loading: false },
  });
  assert.deepEqual(summary.activeBooks.map((book) => book.id), [1]);
  assert.deepEqual(summary.availableBooks.map((book) => book.id), [2]);
  assert.equal(summary.finished[0].book.title, "Queued book");
});

test("completed and cancelled jobs release the book from the queue", () => {
  const books = [{ id: 1 }, { id: 2 }];
  const summary = getTrailerStudioSummary(books, {
    1: { items: [{ id: 10, status: "READY", finishedAt: daysAgo(1) }], loading: false },
    2: { items: [{ id: 11, status: "CANCELLED" }], loading: false },
  });
  assert.equal(summary.activeBooks.length, 0);
  assert.deepEqual(summary.availableBooks.map((book) => book.id), [1, 2]);
  assert.equal(summary.finished.length, 1);
  assert.equal(summary.galleryLoading, false);
});
