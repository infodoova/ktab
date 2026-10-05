import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getStoryPages } from "../constants/storyPagesData";
import { storyBooksService } from "../services/storyBooksService";
import {
  READER_BACKGROUNDS,
  DEFAULT_BACKGROUND_ID,
  getReaderBackground,
} from "../constants/readerBackgrounds";

/**
 * Custom hook managing the 3D Flipboard Reader with live backend story data:
 * - Dual-page horizontal 3D book on PC & iPad Landscape
 * - Fullscreen vertical Flipboard on Mobile & iPad Portrait
 * - Book closing 3D animation upon reaching the end
 * - Background gallery management with persistent selection
 * - Web Audio page-flip & book-close synthesis
 * - Zero mock data
 */
export function useFlipboardReader(storyId, initialStory = null) {
  const [story, setStory] = useState(initialStory);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
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

  // Fetch live storybook from backend
  useEffect(() => {
    let isMounted = true;
    async function loadStory() {
      setLoading(true);
      try {
        // Attempt 1: Fetch Reader Manifest (returns pages with signed presigned URLs)
        const manifestRes = await storyBooksService.getStoryBookReader(storyId);
        if (manifestRes?.success && manifestRes.data && isMounted) {
          const manifest = manifestRes.data;
          setStory({
            id: manifest.bookId,
            title: manifest.titleAr,
            titleAr: manifest.titleAr,
            pages: manifest.pages,
            cover: manifest.pages?.[0]?.imageUrl || null,
          });
          return;
        }

        // Attempt 2: Fallback to storybook detail
        const detailRes = await storyBooksService.getStoryBook(storyId);
        if (detailRes?.success && detailRes.data && isMounted) {
          const detail = detailRes.data;
          setStory({
            id: detail.id,
            title: detail.titleAr,
            titleAr: detail.titleAr,
            childName: detail.childNameAr,
            pages: detail.pages,
            status: detail.status,
            cover: detail.pages?.[0]?.imageUrl || null,
          });
          return;
        }

        // Attempt 3: Initial story if provided
        if (initialStory && isMounted) {
          setStory(initialStory);
        }
      } catch {
        if (initialStory && isMounted) {
          setStory(initialStory);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (storyId) {
      loadStory();
    } else if (initialStory) {
      setStory(initialStory);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, [storyId, initialStory]);

  // Generate pages content dynamically
  const pages = useMemo(() => {
    return getStoryPages(story);
  }, [story]);

  const totalPages = pages.length;

  // Preload book cover and story pages in background
  useEffect(() => {
    if (typeof window === "undefined" || !pages || pages.length === 0) return;

    pages.forEach((p) => {
      if (p?.image) {
        const img = new Image();
        img.src = p.image;
      }
    });
  }, [pages]);

  // Responsive Dual-Page detection
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

  // Web Audio page-flip synthesis
  const playFlipSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.022));
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
      // Audio suppression fallback
    }
  }, []);

  // Web Audio hardcover book close thud
  const playCloseSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.038));
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
      // Audio suppression fallback
    }
  }, []);

  // 2 pages per screen on both desktop (dual spread) and mobile (stacked calendar)
  const step = 2;
  const maxPage = Math.floor(Math.max(0, totalPages - 1) / 2) * 2;
  const isAtLastPage = currentPage >= maxPage;

  const canGoNext = !isBookClosed && totalPages > 0;
  const canGoPrev = currentPage > 0 || isBookClosed;

  const goToNextPage = useCallback(() => {
    if (isFlipping || isBookClosed) return;

    if (isAtLastPage) {
      playCloseSound();
      setIsClosing(false);
      setIsBookClosed(true);
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

  const goToNextPageInstant = useCallback(() => {
    if (isAtLastPage) {
      playCloseSound();
      setIsClosing(false);
      setIsBookClosed(true);
      return;
    }

    playFlipSound();
    setCurrentPage((prev) => Math.min(prev + step, maxPage));
  }, [isAtLastPage, step, maxPage, playFlipSound, playCloseSound]);

  const goToPrevPageInstant = useCallback(() => {
    if (isBookClosed) {
      playFlipSound();
      setIsBookClosed(false);
      setIsClosing(false);
      return;
    }

    playFlipSound();
    setCurrentPage((prev) => Math.max(prev - step, 0));
  }, [isBookClosed, step, playFlipSound]);

  const restartStory = useCallback(() => {
    playFlipSound();
    setIsClosing(false);
    setIsBookClosed(false);
    setCurrentPage(0);
  }, [playFlipSound]);

  const goToPage = useCallback(
    (targetIndex) => {
      if (isFlipping || targetIndex === currentPage) return;
      setIsBookClosed(false);
      setIsClosing(false);
      const normalized = Math.floor(targetIndex / 2) * 2;
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

  // Keyboard navigation
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
        if (Math.abs(diffY) > 35 && Math.abs(diffY) > Math.abs(diffX)) {
          if (diffY < 0) goToNextPage();
          else goToPrevPage();
        }
      } else {
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) goToNextPage();
          else goToPrevPage();
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
    bookCoverImg: story?.cover || story?.coverUrl || "",
    bookTitle: story?.title || story?.titleAr || "حكاية ممتعة للأطفال",

    // Handlers
    goToNextPage,
    goToPrevPage,
    goToNextPageInstant,
    goToPrevPageInstant,
    isAtLastPage,
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
