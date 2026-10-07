import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/core/store/authStore";
import { normalizeRole } from "@/core/constants/roles";
import { fetchTrailerBooks, trailerService } from "../services/trailerService";
import { getTrailerStudioSummary, safeMediaUrl } from "../utils/trailerUtils";

export function useTrailerStudio() {
  const rawRole = useAuthStore((state) => state.user?.role);
  const role = normalizeRole(rawRole);
  const isAdmin = role === "ADMIN";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bookToCreate, setBookToCreate] = useState(null);
  const [creationBusy, setCreationBusy] = useState(false);
  const createLock = useRef(false);
  const createTrigger = useRef(null);
  const filterTrigger = useRef(null);
  const [trailersByBook, setTrailersByBook] = useState({});
  const [viewFilter, setViewFilter] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectUrl, setConnectUrl] = useState(null);
  const requestId = useRef(0);

  const loadBooks = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    setTrailersByBook({});
    setError("");
    try {
      const data = await fetchTrailerBooks({ role, page, status: "PUBLISHED" });
      if (request !== requestId.current) return;
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (request === requestId.current) { setBooks([]); setError(err.message); }
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [role, page]);

  useEffect(() => {
    loadBooks();
    const requestCounter = requestId;
    return () => { requestCounter.current++; };
  }, [loadBooks]);

  const handleTrailersChange = useCallback((bookId, snapshot) => {
    setTrailersByBook((current) => ({ ...current, [bookId]: snapshot }));
  }, []);
  const handleOpenFilters = useCallback((event) => { filterTrigger.current = event?.currentTarget; setFiltersOpen(true); }, []);
  const handleCloseFilters = useCallback(() => setFiltersOpen(false), []);
  const handleRequestCreate = useCallback((book, trigger) => { createTrigger.current = trigger; setBookToCreate(book); }, []);
  const handleCloseCreate = useCallback(() => { if (!createLock.current) setBookToCreate(null); }, []);
  const handleCreateCloseAutoFocus = useCallback((event) => {
    event.preventDefault();
    if (createTrigger.current?.isConnected) createTrigger.current.focus({ preventScroll: true });
    else document.getElementById("trailer-queue-heading")?.focus({ preventScroll: true });
  }, []);
  const handleFiltersCloseAutoFocus = useCallback((event) => { event.preventDefault(); filterTrigger.current?.focus({ preventScroll: true }); }, []);
  const handleConfirmCreate = useCallback(async () => {
    const collection = trailersByBook[bookToCreate?.id];
    if (createLock.current || !collection?.canCreate) return;
    createLock.current = true;
    setCreationBusy(true);
    try {
      const result = await collection.runAction("create");
      if (result?.id != null) setBookToCreate(null);
    } finally { createLock.current = false; setCreationBusy(false); }
  }, [bookToCreate, trailersByBook]);
  const handleViewFilter = useCallback((event) => setViewFilter(event.currentTarget.dataset.filter), []);
  const handlePreviousPage = useCallback(() => setPage((current) => Math.max(0, current - 1)), []);
  const handleNextPage = useCallback(() => setPage((current) => current + 1), []);
  const handleConnect = useCallback(async () => {
    if (connecting) return;
    setConnecting(true);
    setError("");
    try {
      const data = await trailerService.connect();
      const url = Object.values(data || {}).map(safeMediaUrl).find(Boolean);
      if (!url) throw new Error("تعذر تحميل رابط ربط خدمة الإنتاج.");
      setConnectUrl(url);
    } catch (err) { setError(err.message); }
    finally { setConnecting(false); }
  }, [connecting]);

  const displayedBooks = useMemo(() => books.filter((book) =>
    `${book.title} ${book.authorName || ""}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ), [books, searchQuery]);

  const summary = useMemo(() => getTrailerStudioSummary(displayedBooks, trailersByBook, isAdmin), [displayedBooks, trailersByBook, isAdmin]);
  return {
    ...summary, viewFilter, handleViewFilter, handleTrailersChange, trailersByBook,
    filtersOpen, handleOpenFilters, handleCloseFilters, bookToCreate, creationBusy,
    handleRequestCreate, handleCloseCreate, handleConfirmCreate, handleCreateCloseAutoFocus, handleFiltersCloseAutoFocus,
    createCollection: trailersByBook[bookToCreate?.id],
    activeFiltersCount: viewFilter !== "all" ? 1 : 0,
    showPagination: !loading && viewFilter === "all" && !searchQuery.trim() && totalPages > 1 && summary.availableBooks.length > 0,
    books, displayedBooks, loading, error, page, totalPages, searchQuery,
    setSearchQuery, isAdmin, role, connecting, connectUrl, handleConnect, loadBooks,
    handlePreviousPage, handleNextPage,
  };
}
