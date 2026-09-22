import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchAuthorBooks, deleteAuthorBook } from "../services/myBooksService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook for managing Author's published books, drafts, and pending review books with race condition protection,
 * client-side search, genre filtering, sorting, and mobile sheet state.
 */
export function useAuthorBooks() {
  const location = useLocation();
  const [status, setStatus] = useState(
    () => location.state?.initialStatus || "PUBLISHED"
  );

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  const reqIdRef = useRef(0);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".book-menu-area")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const loadBooks = useCallback(
    async (targetPage = 0, targetStatus, isInitial = false) => {
      const currentReqId = ++reqIdRef.current;

      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        // authorId omitted: service uses /authors/me/ (session-based auth).
        const res = await fetchAuthorBooks({
          status: targetStatus,
          page: targetPage,
          size: 8,
        });

        // Discard response if a newer request has already been dispatched (race-condition guard).
        if (currentReqId !== reqIdRef.current) return;

        if (res?.messageStatus === "ERROR") {
          AlertToast(res.message, "ERROR");
        }

        const incoming = Array.isArray(res?.content)
          ? res.content
          : Array.isArray(res?.data?.content)
          ? res.data.content
          : [];

        const total = typeof res?.totalPages === "number" ? res.totalPages : 1;
        const incomingTotalElements =
          typeof res?.totalElements === "number"
            ? res.totalElements
            : typeof res?.data?.totalElements === "number"
            ? res.data.totalElements
            : incoming.length;

        // Page 0 always replaces; higher pages append (infinite scroll).
        setBooks(targetPage === 0 ? incoming : (prev) => [...prev, ...incoming]);
        setTotalPages(total);
        setTotalElements(incomingTotalElements);
        setPage(targetPage);
      } catch (err) {
        if (currentReqId === reqIdRef.current) {
          console.error("Failed to load author books:", err);
        }
      } finally {
        if (currentReqId === reqIdRef.current) {
          if (isInitial) setLoading(false);
          else setLoadingMore(false);
        }
      }
    },
    // Empty deps: service is session-based, no external values needed. Stable function identity
    // prevents the useEffect below from re-firing when the auth store hydrates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  // Single effect drives all loads: fires on mount (initial) and whenever the active tab changes.
  // The cleanup invalidates any in-flight request via reqIdRef so StrictMode's unmount/remount
  // cycle doesn't allow the first mount's response to write to the second mount's state.
  useEffect(() => {
    setBooks([]);
    setPage(0);
    loadBooks(0, status, true);

    return () => {
      // Incrementing here makes any pending response from this render cycle stale.
      reqIdRef.current += 1;
    };
  }, [status, loadBooks]);


  // Tab change handler — just updates status; the effect above handles the reload.
  const handleStatusChange = useCallback((newStatus) => {
    setStatus((prev) => {
      if (newStatus === prev) return prev;
      setTotalElements(0);
      return newStatus;
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && page + 1 < totalPages) {
      loadBooks(page + 1, status, false);
    }
  }, [loading, loadingMore, page, totalPages, status, loadBooks]);

  const handleConfirmDelete = useCallback(async () => {
    if (!bookToDelete) return;

    try {
      const res = await deleteAuthorBook(bookToDelete.id);
      if (res?.messageStatus === "SUCCESS" || res?.status === 200) {
        AlertToast("تم حذف الكتاب بنجاح", "SUCCESS");
        setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
        setTotalElements((prev) => Math.max(0, prev - 1));
      } else {
        AlertToast(res?.message || "فشل حذف الكتاب", "ERROR");
      }
    } catch (err) {
      console.error("Failed to delete book:", err);
      AlertToast("حدث خطأ أثناء حذف الكتاب", "ERROR");
    } finally {
      setBookToDelete(null);
    }
  }, [bookToDelete]);

  const displayedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((book) => {
        const title = (book?.title || "").toLowerCase();
        const genre = (book?.genreName || book?.mainGenre?.name || "").toLowerCase();
        const author = (book?.authorName || "").toLowerCase();
        return title.includes(q) || genre.includes(q) || author.includes(q);
      });
    }

    if (selectedGenre && selectedGenre !== "ALL") {
      result = result.filter((book) => {
        const genre = book?.genreName || book?.mainGenre?.name || "";
        return genre === selectedGenre;
      });
    }

    if (sortBy === "rating") {
      result.sort((a, b) => (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0));
    } else if (sortBy === "reads") {
      result.sort((a, b) => (Number(b.readCount || b.totalReads) || 0) - (Number(a.readCount || a.totalReads) || 0));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || "", "ar"));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [books, searchQuery, selectedGenre, sortBy]);

  const availableGenres = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      const g = b?.genreName || b?.mainGenre?.name;
      if (g) set.add(g);
    });
    return Array.from(set);
  }, [books]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGenre && selectedGenre !== "ALL") count += 1;
    if (sortBy && sortBy !== "newest") count += 1;
    return count;
  }, [selectedGenre, sortBy]);

  const resetFilters = useCallback(() => {
    setSelectedGenre("ALL");
    setSortBy("newest");
    setSearchQuery("");
  }, []);

  return {
    books,
    displayedBooks,
    loading,
    loadingMore,
    page,
    totalPages,
    totalElements,
    status,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    availableGenres,
    sortBy,
    setSortBy,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    activeFiltersCount,
    resetFilters,
    openMenuId,
    setOpenMenuId,
    selectedBookForDetails,
    setSelectedBookForDetails,
    bookToDelete,
    setBookToDelete,
    handleStatusChange,
    loadMore,
    handleConfirmDelete,
  };
}

export default useAuthorBooks;
