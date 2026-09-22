import { useState, useEffect, useMemo } from "react";
import { useGenreStore, useEnumStore } from "@/core/store";

export const AGE_BRACKETS = [
  { value: "", label: "جميع الفئات العمرية", minAge: null, maxAge: null, repAge: null },
  { value: "CHILDREN", label: "أطفال (3-8 سنوات)", minAge: 3, maxAge: 8, repAge: 5 },
  { value: "EARLY_TEENS", label: "ناشئة (9-15 سنة)", minAge: 9, maxAge: 15, repAge: 12 },
  { value: "YOUTH", label: "شباب (16-24 سنة)", minAge: 16, maxAge: 24, repAge: 20 },
  { value: "ADULTS", label: "كبار (+25)", minAge: 25, maxAge: null, repAge: 25 },
];

/**
 * Hook for managing advanced search filters with dual category/subgenre selects, age brackets, and modal state.
 */
export function useBookSearch({ isOpen, onClose, onApply }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAgeBracket, setSelectedAgeBracket] = useState("");
  const { genres, fetchGenres } = useGenreStore();
  const { ages, fetchAges } = useEnumStore();

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

  // Load genres and age categories from global Zustand cache when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGenres();
      fetchAges();
    }
  }, [isOpen, fetchGenres, fetchAges]);

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
    const list = ages && ages.length > 0 ? ages : AGE_BRACKETS.slice(1);
    return [
      { value: "", label: "جميع الفئات العمرية" },
      ...list.map((b) => ({
        value: b.key || b.value,
        label: b.labelAr || b.label,
      })),
    ];
  }, [ages]);

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
    const bracket = (ages || []).find(
      (b) => (b.key || b.value) === selectedAgeBracket
    ) || AGE_BRACKETS.find((b) => b.value === selectedAgeBracket);

    onApply?.({
      mainGenreIds: selectedCategory ? [Number(selectedCategory)] : [],
      subGenreIds: selectedSubGenre ? [Number(selectedSubGenre)] : [],
      ageBracket: selectedAgeBracket || null,
      minAge: bracket?.minAge ?? null,
      maxAge: bracket?.maxAge ?? null,
      ageRange: bracket?.minAge != null ? `${bracket.minAge}-${bracket.maxAge ?? ""}` : null,
      age: bracket?.minAge ?? bracket?.repAge ?? null,
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
