import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePublicCoverImages } from "./usePublicCoverImages";

/**
 * Fetches public covers and manages carousel gestures and 3D positioning.
 */
export function useHero() {
  const navigate = useNavigate();
  const { books: fetchedBooks, isLoading, error, retry, refreshAfterImageError } = usePublicCoverImages("top-reviewed", 10, 5, 5);
  const books = useMemo(() => {
    if (!fetchedBooks.length || fetchedBooks.length >= 5) return fetchedBooks;
    // The carousel needs five cards for its center and two cards on each side.
    return Array.from({ length: 5 }, (_, index) => ({
      ...fetchedBooks[index % fetchedBooks.length],
      id: `hero-cover-${index}`,
    }));
  }, [fetchedBooks]);

  // Carousel & 3D Flip State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 680 : false
  );
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 680);
      setWindowWidth(w);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentBook = books[activeIndex] || books[0];

  // Carousel navigation handlers with flip reset
  const nextBook = useCallback(() => {
    if (books.length < 2) return;
    setIsFlipped(false);
    setActiveIndex((prev) => (prev + 1) % books.length);
  }, [books.length]);

  const prevBook = useCallback(() => {
    if (books.length < 2) return;
    setIsFlipped(false);
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  }, [books.length]);

  const selectBook = useCallback((index) => {
    setIsFlipped(false);
    setActiveIndex(index);
  }, []);

  const handleSelectBook = useCallback((event) => {
    selectBook(Number(event.currentTarget.dataset.index));
  }, [selectBook]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Tactile swipe / drag gesture handler for mobile & desktop drag
  const handleDragEnd = useCallback(
    (event, info) => {
      const swipeThreshold = 40;
      const velocityThreshold = 250;
      if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
        prevBook();
      } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
        nextBook();
      }
    },
    [nextBook, prevBook]
  );

  // Audio preview is paused while the API supplies only cover URLs:
  // useVoiceSampleStore.getState().openSample(book);

  // Fluid 3D Apple-style Curved Arc Animation Calculations
  const animatedBooks = useMemo(() => {
    const count = books.length;
    const isSmallMobile = windowWidth <= 420;
    const xStep1 = isMobile
      ? (isSmallMobile ? Math.min(115, Math.max(98, windowWidth * 0.28)) : 126)
      : 215;
    const xStep2 = isMobile ? 230 : 390;
    const centerZ = isMobile ? 85 : 140;
    const centerScale = 1;
    const sideScale1 = isMobile ? 0.82 : 0.84;
    const sideScale2 = isMobile ? 0.62 : 0.70;

    return books.map((book, index) => {
      let offset = (index - activeIndex) % count;
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;

      const isCenter = offset === 0;

      // Realistic 3D arc perspective coordinates
      let x = 0;
      let y = 0;
      let z = 0;
      let scale = 1;
      let rotateY = 0;
      let opacity = 1;
      let zIndex = 10;
      let isVisible = true;

      if (isCenter) {
        x = 0;
        y = 0;
        z = centerZ;
        scale = centerScale;
        rotateY = 0;
        opacity = 1;
        zIndex = 30;
      } else if (offset === 1) {
        x = -xStep1;
        y = 6;
        z = 25;
        scale = sideScale1;
        rotateY = 26;
        opacity = 0.85;
        zIndex = 20;
      } else if (offset === -1) {
        x = xStep1;
        y = 6;
        z = 25;
        scale = sideScale1;
        rotateY = -26;
        opacity = 0.85;
        zIndex = 20;
      } else if (offset === 2) {
        x = -xStep2;
        y = 16;
        z = -75;
        scale = sideScale2;
        rotateY = 38;
        opacity = isMobile ? 0 : 0.48;
        zIndex = 10;
        isVisible = !isMobile;
      } else if (offset === -2) {
        x = xStep2;
        y = 16;
        z = -75;
        scale = sideScale2;
        rotateY = -38;
        opacity = isMobile ? 0 : 0.48;
        zIndex = 10;
        isVisible = !isMobile;
      } else {
        x = offset > 0 ? -600 : 600;
        y = 24;
        z = -150;
        scale = 0.55;
        rotateY = offset > 0 ? 50 : -50;
        opacity = 0;
        zIndex = 0;
        isVisible = false;
      }

      return {
        ...book,
        index,
        offset,
        isCenter,
        isVisible,
        motionConfig: {
          x,
          y,
          z,
          scale,
          rotateY,
          opacity,
          zIndex,
        },
      };
    });
  }, [books, activeIndex, isMobile, windowWidth]);

  // Navigation handlers
  const handleStartNow = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return {
    books,
    isLoading,
    error,
    retry,
    refreshAfterImageError,
    animatedBooks,
    activeIndex,
    currentBook,
    isFlipped,
    nextBook,
    prevBook,
    selectBook,
    handleSelectBook,
    toggleFlip,
    handleDragEnd,
    handleStartNow,
  };
}

export default useHero;
