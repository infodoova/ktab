import { useEffect, useMemo, useRef, useState, useCallback } from "react";

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
 * Custom hook encapsulating all business logic, pagination calculations,
 * viewport dimension adaptations, imperative bookRef methods, wheel navigation,
 * and mobile touch gestures for FlipBookViewer.
 */
export function useFlipBookViewer({
  bookRef,
  text = "",
  loading = false,
  fontSize = 18,
  wordsPerPage = 110,
  theme = "pure-white",
  onPageChange,
  onPagesGenerated,
  readOnly = false,
}) {
  const containerRef = useRef(null);
  const flipRef = useRef(null);

  const [delayedReady, setDelayedReady] = useState(false);
  const delayRef = useRef(null);

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
    function handleResize() {
      setWindowDimensions(getViewportDimensions());
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      window.visualViewport?.addEventListener("resize", handleResize);
      window.visualViewport?.addEventListener("scroll", handleResize);
      handleResize();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("scroll", handleResize);
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
  const isMobile = vw < 768;

  const pageHeight = useMemo(() => {
    if (isMobile) {
      return vh;
    }
    return Math.floor(Math.min(vh * 0.95, vh - 24));
  }, [isMobile, vh]);

  const pageWidth = useMemo(() => {
    if (isMobile) {
      return vw;
    }
    const proportionalWidth = Math.floor(pageHeight * 0.72);
    return Math.floor(Math.min(vw * 0.88, proportionalWidth, 840));
  }, [isMobile, vw, pageHeight]);

  const safeFontSize = Math.min(22, Math.max(14, fontSize));
  const dynamicFontSize = `${safeFontSize}px`;
  const dynamicLineHeight = isMobile ? "1.65" : "1.85";

  const calculatedWordsPerPage = useMemo(() => {
    const lineH = isMobile ? 1.65 : 1.85;
    const pixelsPerLine = safeFontSize * lineH;
    const paddingY = isMobile ? 140 : 150;
    const availableHeight = Math.max(100, pageHeight - paddingY);
    const linesThatFit = Math.floor(availableHeight / pixelsPerLine);
    const paddingX = isMobile ? 52 : 90;
    const availableWidth = Math.max(100, pageWidth - paddingX);
    const wordsPerLine = Math.floor(availableWidth / (safeFontSize * 0.95));

    const safetyLimit = Math.floor(linesThatFit * wordsPerLine * 0.65);
    const finalWords = Math.min(wordsPerPage, safetyLimit);

    return Math.max(12, finalWords);
  }, [safeFontSize, isMobile, pageHeight, pageWidth, wordsPerPage]);

  const normalizedText = useMemo(() => normalizeText(text), [text]);
  const tokens = useMemo(() => tokenize(normalizedText), [normalizedText]);
  const pages = useMemo(
    () => paginate(tokens, calculatedWordsPerPage),
    [tokens, calculatedWordsPerPage]
  );
  const totalPages = pages.length;

  useEffect(() => {
    if (onPagesGenerated && pages.length > 0) {
      const pageInfo = pages.map((page, index) => ({
        pageNumber: index + 1,
        startWord: page.startWord,
        endWord: page.endWord,
        wordCount: page.wordCount,
        startChar: tokens[page.startWord]?.startChar ?? 0,
        endChar: tokens[page.endWord - 1]?.endChar ?? 0,
      }));
      onPagesGenerated(pageInfo);
    }
  }, [pages, tokens, onPagesGenerated]);

  const handleFlipPrev = useCallback(() => {
    const flip = flipRef.current?.pageFlip?.();
    if (!flip) return;
    if (flip.getState?.() === "flipping") return;

    try {
      flip.flipPrev();
    } catch {
      try {
        flip.turnToPrevPage?.();
      } catch {
        // Ignored
      }
    }
  }, []);

  const handleFlipNext = useCallback(() => {
    const flip = flipRef.current?.pageFlip?.();
    if (!flip) return;
    if (flip.getState?.() === "flipping") return;

    try {
      flip.flipNext();
    } catch {
      try {
        flip.turnToNextPage?.();
      } catch {
        // Ignored
      }
    }
  }, []);

  // Imperative bookRef binding for TTS audio sync and programmatic navigation
  useEffect(() => {
    if (!bookRef) return;
    bookRef.current = bookRef.current || {};

    bookRef.current.pageFlip = () => flipRef.current?.pageFlip?.();
    bookRef.current.nextPage = () => handleFlipNext();
    bookRef.current.prevPage = () => handleFlipPrev();
    bookRef.current.totalPages = totalPages;
    bookRef.current.totalWords = tokens.length;
    bookRef.current.totalChars = normalizedText.length;

    bookRef.current.getCurrentPageNumber = () => {
      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return 1;
      return (flip.getCurrentPageIndex?.() ?? 0) + 1;
    };

    bookRef.current.goToPage = (page) => {
      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return;
      const p = Math.min(Math.max(1, page), totalPages);
      flip.flip(p - 1);
    };

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
  }, [bookRef, pages, tokens, normalizedText, totalPages, handleFlipNext, handleFlipPrev]);

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

      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return;

      e.preventDefault();
      lastWheelTimeRef.current = now;

      if (e.deltaY > 0) {
        flip.flipNext();
      } else {
        flip.flipPrev();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Mobile Touch Swipe Gesture Detection (Left in RTL = Next; Right in RTL = Prev)
  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.1 && dt < 650) {
      if (dx < 0) {
        handleFlipNext();
      } else {
        handleFlipPrev();
      }
    }
  };

  return {
    containerRef,
    flipRef,
    ready,
    loading,
    pages,
    tokens,
    pageWidth,
    pageHeight,
    isMobile,
    theme,
    readOnly,
    dynamicFontSize,
    dynamicLineHeight,
    handleFlipPrev,
    handleFlipNext,
    handleTouchStart,
    handleTouchEnd,
    onPageChange,
  };
}

export default useFlipBookViewer;
