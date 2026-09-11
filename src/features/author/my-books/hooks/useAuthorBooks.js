import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/core/store/authStore";
import { fetchAuthorBooks, deleteAuthorBook } from "../services/myBooksService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook for managing Author's published books and drafts with race condition protection.
 */
export function useAuthorBooks() {
  const user = useAuthStore((state) => state.user) || {};
  const [status, setStatus] = useState("PUBLISHED");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      if (!user?.userId) return;

      const currentReqId = ++reqIdRef.current;

      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetchAuthorBooks({
          authorId: user.userId,
          status: targetStatus,
          page: targetPage,
          size: 8,
        });

        // Drop response if newer request has already been initiated (e.g. fast tab change)
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

        setBooks((prev) => (targetPage === 0 ? incoming : [...prev, ...incoming]));
        setTotalPages(total);
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
    [user?.userId, status]
  );

  useEffect(() => {
    loadBooks(0, status, true);
  }, [loadBooks, status]);

  const handleStatusChange = useCallback((newStatus) => {
    setStatus((prevStatus) => {
      if (newStatus === prevStatus) return prevStatus;
      setBooks([]);
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

  return {
    books,
    loading,
    loadingMore,
    page,
    totalPages,
    status,
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

