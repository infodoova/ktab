import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AUTHOR_TABLE_SORT_OPTIONS } from "../../constants/dashboardConstants";

/**
 * Dedicated hook for AuthorBooksTable filtering, sorting, pagination, and scroll logic.
 */
export function useAuthorBooksTable({
  books = [],
  genres = ["الكل"],
  searchQuery = "",
  selectedBookId,
  onSelectBookForStats,
  onPageChange,
}) {
  const [selectedGenre, setSelectedGenre] = useState("الكل");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "PUBLISHED" | "DRAFT"
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const genreOptions = useMemo(
    () =>
      genres.map((g) => ({
        value: g,
        label: g === "الكل" ? "جميع التصنيفات" : g,
      })),
    [genres]
  );

  const sortOptions = AUTHOR_TABLE_SORT_OPTIONS;

  // Auto-close filter sheet on desktop width and track mobile state
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileScreen(isMobile);
      if (!isMobile) {
        setIsFilterSheetOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Horizontal scroll indicator state for mobile/tablets
  const tableContainerRef = useRef(null);
  const tableContentRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleTableScroll = useCallback(() => {
    const el = tableContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const scrollPos = Math.abs(el.scrollLeft);
      const progress = Math.min(100, Math.max(0, (scrollPos / maxScroll) * 100));
      setScrollProgress(progress);
    }
  }, []);

  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScroll(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [books]);

  const resetFilters = () => {
    setSelectedGenre("الكل");
    setSortBy("newest");
    setStatusFilter("ALL");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGenre !== "الكل") count++;
    if (sortBy !== "newest") count++;
    if (statusFilter !== "ALL") count++;
    return count;
  }, [selectedGenre, sortBy, statusFilter]);

  const displayedBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];

    let result = [...books];

    // 1. Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((b) => {
        const title = (b.title || "").toLowerCase();
        const genre = (
          b.genreName ||
          (typeof b.mainGenre === "string" ? b.mainGenre : b.mainGenre?.name) ||
          b.genre ||
          ""
        ).toLowerCase();
        return title.includes(q) || genre.includes(q);
      });
    }

    // 2. Genre Filter
    if (selectedGenre && selectedGenre !== "الكل") {
      result = result.filter((b) => {
        const gName =
          b.genreName ||
          (typeof b.mainGenre === "string" ? b.mainGenre : b.mainGenre?.name) ||
          b.genre;
        return gName === selectedGenre;
      });
    }

    // 3. Status Single-Choice Filter
    if (statusFilter === "PUBLISHED") {
      result = result.filter(
        (b) => b.isDraft === false || b.status === "PUBLISHED"
      );
    } else if (statusFilter === "DRAFT") {
      result = result.filter(
        (b) => b.isDraft === true || b.status === "DRAFT"
      );
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === "highest_rated") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (sortBy === "most_read") {
        const readsA = a.totalReaders ?? a.readCount ?? a.totalReads ?? 0;
        const readsB = b.totalReaders ?? b.readCount ?? b.totalReads ?? 0;
        return readsB - readsA;
      }
      const idA = a.id ?? a.bookId ?? 0;
      const idB = b.id ?? b.bookId ?? 0;
      return idB - idA;
    });

    return result;
  }, [books, searchQuery, selectedGenre, statusFilter, sortBy]);

  const handleSelectBook = (bookId) => {
    if (onSelectBookForStats) {
      onSelectBookForStats(bookId);
    }
  };

  const scrollTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const handlePaginationChange = useCallback(
    (newPage) => {
      // 1. Blur any active element (e.g. pagination button) to prevent mobile browser focus-anchoring back to bottom
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // 2. Perform smooth scroll to table content (line loader & first row) across all browser engines
      scrollTimerRef.current = setTimeout(() => {
        const el =
          tableContentRef.current ||
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

      // 3. Trigger state update
      onPageChange?.(newPage);
    },
    [onPageChange]
  );

  return {
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    isMobileScreen,
    activeFiltersCount,
    resetFilters,
    displayedBooks,
    handleSelectBook,
    tableContainerRef,
    tableContentRef,
    handleTableScroll,
    canScroll,
    scrollProgress,
    handlePaginationChange,
    genreOptions,
    sortOptions,
  };
}

export default useAuthorBooksTable;
