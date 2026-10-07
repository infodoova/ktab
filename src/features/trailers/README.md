# Book trailers

Role pages are `/author/trailers`, `/library-admin/trailers`, `/librarian/trailers` and `/admin/trailers`, each protected for its matching role and linked in that role’s sidebar. Shared management is also available at `/trailers` (`/trailer` and `/trialer` redirect there), available to ADMIN, AUTHOR, LIBRARIAN and LIBRARY_ADMIN (backend alias ADMIN_LIBRARIAN).

The studio uses the same top app search and filter controls as other pages, with All/Ready/Queue section tabs. Approved videos appear in a newest-first gallery. Active books appear only in a dedicated queue list and are excluded from the creation grid. Create opens a confirmation dialog; cancelling sends no request. The dialog remains open while submitting and on errors. Book controllers stay mounted independently of visible cards, so moving between creation, queue and gallery does not restart polling or duplicate list requests.

Pagination belongs only to nonempty creation grids, never empty Ready/Queue views or empty search results. Search and the gallery are scoped to the current book page. No manual refresh controls are shown. Confirmation and filtering dialogs trap focus, support keyboard dismissal, and restore focus without scrolling the page. Layout and dialog flows were checked in Chrome with mocked API data from 320 to 1920px.

The studio uses the supplied trailer integration guide. Each book has its own request lock and job polling, allowing different books to generate concurrently. Polling runs every 12 seconds only for QUEUED/RUNNING/HARVESTING, pauses in a hidden tab and stops on unmount or terminal status. Playback/download URLs are fetched on demand and refreshed once on video failure. No signed URLs are persisted.

Quota is three non-failed/non-cancelled creations per book in a rolling 30 days; admins are exempt. The backend enforces the exact quota. An exact count and local quota blocking require `createdAt` on every counted trailer. Without it, `startedAt` provides an estimate only; the UI shows the quota policy and lets the backend decide on creation. This avoids blocking users incorrectly after delayed jobs or old admin retries. FAILED/CANCELLED entries are excluded. HTTP 400 and 409 messages remain visible after reloading authoritative state. Admin quota exemptions never bypass the one-active-trailer-per-book guard.

## System concurrency

The backend starts queued trailers up to `ktab.trailer.max-concurrent-runs` (default 4 across all books). Its worker checks every 15 seconds. Other jobs stay QUEUED; no queue position, start-time promise or ordering assumption is displayed. The separate `higgsfield-max-in-flight` limit (default 2) controls video generations inside one trailer. These are configurable backend limits, not frontend request limits. User copy explains queued work without hardcoding those defaults.

## Reader playback

Readers do not call the management-only trailer list or download endpoints.

Book details and manager drawers include BookTrailerSection below the description. Manager drawers show the newest READY trailer. Reader book details call `GET /books/{id}/trailer`; a 404 means no section is shown. Opening or downloading the video requests fresh short-lived links from this endpoint again.

## Verification

`node --test tests/trailers.test.mjs`

`npx eslint src/features/trailers src/core/routes/routes/trailerRoutes.js src/core/constants/roles.js`

`npm run build`
