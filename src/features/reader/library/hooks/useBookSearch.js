import { useState, useEffect, useRef } from "react";
import { useGenreStore } from "@/core/store";

/**
 * Hook for managing advanced search filters, categories, and modal state.
 */
export function useBookSearch({ isOpen, onClose, onApply }) {
  const [query, setQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAge, setSelectedAge] = useState("");
  const { genres, fetchGenres } = useGenreStore();
  const [selectedMainGenres, setSelectedMainGenres] = useState([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState([]);
  const [expandedGenre, setExpandedGenre] = useState(null);

  const inputRef = useRef(null);

  // Load genres from global Zustand cache when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen, fetchGenres]);


  // Focus input automatically
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleMainGenre = (genreId) => {
    setSelectedMainGenres((prevSelected) => {
      const isCurrentlySelected = prevSelected.includes(genreId);
      const newSelected = isCurrentlySelected
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId];

      if (isCurrentlySelected) {
        setSelectedSubGenres((prevSub) =>
          prevSub.filter((subId) => {
            const parent = genres.find((g) =>
              g.subGenres?.some((s) => s.id === subId)
            );
            return !(parent && parent.id === genreId);
          })
        );
      }

      setExpandedGenre((prevExpanded) => {
        if (isCurrentlySelected) {
          return prevExpanded === genreId ? null : prevExpanded;
        }
        return genreId;
      });

      return newSelected;
    });
  };

  const toggleExpandGenre = (genreId) => {
    setExpandedGenre((prev) => (prev === genreId ? null : genreId));
  };

  const toggleSubGenre = (subId, parentGenreId) => {
    setSelectedSubGenres((prev) => {
      const isSelected = prev.includes(subId);

      if (!isSelected && parentGenreId) {
        setSelectedMainGenres((prevMain) =>
          prevMain.includes(parentGenreId) ? prevMain : [...prevMain, parentGenreId]
        );
      }

      return isSelected ? prev.filter((id) => id !== subId) : [...prev, subId];
    });
  };

  const handleApplyFilters = () => {
    onApply?.({
      title: query || null,
      mainGenreIds: selectedMainGenres,
      subGenreIds: selectedSubGenres,
      age: selectedAge ? Number(selectedAge) : null,
      minAverageRating: selectedRating,
      page: 0,
      size: 8,
    });
    onClose?.();
  };

  const handleResetFilters = () => {
    setQuery("");
    setSelectedMainGenres([]);
    setSelectedSubGenres([]);
    setSelectedRating(0);
    setSelectedAge("");
  };

  return {
    query,
    setQuery,
    selectedRating,
    setSelectedRating,
    selectedAge,
    setSelectedAge,
    genres,
    selectedMainGenres,
    selectedSubGenres,
    expandedGenre,
    inputRef,
    toggleMainGenre,
    toggleExpandGenre,
    toggleSubGenre,
    handleApplyFilters,
    handleResetFilters,
  };
}

export default useBookSearch;
