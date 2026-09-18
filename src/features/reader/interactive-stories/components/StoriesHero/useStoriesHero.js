import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Custom hook encapsulating all lifecycle, autoplay timer, and slide navigation logic for StoriesHero.
 */
export function useStoriesHero({ stories = [], onStoryClick, onStartStory } = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = stories.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, total, isPaused]);

  const currentStory = useMemo(() => {
    if (total === 0) return null;
    return stories[currentIndex] || stories[0];
  }, [stories, currentIndex, total]);

  const coverUrl = currentStory?.coverImageUrl || currentStory?.cover || null;
  const genre = currentStory?.genre || "مغامرة تفاعلية";
  const title = currentStory?.title || "قصة تفاعلية";
  const description =
    currentStory?.description ||
    "عش تجربة سردية تفاعلية فريدة من نوعها، حيث تحدد اختياراتك مسار الأحداث وتصنع نهايتك الخاصة.";

  const handleStartAdventure = useCallback(() => {
    if (!currentStory) return;
    if (typeof onStartStory === "function") {
      onStartStory(currentStory.id);
    } else if (typeof onStoryClick === "function") {
      onStoryClick(currentStory);
    }
  }, [currentStory, onStartStory, onStoryClick]);

  const handleDetailsClick = useCallback(() => {
    if (!currentStory || typeof onStoryClick !== "function") return;
    onStoryClick(currentStory);
  }, [currentStory, onStoryClick]);

  const handleArtworkKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleDetailsClick();
      }
    },
    [handleDetailsClick]
  );

  return {
    total,
    currentIndex,
    currentStory,
    coverUrl,
    genre,
    title,
    description,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave,
    handleStartAdventure,
    handleDetailsClick,
    handleArtworkKeyDown,
  };
}

export default useStoriesHero;
