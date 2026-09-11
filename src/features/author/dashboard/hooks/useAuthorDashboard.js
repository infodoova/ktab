import { useState, useEffect, useCallback } from "react";
import {
  fetchAuthorAnalytics,
  fetchAuthorBookAnalytics,
  fetchBookAgeStats,
  fetchBookMostReadStats,
} from "../services/authorDashboardService";
import { useGenreStore } from "@/core/store";
import { AlertToast } from "@/components/myui/AlertToast";
import logger from "@/lib/logger";

/**
 * Hook for author dashboard analytics, books list, genres, and charts data.
 */
export function useAuthorDashboard() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [booksLoading, setBooksLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { fetchGenres } = useGenreStore();
  const [genres, setGenres] = useState(["الكل"]);

  const [selectedBookId, setSelectedBookId] = useState(null);

  const [ageStats, setAgeStats] = useState([]);
  const [ageLoading, setAgeLoading] = useState(false);

  const [mostReadStats, setMostReadStats] = useState([]);
  const [mostReadLoading, setMostReadLoading] = useState(false);

  // 1. Fetch Author Summary Analytics
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetchAuthorAnalytics();
      if (res?.messageStatus === "SUCCESS" || res?.data) {
        setStats(res?.data || null);
      } else if (res?.message) {
        AlertToast(res.message, res.messageStatus || "ERROR");
      }
    } catch (err) {
      logger.error("Error fetching author stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // 2. Fetch Books Analytics
  const loadBooks = useCallback(async (targetPage = 0, isInitial = false) => {
    if (isInitial) setBooksLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetchAuthorBookAnalytics({ page: targetPage, size: 8 });
      const payload = res?.data ?? res ?? {};
      const content = Array.isArray(payload.content) ? payload.content : [];
      const total = payload.totalPages ?? 1;

      setBooks((prev) => (targetPage === 0 ? content : [...prev, ...content]));
      setTotalPages(total);
      setPage(targetPage);
    } catch (err) {
      logger.error("Error fetching author books analytics:", err);
    } finally {
      if (isInitial) setBooksLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  // 3. Fetch Genres from Global Cache
  const loadGenres = useCallback(async () => {
    try {
      const data = await fetchGenres();
      if (Array.isArray(data)) {
        const names = data.map((g) => g.name || g.arabicName).filter(Boolean);
        setGenres(["الكل", ...names]);
      }
    } catch (err) {
      logger.error("Failed to load genres:", err);
    }
  }, [fetchGenres]);

  useEffect(() => {
    loadStats();
    loadBooks(0, true);
    loadGenres();
  }, [loadStats, loadBooks, loadGenres]);


  // Set default active book when books arrive & fallback genres from loaded books
  useEffect(() => {
    if (!selectedBookId && books.length > 0) {
      setSelectedBookId(books[0]?.id);
    }

    if (books.length > 0) {
      setGenres((prev) => {
        const existing = new Set(prev);
        books.forEach((b) => {
          const gName = b.genreName || b.mainGenre?.name || b.genre;
          if (gName) existing.add(gName);
        });
        return Array.from(existing);
      });
    }
  }, [books, selectedBookId]);

  // 4. Fetch Chart Data when selectedBookId changes
  useEffect(() => {
    if (!selectedBookId) {
      setAgeStats([]);
      setMostReadStats([]);
      return;
    }

    let active = true;

    async function loadChartData() {
      setAgeLoading(true);
      setMostReadLoading(true);

      try {
        const [ageData, mostReadData] = await Promise.all([
          fetchBookAgeStats(selectedBookId),
          fetchBookMostReadStats(selectedBookId),
        ]);

        if (active) {
          setAgeStats(ageData);
          setMostReadStats(mostReadData);
        }
      } catch (err) {
        console.error("Chart data loading error:", err);
        if (active) {
          setAgeStats([]);
          setMostReadStats([]);
        }
      } finally {
        if (active) {
          setAgeLoading(false);
          setMostReadLoading(false);
        }
      }
    }

    loadChartData();
    return () => {
      active = false;
    };
  }, [selectedBookId]);

  const loadMoreBooks = () => {
    if (!booksLoading && !loadingMore && page + 1 < totalPages) {
      loadBooks(page + 1, false);
    }
  };

  return {
    stats,
    statsLoading,
    books,
    booksLoading,
    loadingMore,
    page,
    totalPages,
    genres,
    selectedBookId,
    setSelectedBookId,
    ageStats,
    ageLoading,
    mostReadStats,
    mostReadLoading,
    loadMoreBooks,
    refreshDashboard: () => {
      loadStats();
      loadBooks(0, true);
    },
  };
}

export default useAuthorDashboard;
