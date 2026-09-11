import { useState, useEffect, useCallback } from "react";
import { fetchReaderBooks, searchReaderBooks } from "../services/libraryService";
import { AlertToast } from "@/components/myui/AlertToast";
import { useAuthStore } from "@/core/store/authStore";

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

  const [activeFilters, setActiveFilters] = useState({
    query: "",
    mainGenreIds: [],
    subGenreIds: [],
    rating: 0,
    age: null,
  });

  const [sortOptions, setSortOptions] = useState({
    field: "title",
    ascending: true,
  });

  const openSearchModal = () => setIsSearchOpen(true);
  const closeSearchModal = () => setIsSearchOpen(false);

  const handleApplyFilters = (newFilters) => {
    setActiveFilters({
      query: newFilters.title || "",
      mainGenreIds: newFilters.mainGenreIds || [],
      subGenreIds: newFilters.subGenreIds || [],
      age: newFilters.age,
      rating: newFilters.minAverageRating || 0,
    });
    setPage(0);
    closeSearchModal();
  };

  const handleSortChange = ({ field, ascending }) => {
    setSortOptions({ field, ascending });
    setPage(0);
  };

  const loadBooks = useCallback(
    async (targetPage = 0, isInitial = false) => {
      if (!user?.userId) return;

      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        const hasActiveFilters =
          Boolean(activeFilters.query) ||
          activeFilters.mainGenreIds.length > 0 ||
          activeFilters.subGenreIds.length > 0 ||
          Boolean(activeFilters.age) ||
          activeFilters.rating > 0;

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
        if (isInitial) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [user?.userId, activeFilters, sortOptions]
  );

  useEffect(() => {
    loadBooks(0, true);
  }, [loadBooks]);

  const loadMore = () => {
    if (!loading && !loadingMore && page + 1 < totalPages) {
      loadBooks(page + 1, false);
    }
  };

  return {
    books,
    loading,
    loadingMore,
    page,
    totalPages,
    isSearchOpen,
    activeFilters,
    sortOptions,
    openSearchModal,
    closeSearchModal,
    handleApplyFilters,
    handleSortChange,
    loadMore,
  };
}

export default useLibraryBooks;
