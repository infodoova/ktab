import { useState, useEffect, useCallback } from "react";

export const STORY_GENRES = [
  { id: "ALL", label: "جميع التصنيفات" },
  { id: "خيال علمي", label: "خيال علمي" },
  { id: "فانتازيا", label: "فانتازيا" },
  { id: "غموض وتشويق", label: "غموض وتشويق" },
  { id: "رعب", label: "رعب" },
  { id: "مغامرة", label: "مغامرة" },
  { id: "تاريخي", label: "تاريخي" },
  { id: "دراما", label: "دراما" },
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
    genres: STORY_GENRES,
    lenses: STORY_LENSES,
    handleGenreSelect,
    handleLensSelect,
    handleApplyClick,
    handleResetClick,
  };
}

export default useStoryFilterModal;
