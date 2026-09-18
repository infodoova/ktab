import { useState, useEffect, useCallback } from "react";
import {
  fetchMyLibraryBooks,
  fetchRecommendedBooks,
  removeBookFromLibrary,
} from "../services/dashboardService";
import { AlertToast } from "@/components/myui/AlertToast";
import { useLibraryStore } from "@/core/store";
import logger from "@/lib/logger";

/**
 * Hook managing Reader Dashboard data fetching, state, and book removal.
 * Pure real-data implementation with zero mock fallbacks.
 */
export function useReaderDashboard() {
  const [assignedBooks, setAssignedBooks] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(true);

  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  const [continueReadingBooks, setContinueReadingBooks] = useState([]);

  const loadAssignedBooks = useCallback(async () => {
    setLoadingAssigned(true);
    try {
      const res = await fetchMyLibraryBooks({ page: 0, size: 12 });

      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        setAssignedBooks([]);
        setContinueReadingBooks([]);
      } else {
        const books = res?.data?.content ?? [];
        setAssignedBooks(books);
        useLibraryStore.getState().setAssignedBookIds(books.map((b) => b.id));

        // Filter books that have active reading progress; if none, show top recent books
        const inProgress = books.filter(
          (b) =>
            (typeof b.progress === "number" && b.progress > 0) ||
            (typeof b.lastReadPage === "number" && b.lastReadPage > 0)
        );
        setContinueReadingBooks(inProgress.length > 0 ? inProgress : books.slice(0, 3));
      }
    } catch (error) {
      logger.error("Failed to load library books:", error);
      setAssignedBooks([]);
      setContinueReadingBooks([]);
    } finally {
      setLoadingAssigned(false);
    }
  }, []);

  const loadRecommendedBooks = useCallback(async () => {
    setLoadingRecommended(true);
    try {
      const res = await fetchRecommendedBooks({ page: 0, size: 12 });
      if (res?.messageStatus === "SUCCESS" && Array.isArray(res.data?.content)) {
        setRecommendedBooks(res.data.content);
      } else {
        setRecommendedBooks([]);
      }
    } catch (error) {
      logger.error("Failed to load recommended books:", error);
      setRecommendedBooks([]);
    } finally {
      setLoadingRecommended(false);
    }
  }, []);

  useEffect(() => {
    loadAssignedBooks();
    loadRecommendedBooks();
  }, [loadAssignedBooks, loadRecommendedBooks]);

  const handleRemoveAssignedBook = useCallback(async (bookId) => {
    try {
      const res = await removeBookFromLibrary(bookId);

      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message || "تعذر حذف الكتاب من المفضلة.", "ERROR");
        return;
      }

      AlertToast("تمت إزالة الكتاب من المفضلة بنجاح.", "SUCCESS");
      setAssignedBooks((prev) => prev.filter((b) => b.id !== bookId));
      setContinueReadingBooks((prev) => prev.filter((b) => b.id !== bookId));
      useLibraryStore.getState().markBookUnassigned(bookId);
    } catch (err) {
      logger.error("Failed to remove book:", err);
      AlertToast("فشل حذف الكتاب من المفضلة.", "ERROR");
    }
  }, []);

  return {
    assignedBooks,
    loadingAssigned,
    recommendedBooks,
    loadingRecommended,
    continueReadingBooks,
    isLoading: loadingAssigned && loadingRecommended,
    loadAssignedBooks,
    loadRecommendedBooks,
    handleRemoveAssignedBook,
  };
}

export default useReaderDashboard;
