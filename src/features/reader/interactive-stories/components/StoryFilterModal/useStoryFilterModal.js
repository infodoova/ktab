import { useState, useEffect, useCallback, useMemo } from "react";
import { useEnumStore } from "@/core/store";

export const STORY_GENRES = [
  { id: "ALL", label: "جميع التصنيفات" },
  { id: "SCI_FI", label: "خيال علمي" },
  { id: "FANTASY", label: "خيال" },
  { id: "MYSTERY", label: "غموض" },
  { id: "HORROR", label: "رعب" },
  { id: "ADVENTURE", label: "مغامرة" },
  { id: "DRAMA", label: "دراما" },
];

export const STORY_LENSES = [
  { id: "ALL", label: "جميع المنظورات" },
  { id: "SURVIVAL", label: "صراع البقاء (Survival)" },
  { id: "POLITICAL", label: "صراع سياسي (Political)" },
  { id: "PSYCHOLOGICAL", label: "صراع نفسي (Psychological)" },
  { id: "MORAL", label: "معضلة أخلاقية (Moral)" },
];

/**
 * Custom Hook managing filter selections and modal events for StoryFilterModal.
 */
export function useStoryFilterModal({
  isOpen,
  selectedGenre = "ALL",
  selectedLens = "ALL",
  onApply,
  onReset,
  onClose,
}) {
  const { storyGenres, storyLenses, fetchStoryEnums } = useEnumStore();

  useEffect(() => {
    fetchStoryEnums();
  }, [fetchStoryEnums]);

  const genres = useMemo(() => {
    if (storyGenres && storyGenres.length > 0) {
      return [
        { id: "ALL", label: "جميع التصنيفات" },
        ...storyGenres.map((g) => ({ id: g.key, label: g.labelAr })),
      ];
    }
    return STORY_GENRES;
  }, [storyGenres]);

  const lenses = useMemo(() => {
    if (storyLenses && storyLenses.length > 0) {
      return [
        { id: "ALL", label: "جميع المنظورات" },
        ...storyLenses.map((l) => ({
          id: l.key,
          label: l.labelEn ? `${l.labelAr} (${l.labelEn})` : l.labelAr,
        })),
      ];
    }
    return STORY_LENSES;
  }, [storyLenses]);
  const [draftGenre, setDraftGenre] = useState(selectedGenre);
  const [draftLens, setDraftLens] = useState(selectedLens);
  const [isMobile, setIsMobile] = useState(false);

  // Sync draft state on open
  useEffect(() => {
    if (isOpen) {
      setDraftGenre(selectedGenre);
      setDraftLens(selectedLens);
    }
  }, [isOpen, selectedGenre, selectedLens]);

  // Responsive mobile detector
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGenreSelect = useCallback((genreId) => {
    setDraftGenre(genreId);
  }, []);

  const handleLensSelect = useCallback((lensId) => {
    setDraftLens(lensId);
  }, []);

  const handleApplyClick = useCallback(() => {
    if (typeof onApply === "function") {
      onApply({ genre: draftGenre, lens: draftLens });
    }
    if (typeof onClose === "function") {
      onClose();
    }
  }, [draftGenre, draftLens, onApply, onClose]);

  const handleResetClick = useCallback(() => {
    setDraftGenre("ALL");
    setDraftLens("ALL");
    if (typeof onReset === "function") {
      onReset();
    }
    if (typeof onClose === "function") {
      onClose();
    }
  }, [onReset, onClose]);

  return {
    draftGenre,
    draftLens,
    isMobile,
    genres,
    lenses,
    handleGenreSelect,
    handleLensSelect,
    handleApplyClick,
    handleResetClick,
  };
}

export default useStoryFilterModal;
