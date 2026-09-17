import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CONSTITUTION_LABELS,
  ARABIC_MODAL_TAG_MAP,
} from "../../constants/interactiveStoriesConstants";

/**
 * Custom hook encapsulating StoryEditorModal state, lifecycle, and data transformations.
 */
export function useStoryEditorModal({ isOpen, onClose, story }) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  const coverUrl = story?.coverImageUrl || story?.coverImage || story?.cover;

  useEffect(() => {
    setCoverLoaded(false);
    setHasCoverError(false);
  }, [coverUrl]);

  const handleCoverLoad = useCallback(() => {
    setCoverLoaded(true);
  }, []);

  const handleCoverError = useCallback(() => {
    setHasCoverError(true);
    setCoverLoaded(false);
  }, []);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const rawGenre = story?.genre || story?.visualStyle || "مغامرة تفاعلية";
  const genreLabel = ARABIC_MODAL_TAG_MAP[rawGenre] || rawGenre;
  const lensLabel = story?.lens ? ARABIC_MODAL_TAG_MAP[story.lens] || story.lens : null;
  const rawStyle = story?.visualStyle || story?.genre;
  const styleLabel = rawStyle ? ARABIC_MODAL_TAG_MAP[rawStyle] || rawStyle : null;
  const scenes = story?.maxScenes ?? story?.sceneCount ?? story?.scenesCount ?? 0;

  const constitutionEntries = useMemo(() => {
    if (!story?.constitution) return [];

    let parsed = story.constitution;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        return [{ label: "الدستور السردي", value: story.constitution }];
      }
    }

    if (typeof parsed !== "object" || parsed === null) {
      return [];
    }

    return Object.entries(parsed)
      .filter(([_, val]) => val && String(val).trim().length > 0)
      .map(([key, value]) => ({
        key,
        label: CONSTITUTION_LABELS[key] || key,
        value: Array.isArray(value) ? value.join("، ") : String(value),
      }));
  }, [story?.constitution]);

  return {
    coverUrl,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    genreLabel,
    lensLabel,
    styleLabel,
    scenes,
    constitutionEntries,
  };
}

export default useStoryEditorModal;
