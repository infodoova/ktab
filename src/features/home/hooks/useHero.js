import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FAKE_HERO_BOOKS as HERO_BOOKS } from "@/fakedataorassets/testData";
import { useVoiceSampleStore } from "./useVoiceSampleStore";

/**
 * Custom hook containing all state, audio playback, and 3D positioning metrics for the Hero section.
 * Powers the 3D book carousel, first-page flip, and the animated Voice Sample Player Modal.
 */
export function useHero() {
  const navigate = useNavigate();
  const books = HERO_BOOKS;

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
    setIsFlipped(false);
    setActiveIndex((prev) => (prev + 1) % books.length);
  }, [books.length]);

  const prevBook = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  }, [books.length]);

  const selectBook = useCallback((index) => {
    setIsFlipped(false);
    setActiveIndex(index);
  }, []);

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

  // Voice Sample Modal controls (Delegated to centralized singleton store)
  const openVoiceModal = useCallback((book) => {
    const targetBook = book || currentBook;
    useVoiceSampleStore.getState().openSample(targetBook);
  }, [currentBook]);

  const closeVoiceModal = useCallback(() => {
    useVoiceSampleStore.getState().closeSample();
  }, []);

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
  }, [books, activeIndex, isFlipped, isMobile, windowWidth]);

  // Navigation handlers
  const handleStartNow = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return {
    books,
    animatedBooks,
    activeIndex,
    currentBook,
    isFlipped,
    nextBook,
    prevBook,
    selectBook,
    toggleFlip,
    handleDragEnd,
    // Voice Sample Modal Controls
    openVoiceModal,
    closeVoiceModal,
    handleStartNow,
  };
}

export default useHero;
