import { useState, useCallback } from "react";

/**
 * Custom hook encapsulating image loading lifecycle and interaction handlers for StoryCard.
 */
export function useStoryCard({ story, onClick } = {}) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const coverUrl = story?.coverImageUrl || story?.cover || null;
  const title = story?.title || "قصة تفاعلية";
  const genre = story?.genre || "مغامرة";
  const authorName = story?.authorName || "";
  const sceneCount = story?.sceneCount ?? story?.maxScenes ?? null;
  const description = story?.constitution?.coreTheme || story?.description || "";

  const handleCoverLoad = useCallback(() => {
    setCoverLoaded(true);
    setHasError(false);
  }, []);

  const handleCoverError = useCallback(() => {
    setCoverLoaded(false);
    setHasError(true);
  }, []);

  const handleClick = useCallback(() => {
    if (typeof onClick === "function") {
      onClick(story);
    }
  }, [onClick, story]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return {
    coverUrl,
    title,
    genre,
    authorName,
    sceneCount,
    description,
    coverLoaded,
    hasError,
    handleCoverLoad,
    handleCoverError,
    handleClick,
    handleKeyDown,
  };
}

export default useStoryCard;
