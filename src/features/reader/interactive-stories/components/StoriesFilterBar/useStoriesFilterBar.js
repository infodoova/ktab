import { useCallback } from "react";

export const DEFAULT_GENRES = [
  { id: "ALL", label: "جميع المغامرات" },
  { id: "خيال علمي", label: "خيال علمي" },
  { id: "مغامرة", label: "مغامرة" },
  { id: "غموض", label: "غموض وتشويق" },
  { id: "فلسفي", label: "فلسفي" },
  { id: "تاريخي", label: "تاريخي" },
  { id: "رعب", label: "رعب" },
];

/**
 * Custom hook encapsulating search input and genre selection logic.
 */
export function useStoriesFilterBar({
  onSearchChange,
  selectedGenre = "ALL",
  onGenreSelect,
  availableGenres = DEFAULT_GENRES,
} = {}) {
  const handleInputChange = useCallback(
    (e) => {
      onSearchChange?.(e.target.value);
    },
    [onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange?.("");
  }, [onSearchChange]);

  const handleGenreClick = useCallback(
    (genreId) => {
      onGenreSelect?.(genreId);
    },
    [onGenreSelect]
  );

  const isGenreActive = useCallback(
    (genreId) => {
      if (selectedGenre === "ALL" && genreId === "ALL") return true;
      return selectedGenre?.toLowerCase() === genreId?.toLowerCase();
    },
    [selectedGenre]
  );

  return {
    genres: availableGenres,
    handleInputChange,
    handleClearSearch,
    handleGenreClick,
    isGenreActive,
  };
}

export default useStoriesFilterBar;
