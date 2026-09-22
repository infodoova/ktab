import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fetchReaderBooks, searchReaderBooks } from "../services/libraryService";
import { AlertToast } from "@/components/myui/AlertToast";
import { useAuthStore } from "@/core/store/authStore";

const EMPTY_FILTERS = {
  query: "",
  mainGenreIds: [],
  subGenreIds: [],
  rating: 0,
  age: null,
};

/**
 * Hook managing the library book catalog, active filters, search state, sorting, and pagination.
 */
export function useLibraryBooks() {
  const user = useAuthStore((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);

  const [sortOptions, setSortOptions] = useState({
    field: "title",
    ascending: true,
  });

  // Debounce topbar search query input to avoid spamming search requests on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveFilters((prev) => {
        if (prev.query === searchQueryInput) return prev;
        return { ...prev, query: searchQueryInput };
      });
      setPage(0);
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQueryInput]);

  const handleSearchQueryChange = useCallback((newQuery) => {
    setSearchQueryInput(newQuery);
  }, []);

  const openSearchModal = useCallback(() => setIsSearchOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchOpen(false), []);

  const handleApplyFilters = useCallback((newFilters) => {
    const nextQuery = newFilters.title || "";
    setSearchQueryInput(nextQuery);
    setActiveFilters({
      query: nextQuery,
      mainGenreIds: newFilters.mainGenreIds || [],
      subGenreIds: newFilters.subGenreIds || [],
      age: newFilters.age,
      minAge: newFilters.minAge,
      maxAge: newFilters.maxAge,
      ageRange: newFilters.ageRange,
      ageBracket: newFilters.ageBracket,
      rating: newFilters.minAverageRating || 0,
    });
    setPage(0);
    closeSearchModal();
  }, [closeSearchModal]);

  const handleResetFilters = useCallback(() => {
    setSearchQueryInput("");
    setActiveFilters(EMPTY_FILTERS);
    setPage(0);
  }, []);

  const handleSortChange = useCallback(({ field, ascending }) => {
    setSortOptions({ field, ascending });
    setPage(0);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(activeFilters.query) ||
      activeFilters.mainGenreIds.length > 0 ||
      activeFilters.subGenreIds.length > 0 ||
      Boolean(activeFilters.age) ||
      Boolean(activeFilters.ageBracket) ||
      Boolean(activeFilters.minAge) ||
      activeFilters.rating > 0,
    [activeFilters]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeFilters.query) count += 1;
    if (activeFilters.mainGenreIds.length > 0) count += activeFilters.mainGenreIds.length;
    if (activeFilters.subGenreIds.length > 0) count += activeFilters.subGenreIds.length;
    if (activeFilters.rating > 0) count += 1;
    if (activeFilters.age || activeFilters.ageBracket || activeFilters.minAge) count += 1;
    return count;
  }, [activeFilters]);

  const isFetchingRef = useRef(false);

  const loadBooks = useCallback(
    async (targetPage = 0, isInitial = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = hasActiveFilters
          ? await searchReaderBooks({ filters: activeFilters, page: targetPage, sortOptions })
          : await fetchReaderBooks({ page: targetPage, sortOptions });

        const content = Array.isArray(res?.content) ? res.content : [];
        const total = res?.totalPages ?? 1;

        setBooks((prev) => (targetPage === 0 ? content : [...prev, ...content]));
        setTotalPages(total);
        setPage(targetPage);
      } catch (error) {
        console.error("Library books fetch error:", error);
        AlertToast("تعذر الاتصال بالخادم، حاول لاحقاً.", "ERROR");
      } finally {
        isFetchingRef.current = false;
        if (isInitial) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [hasActiveFilters, activeFilters, sortOptions]
  );

  useEffect(() => {
    loadBooks(0, true);
  }, [loadBooks]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && page + 1 < totalPages) {
      loadBooks(page + 1, false);
    }
  }, [loading, loadingMore, page, totalPages, loadBooks]);

  return {
    books,
    loading,
    loadingMore,
    page,
    totalPages,
    isSearchOpen,
    searchQueryInput,
    handleSearchQueryChange,
    activeFilters,
    hasActiveFilters,
    activeFiltersCount,
    sortOptions,
    openSearchModal,
    closeSearchModal,
    handleApplyFilters,
    handleResetFilters,
    handleSortChange,
    loadMore,
  };
}

export default useLibraryBooks;
