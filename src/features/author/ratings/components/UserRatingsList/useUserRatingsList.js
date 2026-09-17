import { useState, useMemo, useCallback } from "react";
import { RATING_FILTER_OPTIONS, RATING_SORT_OPTIONS } from "../../constants/ratingsConstants";

/**
 * Custom hook managing reviews filtering by rating tier, sorting, and reviewer avatar metadata.
 * Encapsulates mobile filter sheet state and reset actions.
 */
export function useUserRatingsList({ reviews = [] }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeSort, setActiveSort] = useState("NEWEST");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Compute number of non-default filters currently applied
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeFilter !== "ALL") count += 1;
    if (activeSort !== "NEWEST") count += 1;
    return count;
  }, [activeFilter, activeSort]);

  const resetFilters = useCallback(() => {
    setActiveFilter("ALL");
    setActiveSort("NEWEST");
  }, []);

  const processedReviews = useMemo(() => {
    let list = Array.isArray(reviews) ? [...reviews] : [];

    // Filter by rating tier
    if (activeFilter === "5_STARS") {
      list = list.filter((r) => Number(r.rating) >= 5);
    } else if (activeFilter === "4_PLUS") {
      list = list.filter((r) => Number(r.rating) >= 4);
    } else if (activeFilter === "3_PLUS") {
      list = list.filter((r) => Number(r.rating) >= 3);
    }

    // Sort
    list.sort((a, b) => {
      if (activeSort === "HIGHEST") {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (activeSort === "LOWEST") {
        return (Number(a.rating) || 0) - (Number(b.rating) || 0);
      }
      // Default: NEWEST
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return list.map((item) => {
      const name = item.userName || item.readerName || "قارئ كِتاب";
      const initial = name.trim().charAt(0);
      const ratingVal = Number(item.rating || 0).toFixed(1);

      let dateFormatted = "";
      if (item.createdAt) {
        try {
          const d = new Date(item.createdAt);
          if (!isNaN(d.getTime())) {
            dateFormatted = d.toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          }
        } catch {
          dateFormatted = "";
        }
      }

      return {
        ...item,
        name,
        initial,
        ratingVal,
        dateFormatted,
      };
    });
  }, [reviews, activeFilter, activeSort]);

  return {
    filterOptions: RATING_FILTER_OPTIONS,
    activeFilter,
    setActiveFilter,
    sortOptions: RATING_SORT_OPTIONS,
    activeSort,
    setActiveSort,
    reviewsList: processedReviews,
    totalCount: processedReviews.length,
    hasReviews: processedReviews.length > 0,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    activeFiltersCount,
    resetFilters,
  };
}

export default useUserRatingsList;
