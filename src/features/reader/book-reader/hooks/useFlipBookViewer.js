import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useReaderPreferencesStore } from "@/core/store";

/**
 * Normalizes input text by removing null/undefined stringified artifacts and standardizing line breaks.
 */
export function normalizeText(raw = "") {
  if (!raw) return "";
  const cleaned = String(raw).replace(/\b(null|undefined)\b/gi, "").trim();
  return cleaned
    .normalize("NFC")
    .replace(/\u00A0/g, " ")
    .replace(/\r\n|\r/g, "\n");
}

/**
 * Tokenizes text into individual words with exact character offset boundaries.
 */
export function tokenize(text) {
  const tokens = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    tokens.push({
      value: m[0],
      startChar: m.index,
      endChar: m.index + m[0].length - 1,
    });
  }
  return tokens;
}

/**
 * Splits token list into page segments based on words-per-page target.
 */
export function paginate(tokens, wordsPerPageArray) {
  const pages = [];
  let currentIndex = 0;

  if (typeof wordsPerPageArray === "number") {
    while (currentIndex < tokens.length) {
      const endWord = Math.min(currentIndex + wordsPerPageArray, tokens.length);
      pages.push({
        startWord: currentIndex,
        endWord: endWord,
        wordCount: endWord - currentIndex,
      });
      currentIndex = endWord;
    }
  } else if (Array.isArray(wordsPerPageArray)) {
    for (let i = 0; i < wordsPerPageArray.length && currentIndex < tokens.length; i++) {
      const wordsInThisPage = wordsPerPageArray[i];
      const endWord = Math.min(currentIndex + wordsInThisPage, tokens.length);
      pages.push({
        startWord: currentIndex,
        endWord: endWord,
        wordCount: endWord - currentIndex,
      });
      currentIndex = endWord;
    }

    if (currentIndex < tokens.length && wordsPerPageArray.length > 0) {
      const lastWordsPerPage = wordsPerPageArray[wordsPerPageArray.length - 1];
      while (currentIndex < tokens.length) {
        const endWord = Math.min(currentIndex + lastWordsPerPage, tokens.length);
        pages.push({
          startWord: currentIndex,
          endWord: endWord,
          wordCount: endWord - currentIndex,
        });
        currentIndex = endWord;
      }
    }
  }

  return pages;
}

/**
 * Custom hook managing single-page reader presentation, responsive page calculations,
 * smooth Kindle/Eleven Reader page shift animations, touch swipes, and TTS synchronization.
 */
export function useFlipBookViewer({
  bookRef,
  text = "",
  loading = false,
  fontSize = 18,
  wordsPerPage = 110,
  theme = "pure-white",
  transitionMode: propTransitionMode,
  onPageChange,
  onPagesGenerated,
  readOnly = false,
  bookTitle = "",
  bookAuthor = "",
  onBack,
}) {
  const storeTransitionMode = useReaderPreferencesStore((s) => s.transitionMode);
  const transitionMode = propTransitionMode || storeTransitionMode || "curl";
  const curlRef = useRef(null);

  const containerRef = useRef(null);
  const [delayedReady, setDelayedReady] = useState(false);
  const delayRef = useRef(null);

  // Viewport dimensions
  const getViewportDimensions = useCallback(() => {
    if (typeof window === "undefined") return { width: 390, height: 844 };
    const width = document.documentElement.clientWidth || window.innerWidth;
    const height =
      window.visualViewport?.height ||
      document.documentElement.clientHeight ||
      window.innerHeight;
    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }, []);

  const [windowDimensions, setWindowDimensions] = useState(getViewportDimensions);

  useEffect(() => {
    let rafId = null;

    function handleResize() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setWindowDimensions(getViewportDimensions());
      });
    }

    function handleOrientation() {
      handleResize();
      // On iOS Safari, viewport metrics settle 100-300ms after physical rotation
      setTimeout(handleResize, 120);
      setTimeout(handleResize, 300);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleOrientation);
      window.visualViewport?.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleOrientation);
        window.visualViewport?.removeEventListener("resize", handleResize);
      }
    };
  }, [getViewportDimensions]);

  useEffect(() => {
    clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => {
      setDelayedReady(!loading);
    }, 0);
    return () => clearTimeout(delayRef.current);
  }, [loading]);

  const ready = !loading && delayedReady;
  const { width: vw, height: vh } = windowDimensions;

  const isTouchDevice = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
    );
  }, []);

  const isMobile = vw < 768;

  // Identify iPads and all tablets in both portrait and landscape orientation, including HTML5 fullscreen
  const isIPadOrTablet = useMemo(() => {
    if (typeof window === "undefined") return false;
    const isAppleTablet =
      /iPad|Tablet|PlayBook/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const minDim = Math.min(vw, vh);
    const maxDim = Math.max(vw, vh);

    // Standard & Pro iPads (Mini 768x1024, 10.2" 810x1080, Air 834x1194, Pro 12.9" 1024x1366)
    const hasTabletDimensions =
      minDim >= 600 && minDim <= 1100 && maxDim >= 900 && maxDim <= 1450;

    return (
      isAppleTablet ||
      hasTabletDimensions ||
      (isTouchDevice && vw >= 768 && vw <= 1366) ||
      (isTouchDevice && minDim >= 600 && minDim <= 1100)
    );
  }, [vw, vh, isTouchDevice]);

  // Fullscreen edge-to-edge layout for all mobile phones, iPads, and tablets (portrait & landscape)
  const isMobileOrTablet = isMobile || isIPadOrTablet || (vw <= 1366 && isTouchDevice);
  const isDesktop = !isMobileOrTablet && vw > 1366;

  // Single-page height & width: Fullscreen edge-to-edge on mobile, iPads, & tablets; elegant wide card on PC
  const pageHeight = useMemo(() => {
    if (isMobileOrTablet) {
      return vh;
    }
    return Math.floor(Math.min(vh * 0.94, vh - 32));
  }, [isMobileOrTablet, vh]);

  const pageWidth = useMemo(() => {
    if (isMobileOrTablet) {
      return vw;
    }
    // PC / Desktop (> 1366px): Wider editorial card style
    const proportionalWidth = Math.floor(pageHeight * 0.78);
    return Math.floor(Math.min(vw * 0.58, proportionalWidth, 860));
  }, [isMobileOrTablet, vw, pageHeight]);

  // Enhanced font size and line height calibrated for comfortable reading density on iPad & mobile
  const effectiveFontSize = useMemo(() => {
    const base = Math.min(28, Math.max(14, fontSize));
    if (isIPadOrTablet) {
      // Scale font comfortably for iPad Retina display across windowed and fullscreen modes
      return Math.round(base * 1.28);
    }
    if (isDesktop) return Math.max(base, 19);
    return base;
  }, [fontSize, isIPadOrTablet, isDesktop]);

  const dynamicFontSize = `${effectiveFontSize}px`;
  const dynamicLineHeight = isIPadOrTablet ? "1.86" : (isMobile ? "1.75" : "1.88");

  // Consistent 110 words (~650 chars) across standard mobile/desktop; doubled to 220 words (~1,300 chars) on iPads/tablets
  const BASE_WORDS_PER_PAGE = wordsPerPage || 110;

  const calculatedWordsPerPage = useMemo(() => {
    if (isIPadOrTablet) {
      return BASE_WORDS_PER_PAGE * 2; // 220 words
    }
    return BASE_WORDS_PER_PAGE; // 110 words
  }, [isIPadOrTablet, BASE_WORDS_PER_PAGE]);

  // Smooth loading state when user switches flip modes to prevent UI hitching
  const [isModeSwitching, setIsModeSwitching] = useState(false);
  const prevModeRef = useRef(transitionMode);

  useEffect(() => {
    if (prevModeRef.current !== transitionMode) {
      prevModeRef.current = transitionMode;
      setIsModeSwitching(true);
      const timer = setTimeout(() => {
        setIsModeSwitching(false);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [transitionMode]);

  const normalizedText = useMemo(() => normalizeText(text), [text]);
  const tokens = useMemo(() => tokenize(normalizedText), [normalizedText]);
  const pages = useMemo(() => {
    const contentPages = paginate(tokens, calculatedWordsPerPage);
    if (contentPages.length > 0) {
      return [
        ...contentPages,
        {
          isEndPage: true,
          startWord: tokens.length,
          endWord: tokens.length,
          wordCount: 0,
        },
      ];
    }
    return contentPages;
  }, [tokens, calculatedWordsPerPage]);
  const totalPages = pages.length;

  // Single Page Index (0-indexed)
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [transitionDir, setTransitionDir] = useState(null); // 'next' | 'prev' | null
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  // Notify parent of generated page structure
  useEffect(() => {
    if (onPagesGenerated && pages.length > 0) {
      const pageInfo = pages.map((page, index) => ({
        pageNumber: index + 1,
        startWord: page.startWord,
        endWord: page.endWord,
        wordCount: page.wordCount,
        startChar: tokens[page.startWord]?.startChar ?? 0,
        endChar: tokens[page.endWord - 1]?.endChar ?? 0,
        isEndPage: Boolean(page.isEndPage),
      }));
      onPagesGenerated(pageInfo);
    }
  }, [pages, tokens, onPagesGenerated]);

  const transitionDuration = useMemo(() => {
    if (transitionMode === "curl") return 440;
    if (transitionMode === "flip3d") return 300;
    return 220;
  }, [transitionMode]);

  /* ==========================================================================
     PAGE TURNS (CURL, 3D FLIP, & KINDLE SLIDE)
     ========================================================================== */
  const handlePageFlipFromEngine = useCallback((pageNum) => {
    const targetIdx = Math.max(0, Math.min(pageNum - 1, totalPages - 1));
    setCurrentPageIndex(targetIdx);
    onPageChange?.(pageNum);
  }, [totalPages, onPageChange]);

  const handleCurlTurnNext = useCallback(() => {
    if (currentPageIndex >= totalPages - 1) return;
    const nextIdx = currentPageIndex + 1;
    setCurrentPageIndex(nextIdx);
    onPageChange?.(nextIdx + 1);
  }, [currentPageIndex, totalPages, onPageChange]);

  const handleCurlTurnPrev = useCallback(() => {
    if (currentPageIndex <= 0) return;
    const prevIdx = currentPageIndex - 1;
    setCurrentPageIndex(prevIdx);
    onPageChange?.(prevIdx + 1);
  }, [currentPageIndex, onPageChange]);

  const lastFlipTimeRef = useRef(0);

  const handleFlipNext = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipTimeRef.current < 450) return;
    lastFlipTimeRef.current = now;

    if (currentPageIndex >= totalPages - 1) return;
    if (transitionMode === "curl" && curlRef.current?.triggerCurlNext) {
      curlRef.current.triggerCurlNext();
      return;
    }
    if (isTransitioning) return;

    const nextIdx = currentPageIndex + 1;

    clearTimeout(transitionTimeoutRef.current);
    setTransitionDir("next");
    setIsTransitioning(true);
    setCurrentPageIndex(nextIdx);
    onPageChange?.(nextIdx + 1);

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionDir(null);
    }, transitionDuration);
  }, [
    currentPageIndex,
    totalPages,
    transitionMode,
    isTransitioning,
    transitionDuration,
    onPageChange,
  ]);

  const handleFlipPrev = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipTimeRef.current < 450) return;
    lastFlipTimeRef.current = now;

    if (currentPageIndex <= 0) return;
    if (transitionMode === "curl" && curlRef.current?.triggerCurlPrev) {
      curlRef.current.triggerCurlPrev();
      return;
    }
    if (isTransitioning) return;

    const prevIdx = currentPageIndex - 1;

    clearTimeout(transitionTimeoutRef.current);
    setTransitionDir("prev");
    setIsTransitioning(true);
    setCurrentPageIndex(prevIdx);
    onPageChange?.(prevIdx + 1);

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionDir(null);
    }, transitionDuration);
  }, [
    currentPageIndex,
    transitionMode,
    isTransitioning,
    transitionDuration,
    onPageChange,
  ]);

  const goToPage = useCallback(
    (targetPage, force = false) => {
      const now = Date.now();
      if (!force && now - lastFlipTimeRef.current < 450) return;
      lastFlipTimeRef.current = now;

      const p = Math.min(Math.max(1, targetPage), totalPages);
      const targetIdx = p - 1;
      if (targetIdx === currentPageIndex) return;

      clearTimeout(transitionTimeoutRef.current);
      setTransitionDir(targetIdx > currentPageIndex ? "next" : "prev");
      setIsTransitioning(true);
      setCurrentPageIndex(targetIdx);
      onPageChange?.(p);

      if (transitionMode === "curl" && curlRef.current?.goToPage) {
        curlRef.current.goToPage(p);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDir(null);
      }, transitionDuration);
    },
    [currentPageIndex, totalPages, transitionMode, transitionDuration, onPageChange]
  );

  /* ==========================================================================
     TOUCH & POINTER SWIPE GESTURE DETECTION (MOBILE & TABLET)
     Universal full-screen swiping with natural sensitivity & edge tap support
     ========================================================================== */
  const touchDataRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    active: false,
  });

  const handleTouchStart = useCallback(
    (e) => {
      if (readOnly) return;
      // Only ignore touches on explicit control buttons or open popovers
      if (
        e.target.closest(
          ".ktab-flip-edge-trigger, .ktab-glass-circle-btn, .ktab-reader-mode-hide-btn, .ktab-glass-popover, .ktab-reader-pc-drawer, input, textarea, select, [role='dialog']"
        )
      ) {
        return;
      }
      const t = e.touches[0];
      if (!t) return;

      touchDataRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        startTime: Date.now(),
        active: true,
      };
    },
    [readOnly]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      const data = touchDataRef.current;
      if (!data.active) return;
      data.active = false;

      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - data.startX;
      const dy = t.clientY - data.startY;
      const dt = Math.max(1, Date.now() - data.startTime);
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const velocityX = absDx / dt;
      const velocityY = absDy / dt;

      // 1. Universal Gestural Swiping (Swipe anywhere on screen)
      if (absDx > absDy && (absDx > 20 || velocityX > 0.16)) {
        if (dx < 0) {
          handleFlipNext();
        } else {
          handleFlipPrev();
        }
        return;
      }

      if (absDy >= absDx && (absDy > 20 || velocityY > 0.16)) {
        if (dy < 0) {
          handleFlipNext();
        } else {
          handleFlipPrev();
        }
        return;
      }

      // 2. Quick Tap on screen edges (< 320ms and < 15px movement)
      if (absDx < 15 && absDy < 15 && dt < 320) {
        const clientX = t.clientX;
        const clientY = t.clientY;
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        // Max Right (Right 35%) -> Next Page
        if (clientX > windowW * 0.65) {
          handleFlipNext();
          return;
        }

        // Max Left (Left 35%) -> Previous Page
        if (clientX < windowW * 0.35) {
          handleFlipPrev();
          return;
        }

        // Max Down/Bottom (Bottom 20%) -> Next Page
        if (clientY > windowH * 0.80) {
          handleFlipNext();
          return;
        }

        // Max Top (Top 20%) -> Previous Page
        if (clientY < windowH * 0.20) {
          handleFlipPrev();
          return;
        }
      }
    },
    [handleFlipNext, handleFlipPrev]
  );

  /* ==========================================================================
     IMPERATIVE bookRef BINDINGS FOR TTS & CONTROLS
     ========================================================================== */
  useEffect(() => {
    if (!bookRef) return;
    bookRef.current = bookRef.current || {};

    bookRef.current.nextPage = handleFlipNext;
    bookRef.current.prevPage = handleFlipPrev;
    bookRef.current.goToPage = goToPage;
    bookRef.current.totalPages = totalPages;
    bookRef.current.totalWords = tokens.length;
    bookRef.current.totalChars = normalizedText.length;

    bookRef.current.getCurrentPageNumber = () => currentPageIndex + 1;

    // Backward compatibility wrapper for callers referencing pageFlip()
    bookRef.current.pageFlip = () => ({
      flipNext: handleFlipNext,
      flipPrev: handleFlipPrev,
      flip: (pageNum) => goToPage(pageNum + 1),
      getCurrentPageIndex: () => currentPageIndex,
      getPageCount: () => totalPages,
    });

    bookRef.current.getWordRangeForPage = (page) => {
      const p = Math.min(Math.max(1, page), totalPages);
      const def = pages[p - 1];
      if (!def) return null;
      const firstToken = tokens[def.startWord];
      return {
        page: p,
        startWord: def.startWord,
        endWord: def.endWord,
        wordCount: def.wordCount,
        startChar: firstToken ? firstToken.startChar : 0,
      };
    };

    const pageCharRanges = pages.map((p, i) => {
      const first = tokens[p.startWord];
      const last = tokens[p.endWord - 1];
      return {
        page: i + 1,
        start: first?.startChar ?? 0,
        end: last?.endChar ?? 0,
      };
    });

    bookRef.current.getPageForChar = (charIndex) => {
      for (const r of pageCharRanges) {
        if (charIndex >= r.start && charIndex <= r.end) return r.page;
      }
      return null;
    };

    bookRef.current.highlightWordByIndex = (wordIndex) => {
      bookRef.current.clearAllHighlights?.();
      const el = document.querySelector(`[data-word-index="${wordIndex}"]`);
      if (el) el.classList.add("tts-active-word");
    };

    bookRef.current.clearAllHighlights = () => {
      document.querySelectorAll(".tts-active-word").forEach((el) => {
        el.classList.remove("tts-active-word");
      });
    };

    bookRef.current.getTokenByIndex = (wordIndex) => tokens[wordIndex] || null;

    /**
     * Searches for a verbatim text snippet across the book's full content, locates
     * which dynamic reader page it falls on, navigates to it, and highlights the passage.
     *
     * @param {string} snippet
     * @returns {number|null} Target page number if resolved, null otherwise
     */
    bookRef.current.findAndHighlightSnippet = (snippet) => {
      if (!snippet || typeof snippet !== "string" || !normalizedText) return null;

      const cleanSnippet = snippet.trim();
      if (!cleanSnippet) return null;

      // 1. Direct substring search in normalized text
      let matchCharIndex = normalizedText.indexOf(cleanSnippet);

      // 2. Arabic diacritics/orthography tolerant fallback search
      if (matchCharIndex === -1) {
        const normalizeAr = (s) =>
          s
            .replace(/[\u064B-\u065F\u0670]/g, "")
            .replace(/[إأآا]/g, "ا")
            .replace(/[ىي]/g, "ي")
            .replace(/ة/g, "ه")
            .replace(/[^\w\s\u0600-\u06FF]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const normBook = normalizeAr(normalizedText);
        const normTarget = normalizeAr(cleanSnippet);
        const normIndex = normBook.indexOf(normTarget);

        if (normIndex !== -1) {
          const ratio = normIndex / normBook.length;
          matchCharIndex = Math.floor(ratio * normalizedText.length);
        }
      }

      if (matchCharIndex === -1) return null;

      const targetPage = bookRef.current.getPageForChar(matchCharIndex);
      if (!targetPage) return null;

      // Programmatically flip to the resolved dynamic page without debounce delay
      goToPage(targetPage, true);

      // Highlight the matched tokens on the page once rendered
      const applyHighlights = () => {
        const matchEndChar = matchCharIndex + cleanSnippet.length;
        const matchedTokens = [];

        tokens.forEach((t, idx) => {
          if (t.endChar >= matchCharIndex && t.startChar <= matchEndChar) {
            matchedTokens.push(idx);
          }
        });

        matchedTokens.forEach((wordIdx) => {
          const el = document.querySelector(`[data-word-index="${wordIdx}"]`);
          if (el) {
            el.classList.add("talk-to-book-citation-highlight");
          }
        });

        if (matchedTokens.length > 0) {
          const firstEl = document.querySelector(`[data-word-index="${matchedTokens[0]}"]`);
          if (firstEl) {
            firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      };

      setTimeout(() => {
        bookRef.current.clearSnippetHighlights?.();
        applyHighlights();
      }, 350);

      // Redundant secondary check after flip animation concludes
      setTimeout(applyHighlights, 750);

      return targetPage;
    };

    bookRef.current.clearSnippetHighlights = () => {
      document.querySelectorAll(".talk-to-book-citation-highlight").forEach((el) => {
        el.classList.remove("talk-to-book-citation-highlight");
      });
    };
  }, [
    bookRef,
    pages,
    tokens,
    normalizedText,
    totalPages,
    currentPageIndex,
    handleFlipNext,
    handleFlipPrev,
    goToPage,
  ]);

  // Mouse wheel pagination listener
  const lastWheelTimeRef = useRef(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 350) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 20) return;

      e.preventDefault();
      lastWheelTimeRef.current = now;

      if (e.deltaY > 0) {
        handleFlipNext();
      } else {
        handleFlipPrev();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [handleFlipNext, handleFlipPrev]);

  // Comprehensive Keyboard navigation (Arrows, PageUp/Down, Space)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (readOnly) return;
      if (e.target.closest("input, textarea, select, [contenteditable='true']")) return;

      switch (e.key) {
        // Next page triggers: Right arrow (RTL Next), Down arrow, PageDown, Space
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          handleFlipNext();
          break;

        // Previous page triggers: Left arrow (RTL Prev), Up arrow, PageUp
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          handleFlipPrev();
          break;

        case " ":
          e.preventDefault();
          if (e.shiftKey) {
            handleFlipPrev();
          } else {
            handleFlipNext();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [readOnly, handleFlipNext, handleFlipPrev]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(transitionTimeoutRef.current);
  }, []);

  return {
    containerRef,
    ready,
    loading,
    isModeSwitching,
    pages,
    tokens,
    totalPages,
    currentPageIndex,
    transitionDir,
    isTransitioning,
    pageWidth,
    pageHeight,
    isMobile,
    theme,
    readOnly,
    dynamicFontSize,
    dynamicLineHeight,
    goToPage,
    handleFlipPrev,
    handleFlipNext,
    handleTouchStart,
    handleTouchEnd,
    onPageChange,
    transitionMode,
    curlRef,
    handlePageFlipFromEngine,
    handleCurlTurnNext,
    handleCurlTurnPrev,
    bookTitle,
    bookAuthor,
    onBack,
  };
}

export default useFlipBookViewer;
