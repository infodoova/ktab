import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuthStore } from "@/core/store/authStore";
import { fetchAuthorBooks, deleteAuthorBook } from "../services/myBooksService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook for managing Author's published books and drafts with race condition protection,
 * client-side search, genre filtering, sorting, and mobile sheet state.
 */
export function useAuthorBooks() {
  const user = useAuthStore((state) => state.user) || {};
  const [status, setStatus] = useState("PUBLISHED");

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
    async (targetPage = 0, targetStatus = status, isInitial = false) => {
      const currentReqId = ++reqIdRef.current;

      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetchAuthorBooks({
          authorId: user?.userId || user?.id,
          status: targetStatus,
          page: targetPage,
          size: 8,
        });

        // Drop response if newer request has already been initiated
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
        const incomingTotalElements = typeof res?.totalElements === "number"
          ? res.totalElements
          : typeof res?.data?.totalElements === "number"
          ? res.data.totalElements
          : incoming.length;

        setBooks((prev) => (targetPage === 0 ? incoming : [...prev, ...incoming]));
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
    [status, user?.userId, user?.id]
  );

  useEffect(() => {
    loadBooks(0, status, true);
  }, [loadBooks, status]);

  const handleStatusChange = useCallback((newStatus) => {
    setStatus((prevStatus) => {
      if (newStatus === prevStatus) return prevStatus;
      setBooks([]);
      setTotalElements(0);
      setPage(0);
      return newStatus;
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && page + 1 < totalPages) {
      loadBooks(page + 1, status, false);
    }
  }, [loading, loadingMore, page, totalPages, loadBooks, status]);

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
