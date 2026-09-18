import { useState, useEffect, useMemo } from "react";
import { useGenreStore } from "@/core/store";

export const AGE_BRACKETS = [
  { value: "", label: "جميع الفئات العمرية", minAge: null, maxAge: null, repAge: null },
  { value: "children", label: "أطفال (5 - 12 سنة)", minAge: 5, maxAge: 12, repAge: 8 },
  { value: "teens", label: "يافعين (13 - 17 سنة)", minAge: 13, maxAge: 17, repAge: 15 },
  { value: "adults", label: "بالغين (18 - 45 سنة)", minAge: 18, maxAge: 45, repAge: 25 },
  { value: "seniors", label: "كبار السن (46 - 80 سنة)", minAge: 46, maxAge: 80, repAge: 60 },
];

/**
 * Hook for managing advanced search filters with dual category/subgenre selects, age brackets, and modal state.
 */
export function useBookSearch({ isOpen, onClose, onApply }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAgeBracket, setSelectedAgeBracket] = useState("");
  const { genres, fetchGenres } = useGenreStore();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubGenre, setSelectedSubGenre] = useState("");

  // Responsive mobile bottom sheet detection
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 768px)");
    const handleMqlChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handleMqlChange);
    return () => mql.removeEventListener("change", handleMqlChange);
  }, []);

  // Prevent background body scroll when modal/bottomsheet is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Load genres from global Zustand cache when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen, fetchGenres]);

  // Current selected category object and its related subgenres
  const currentCategory = useMemo(() => {
    if (!selectedCategory) return null;
    return genres.find((g) => String(g.id) === String(selectedCategory)) || null;
  }, [genres, selectedCategory]);

  const availableSubGenres = currentCategory?.subGenres || [];

  // Prepared option lists for global Select components
  const categoryOptions = useMemo(() => {
    return [
      { value: "", label: "جميع التصنيفات" },
      ...genres.map((g) => ({
        value: String(g.id),
        label: g.name || g.nameAr || "",
      })),
    ];
  }, [genres]);

  const subGenreOptions = useMemo(() => {
    if (!availableSubGenres.length) return [];
    return [
      { value: "", label: "جميع التصنيفات الفرعية" },
      ...availableSubGenres.map((s) => ({
        value: String(s.id),
        label: s.name || s.nameAr || "",
      })),
    ];
  }, [availableSubGenres]);

  const ageOptions = useMemo(() => {
    return AGE_BRACKETS.map((b) => ({
      value: b.value,
      label: b.label,
    }));
  }, []);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubGenre(""); // Reset subgenre when category changes
  };

  const handleSubGenreChange = (subId) => {
    setSelectedSubGenre(subId);
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating((prev) => (prev === rating ? 0 : rating));
  };

  const handleAgeBracketChange = (bracketVal) => {
    setSelectedAgeBracket(bracketVal);
  };

  const handleApplyFilters = () => {
    const bracket = AGE_BRACKETS.find((b) => b.value === selectedAgeBracket);
    onApply?.({
      mainGenreIds: selectedCategory ? [Number(selectedCategory)] : [],
      subGenreIds: selectedSubGenre ? [Number(selectedSubGenre)] : [],
      ageBracket: selectedAgeBracket || null,
      minAge: bracket?.minAge ?? null,
      maxAge: bracket?.maxAge ?? null,
      ageRange: bracket?.minAge ? `${bracket.minAge}-${bracket.maxAge}` : null,
      age: bracket?.repAge ?? null,
      minAverageRating: selectedRating,
      page: 0,
      size: 8,
    });
    onClose?.();
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedSubGenre("");
    setSelectedRating(0);
    setSelectedAgeBracket("");
  };

  return {
    isMobile,
    selectedRating,
    setSelectedRating,
    handleRatingSelect,
    selectedAgeBracket,
    setSelectedAgeBracket,
    handleAgeBracketChange,
    ageOptions,
    genres,
    selectedCategory,
    currentCategory,
    availableSubGenres,
    selectedSubGenre,
    categoryOptions,
    subGenreOptions,
    handleCategoryChange,
    handleSubGenreChange,
    handleApplyFilters,
    handleResetFilters,
  };
}

export default useBookSearch;
