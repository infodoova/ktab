import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchAuthorAnalytics,
  fetchAuthorBookAnalytics,
  fetchBookAgeStats,
  fetchBookMostReadStats,
} from "../services/authorDashboardService";
import { FAKE_AUTHOR_ANALYTICS } from "@/fakedataorassets/testData";
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
  const [isAgeDemo, setIsAgeDemo] = useState(false);

  const [mostReadStats, setMostReadStats] = useState([]);
  const [mostReadLoading, setMostReadLoading] = useState(false);
  const [isMostReadDemo, setIsMostReadDemo] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const booksFetchIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Smoothly scroll down to the books table when a search query is entered (debounced)
  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) return;

    const timer = setTimeout(() => {
      const tableEl = document.getElementById("author-books-table");
      if (tableEl) {
        const topbarHeight = window.innerWidth < 768 ? 68 : 80;
        const rect = tableEl.getBoundingClientRect();
        // Avoid scrolling if table is already visible within the viewport
        if (rect.top < topbarHeight + 60 && rect.bottom > 150) {
          return;
        }
        const currentY =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        const targetScrollY = currentY + rect.top - topbarHeight;
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: "smooth",
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 1. Fetch Author Summary Analytics (Direct Live API)
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetchAuthorAnalytics();
      if (!isMountedRef.current) return;
      if (res?.messageStatus === "SUCCESS" || res?.data) {
        const data = res?.data || null;
        setStats(data);
        if (data?.totalBooks && typeof data.totalBooks === "number") {
          const calculatedPages = Math.ceil(data.totalBooks / 8);
          if (calculatedPages > 1) {
            setTotalPages((prev) => Math.max(prev, calculatedPages));
          }
        }
      } else if (res?.message) {
        AlertToast(res.message, res.messageStatus || "ERROR");
      }
    } catch (err) {
      logger.error("Error fetching author stats:", err);
    } finally {
      if (isMountedRef.current) {
        setStatsLoading(false);
      }
    }
  }, []);

  // 2. Fetch Books Analytics (Guarded against race conditions via fetchId sequence)
  const loadBooks = useCallback(async (targetPage = 0, isInitial = false) => {
    const fetchId = ++booksFetchIdRef.current;
    if (isInitial) setBooksLoading(true);
    else setLoadingMore(true);

    try {
      const minDelay = !isInitial
        ? new Promise((r) => setTimeout(r, 500))
        : Promise.resolve();

      const [res] = await Promise.all([
        fetchAuthorBookAnalytics({ page: targetPage, size: 8 }),
        minDelay,
      ]);

      // Guard: discard stale response if another page was requested or component unmounted
      if (!isMountedRef.current || fetchId !== booksFetchIdRef.current) {
        return;
      }

      const payload = res?.data ?? res ?? {};
      const content = Array.isArray(payload.content)
        ? payload.content
        : Array.isArray(payload)
        ? payload
        : [];

      const total =
        typeof payload.totalPages === "number" && payload.totalPages > 0
          ? payload.totalPages
          : typeof payload.totalElements === "number" && payload.totalElements > 0
          ? Math.ceil(payload.totalElements / 8)
          : Array.isArray(content) && content.length === 8
          ? Math.max(2, targetPage + 2)
          : 1;

      setBooks(content);
      setTotalPages((prev) => Math.max(prev, total));
      setPage(targetPage);
    } catch (err) {
      if (isMountedRef.current && fetchId === booksFetchIdRef.current) {
        logger.error("Error fetching author books analytics:", err);
      }
    } finally {
      if (isMountedRef.current && fetchId === booksFetchIdRef.current) {
        if (isInitial) setBooksLoading(false);
        else setLoadingMore(false);
      }
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
    let active = true;

    async function loadChartData() {
      setAgeLoading(true);
      setMostReadLoading(true);

      try {
        if (selectedBookId) {
          const [ageData, mostReadData] = await Promise.all([
            fetchBookAgeStats(selectedBookId),
            fetchBookMostReadStats(selectedBookId),
          ]);

          if (active) {
            if (Array.isArray(ageData) && ageData.length > 0) {
              setAgeStats(ageData);
              setIsAgeDemo(false);
            } else {
              setAgeStats(FAKE_AUTHOR_ANALYTICS.ageStats);
              setIsAgeDemo(true);
            }

            if (Array.isArray(mostReadData) && mostReadData.length > 0) {
              setMostReadStats(mostReadData);
              setIsMostReadDemo(false);
            } else {
              setMostReadStats(FAKE_AUTHOR_ANALYTICS.mostReadStats);
              setIsMostReadDemo(true);
            }
          }
        } else {
          if (active) {
            setAgeStats(FAKE_AUTHOR_ANALYTICS.ageStats);
            setIsAgeDemo(true);
            setMostReadStats(FAKE_AUTHOR_ANALYTICS.mostReadStats);
            setIsMostReadDemo(true);
          }
        }
      } catch (err) {
        logger.error("Chart data loading error:", err);
        if (active) {
          setAgeStats(FAKE_AUTHOR_ANALYTICS.ageStats);
          setIsAgeDemo(true);
          setMostReadStats(FAKE_AUTHOR_ANALYTICS.mostReadStats);
          setIsMostReadDemo(true);
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

  // Whenever pagination loads, automatically scroll to the table content (loader & first row)
  useEffect(() => {
    if (loadingMore) {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      setTimeout(() => {
        const el =
          document.getElementById("author-books-table-content") ||
          document.getElementById("author-books-table");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          const topbarHeight = window.innerWidth < 768 ? 65 : 75;
          const rect = el.getBoundingClientRect();
          const currentY =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
          const targetY = currentY + rect.top - topbarHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
          document.documentElement.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
          document.body.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
      }, 30);
    }
  }, [loadingMore]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && !booksLoading && !loadingMore) {
      loadBooks(newPage, false);
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
    isAgeDemo,
    mostReadStats,
    mostReadLoading,
    isMostReadDemo,
    searchQuery,
    setSearchQuery,
    onPageChange: handlePageChange,
    refreshDashboard: () => {
      loadStats();
      loadBooks(0, true);
    },
  };
}

export default useAuthorDashboard;
