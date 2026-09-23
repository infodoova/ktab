import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchAuthorBooks, deleteAuthorBook, submitBookForReview } from "../services/myBooksService";
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

    const statusStr = String(bookToDelete.status || "").toUpperCase();
    if (
      statusStr === "UNDER_REVIEW" ||
      statusStr === "PENDING" ||
      statusStr === "PENDING_APPROVAL" ||
      statusStr === "SUBMITTED" ||
      statusStr === "IN_REVIEW"
    ) {
      AlertToast("لا يمكن حذف كتاب قيد المراجعة لدى دار النشر", "WARNING");
      setBookToDelete(null);
      return;
    }

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

  const handleSubmitDraft = useCallback(async (book) => {
    if (!book?.id) return;
    try {
      const res = await submitBookForReview({ id: book.id });
      if (
        res?.messageStatus === "SUCCESS" ||
        res?.status === 200 ||
        res?.statusCode === 200 ||
        res?.success
      ) {
        AlertToast("تم إرسال الكتاب بنجاح وهو الآن قيد المراجعة", "SUCCESS");
        setBooks((prev) => prev.filter((b) => b.id !== book.id));
        setTotalElements((prev) => Math.max(0, prev - 1));
        setSelectedBookForDetails(null);
      } else {
        AlertToast(res?.message || "فشل إرسال المسودة للمراجعة", "ERROR");
      }
    } catch {
      AlertToast("حدث خطأ أثناء إرسال المسودة للمراجعة", "ERROR");
    }
  }, []);

  const displayedBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;

    const q = searchQuery.trim().toLowerCase();
    return books.filter((book) => {
      const title = (book?.title || "").toLowerCase();
      const genre = (book?.genreName || book?.mainGenre?.name || "").toLowerCase();
      const author = (book?.authorName || "").toLowerCase();
      return title.includes(q) || genre.includes(q) || author.includes(q);
    });
  }, [books, searchQuery]);

  const resetFilters = useCallback(() => {
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
    handleSubmitDraft,
  };
}

export default useAuthorBooks;
