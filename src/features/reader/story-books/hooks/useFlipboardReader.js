import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import { getStoryPages } from "../constants/storyPagesData";
import { storyBooksService } from "../services/storyBooksService";
import {
  READER_BACKGROUNDS,
  DEFAULT_BACKGROUND_ID,
  getReaderBackground,
} from "../constants/readerBackgrounds";

/**
 * Custom hook managing the 3D Flipboard Reader:
 * - Dual-page horizontal 3D book on PC & iPad Landscape
 * - Fullscreen vertical Flipboard on Mobile & iPad Portrait
 * - Book closing 3D animation upon reaching the end
 * - Background gallery management with persistent selection
 * - Web Audio page-flip & book-close synthesis
 * - Zero-flicker state tracking
 */
export function useFlipboardReader(storyId, initialStory = null) {
  const [story, setStory] = useState(initialStory);
  const [loading, setLoading] = useState(!initialStory);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null); // 'next' | 'prev' | null
  const [isBookClosed, setIsBookClosed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Background gallery state
  const [selectedBgId, setSelectedBgId] = useState(() => {
    try {
      return localStorage.getItem("ktab_storybook_bg") || DEFAULT_BACKGROUND_ID;
    } catch {
      return DEFAULT_BACKGROUND_ID;
    }
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Screen mode detection:
  // PC & iPad Landscape: width >= 1024 AND width > height
  // Mobile & iPad Portrait: width < 1024 OR height >= width
  const checkIsLandscapePC = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024 && window.innerWidth > window.innerHeight;
  }, []);

  const [isDualPage, setIsDualPage] = useState(checkIsLandscapePC);
  const isVerticalMode = !isDualPage;

  // Touch and drag refs
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const dragStartX = useRef(null);
  const dragStartY = useRef(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [dragDeltaY, setDragDeltaY] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const hasMovedSignificantly = useRef(false);
  const flipTimerRef = useRef(null);

  // Fetch story if not passed in state
  useEffect(() => {
    if (initialStory) {
      setStory(initialStory);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadStory() {
      setLoading(true);
      try {
        const res = await storyBooksService.getStoryBooks();
        if (res?.success && res.data && isMounted) {
          const found =
            res.data.find((s) => String(s.id) === String(storyId)) || res.data[0];
          setStory(found);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStory();
    return () => {
      isMounted = false;
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, [storyId, initialStory]);

  // Generate pages content
  const pages = useMemo(() => {
    return getStoryPages(story);
  }, [story]);

  const totalPages = pages.length;

  // Preload book cover and story pages in background to guarantee instant rendering
  useEffect(() => {
    if (typeof window === "undefined") return;

    const coverUrl = story?.cover || bunnyCover;
    if (coverUrl) {
      const coverImg = new Image();
      coverImg.src = coverUrl;
    }

    if (pages && Array.isArray(pages)) {
      pages.forEach((p) => {
        if (p?.image) {
          const img = new Image();
          img.src = p.image;
        }
      });
    }
  }, [story?.cover, pages]);

  // Responsive Dual-Page detection (Desktop / wide landscape tablet vs Portrait/Mobile)
  useEffect(() => {
    function handleResize() {
      const isLandscapePC = checkIsLandscapePC();
      setIsDualPage((prevWide) => {
        if (prevWide !== isLandscapePC && isLandscapePC) {
          setCurrentPage((p) => Math.floor(p / 2) * 2);
        }
        return isLandscapePC;
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [checkIsLandscapePC]);

  // Web Audio Synthesis for authentic physical paper turn sound
  const playFlipSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.022));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1350;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.065, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.075);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // AudioContext policy suppression fallback
    }
  }, []);

  // Web Audio synthesis: realistic hardcover book close thud
  const playCloseSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.038));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 320;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // Audio policy suppression fallback
    }
  }, []);

  const maxPage = isDualPage
    ? Math.floor(Math.max(0, totalPages - 1) / 2) * 2
    : Math.max(0, totalPages - 1);

  const isAtLastPage = isDualPage
    ? currentPage >= maxPage
    : currentPage >= totalPages - 1;

  const canGoNext = !isBookClosed;
  const canGoPrev = currentPage > 0 || isBookClosed;
  const step = isDualPage ? 2 : 1;

  // Navigate to Next Page (or Trigger Book Closing if on last page)
  const goToNextPage = useCallback(() => {
    if (isFlipping || isBookClosed) return;

    if (isAtLastPage) {
      playCloseSound();
      setIsClosing(true);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => {
        setIsBookClosed(true);
        setIsClosing(false);
      }, 650);
      return;
    }

    playFlipSound();
    setIsFlipping(true);
    setFlipDirection("next");

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + step, maxPage));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 700);
  }, [isFlipping, isBookClosed, isAtLastPage, step, maxPage, playFlipSound, playCloseSound]);

  // Navigate to Previous Page (or Reopen Book if closed)
  const goToPrevPage = useCallback(() => {
    if (isFlipping) return;

    if (isBookClosed) {
      playFlipSound();
      setIsBookClosed(false);
      setIsClosing(false);
      return;
    }

    if (!canGoPrev) return;

    playFlipSound();
    setIsFlipping(true);
    setFlipDirection("prev");

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - step, 0));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 700);
  }, [isFlipping, isBookClosed, canGoPrev, step, playFlipSound]);

  // Restart Story from beginning (Page 1)
  const restartStory = useCallback(() => {
    playFlipSound();
    setIsClosing(false);
    setIsBookClosed(false);
    setCurrentPage(0);
  }, [playFlipSound]);

  // Direct Page Jump
  const goToPage = useCallback(
    (targetIndex) => {
      if (isFlipping || targetIndex === currentPage) return;
      setIsBookClosed(false);
      setIsClosing(false);
      const normalized = isDualPage
        ? Math.floor(targetIndex / 2) * 2
        : targetIndex;
      const clamped = Math.max(0, Math.min(normalized, maxPage));
      playFlipSound();
      setIsFlipping(true);
      setFlipDirection(clamped > currentPage ? "next" : "prev");

      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => {
        setCurrentPage(clamped);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 450);
    },
    [isFlipping, currentPage, isDualPage, maxPage, playFlipSound]
  );

  // Background gallery handlers
  const selectBackground = useCallback((id) => {
    setSelectedBgId(id);
    try {
      localStorage.setItem("ktab_storybook_bg", id);
    } catch {}
  }, []);

  const selectNextBackground = useCallback(() => {
    setSelectedBgId((prevId) => {
      const currentIndex = READER_BACKGROUNDS.findIndex((b) => b.id === prevId);
      const nextIndex = (currentIndex + 1) % READER_BACKGROUNDS.length;
      const nextId = READER_BACKGROUNDS[nextIndex].id;
      try {
        localStorage.setItem("ktab_storybook_bg", nextId);
      } catch {}
      return nextId;
    });
  }, []);

  const toggleGallery = useCallback(() => {
    setIsGalleryOpen((prev) => !prev);
  }, []);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const selectedBg = useMemo(() => {
    return getReaderBackground(selectedBgId);
  }, [selectedBgId]);

  // Keyboard navigation (RTL & Vertical aware)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        e.preventDefault();
        goToNextPage();
      } else if (
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === "Escape") {
        setIsGalleryOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // Touch Gesture Handlers
  const handleTouchStart = useCallback((e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX.current;
      const diffY = touchEndY - touchStartY.current;

      touchStartX.current = null;
      touchStartY.current = null;

      if (isVerticalMode) {
        // Vertical flip on mobile & iPad portrait:
        // Swipe UP (diffY < -35) -> next page
        // Swipe DOWN (diffY > 35) -> prev page
        if (Math.abs(diffY) > 35 && Math.abs(diffY) > Math.abs(diffX)) {
          if (diffY < 0) {
            goToNextPage();
          } else {
            goToPrevPage();
          }
        }
      } else {
        // Horizontal flip on PC & iPad landscape:
        // Swipe Left (diffX < -40) -> next page (in RTL)
        // Swipe Right (diffX > 40) -> prev page
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            goToNextPage();
          } else {
            goToPrevPage();
          }
        }
      }
    },
    [isVerticalMode, goToNextPage, goToPrevPage]
  );

  // Mouse Drag Handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    setIsPointerDown(true);
    hasMovedSignificantly.current = false;
    setDragDeltaX(0);
    setDragDeltaY(0);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPointerDown || dragStartX.current === null) return;
      const deltaX = e.clientX - dragStartX.current;
      const deltaY = e.clientY - dragStartY.current;

      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        hasMovedSignificantly.current = true;
      }
      setDragDeltaX(deltaX);
      setDragDeltaY(deltaY);
    },
    [isPointerDown]
  );

  const handleMouseUp = useCallback(
    (e) => {
      if (!isPointerDown) return;
      const startX = dragStartX.current;
      const startY = dragStartY.current;
      const deltaX = e.clientX - (startX ?? e.clientX);
      const deltaY = e.clientY - (startY ?? e.clientY);

      dragStartX.current = null;
      dragStartY.current = null;
      setIsPointerDown(false);
      setDragDeltaX(0);
      setDragDeltaY(0);

      if (hasMovedSignificantly.current) {
        if (isVerticalMode) {
          if (Math.abs(deltaY) > 40) {
            if (deltaY < 0) goToNextPage();
            else goToPrevPage();
          }
        } else {
          if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) goToNextPage();
            else goToPrevPage();
          }
        }
      }
    },
    [isPointerDown, isVerticalMode, goToNextPage, goToPrevPage]
  );

  const handleMouseLeave = useCallback(() => {
    if (isPointerDown) {
      dragStartX.current = null;
      dragStartY.current = null;
      setIsPointerDown(false);
      setDragDeltaX(0);
      setDragDeltaY(0);
    }
  }, [isPointerDown]);

  return {
    story,
    loading,
    pages,
    currentPage,
    totalPages,
    isFlipping,
    flipDirection,
    isDualPage,
    isVerticalMode,
    canGoNext,
    canGoPrev,
    isPointerDown,
    dragDeltaX,
    dragDeltaY,

    // Backgrounds
    availableBackgrounds: READER_BACKGROUNDS,
    selectedBgId,
    selectedBg,
    isGalleryOpen,
    selectBackground,
    selectNextBackground,
    toggleGallery,
    closeGallery,

    // Closed Book State
    isBookClosed,
    isClosing,
    restartStory,
    bookCoverImg: story?.cover || bunnyCover,
    bookTitle: story?.title || "حكاية ممتعة للأطفال",

    // Handlers
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}

export default useFlipboardReader;
