import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useReaderPreferencesStore } from "@/core/store";
import {
  normalizeText,
  tokenize,
  paginate,
  normalizeArabicWord,
  findSnippetTokenRange,
} from "../utils/readerPaginationUtils";
import { useFlipBookDimensions } from "./useFlipBookDimensions";
import { useFlipBookGestures } from "./useFlipBookGestures";
import { useFlipBookImperativeApi } from "./useFlipBookImperativeApi";

// Re-export utility algorithms for 100% backward compatibility
export {
  normalizeText,
  tokenize,
  paginate,
  normalizeArabicWord,
  findSnippetTokenRange,
};

/**
 * Master hook for FlipBook single-page presentation, coordinating responsive
 * layout bounds, page turning physics, gesture listeners, and imperative APIs.
 *
 * @param {Object} props
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

  useEffect(() => {
    clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => {
      setDelayedReady(!loading);
    }, 0);
    return () => clearTimeout(delayRef.current);
  }, [loading]);

  const ready = !loading && delayedReady;

  // Responsive metrics and typography
  const {
    pageHeight,
    pageWidth,
    isMobile,
    dynamicFontSize,
    dynamicLineHeight,
    calculatedWordsPerPage,
  } = useFlipBookDimensions({
    fontSize,
    wordsPerPage,
  });

  // Smooth loading state when user switches flip modes
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

  // Tokenization & Pagination
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

  // Page Index and Transitions
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [transitionDir, setTransitionDir] = useState(null); // 'next' | 'prev' | null
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);
  const lastFlipTimeRef = useRef(0);

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

  const handlePageFlipFromEngine = useCallback(
    (pageNum) => {
      const targetIdx = Math.max(0, Math.min(pageNum - 1, totalPages - 1));
      setCurrentPageIndex(targetIdx);
      onPageChange?.(pageNum);
    },
    [totalPages, onPageChange]
  );

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

  // Gestural input controls (touch swiping, wheel, keyboard)
  const { handleTouchStart, handleTouchEnd } = useFlipBookGestures({
    containerRef,
    readOnly,
    onFlipNext: handleFlipNext,
    onFlipPrev: handleFlipPrev,
  });

  // Imperative bookRef bindings and citation highlights
  useFlipBookImperativeApi({
    bookRef,
    pages,
    tokens,
    normalizedText,
    totalPages,
    currentPageIndex,
    handleFlipNext,
    handleFlipPrev,
    goToPage,
  });

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
