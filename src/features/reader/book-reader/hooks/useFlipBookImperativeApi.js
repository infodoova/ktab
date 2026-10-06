import { useRef, useEffect, useCallback } from "react";
import { findSnippetTokenRange } from "../utils/readerPaginationUtils";

/**
 * Attaches the imperative reader API methods onto `bookRef.current`
 * for TTS narration, citation snippet highlighting, and external controls.
 *
 * @param {Object} params
 * @param {React.RefObject} params.bookRef
 * @param {Array} params.pages
 * @param {Array} params.tokens
 * @param {string} params.normalizedText
 * @param {number} params.totalPages
 * @param {number} params.currentPageIndex
 * @param {Function} params.handleFlipNext
 * @param {Function} params.handleFlipPrev
 * @param {Function} params.goToPage
 */
export function useFlipBookImperativeApi({
  bookRef,
  pages = [],
  tokens = [],
  normalizedText = "",
  totalPages = 1,
  currentPageIndex = 0,
  handleFlipNext,
  handleFlipPrev,
  goToPage,
  pagesCacheRef = null,
  currentPageData = null,
  text = "",
  wordsPerPage = 80,
}) {
  const pendingSnippetRef = useRef(null);
  const highlightPollTimersRef = useRef([]);

  const clearHighlightPollTimers = useCallback(() => {
    highlightPollTimersRef.current.forEach((id) => clearTimeout(id));
    highlightPollTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearHighlightPollTimers();
    };
  }, [clearHighlightPollTimers]);

  // Execute queued citation snippet navigation as soon as pagination completes
  useEffect(() => {
    if (pendingSnippetRef.current && pages.length > 0) {
      const snip = pendingSnippetRef.current;
      pendingSnippetRef.current = null;
      setTimeout(() => {
        bookRef?.current?.findAndHighlightSnippet?.(snip);
      }, 60);
    }
  }, [pages, bookRef]);

  useEffect(() => {
    if (!bookRef) return;
    bookRef.current = bookRef.current || {};

    bookRef.current.nextPage = handleFlipNext;
    bookRef.current.prevPage = handleFlipPrev;
    bookRef.current.goToPage = goToPage;
    bookRef.current.totalPages = totalPages;
    bookRef.current.totalWords = tokens?.length || (totalPages * (wordsPerPage || 80));
    bookRef.current.totalChars = normalizedText?.length || (totalPages * (wordsPerPage || 80) * 6);

    bookRef.current.getCurrentPageNumber = () => currentPageIndex + 1;

    bookRef.current.getCurrentPageText = () => {
      const def = pages[currentPageIndex];
      if (!def || def.isEndPage) return "";
      const pNum = currentPageIndex + 1;
      const cached = pagesCacheRef?.current?.[pNum];
      if (cached?.content) return cached.content;
      if (currentPageData?.content) return currentPageData.content;
      if (text) return text;
      return "";
    };

    bookRef.current.getPageText = (page) => {
      const p = Math.min(Math.max(1, page), totalPages);
      const cached = pagesCacheRef?.current?.[p];
      if (cached?.content) return cached.content;
      if (p === currentPageIndex + 1 && (currentPageData?.content || text)) {
        return currentPageData?.content || text;
      }
      return "";
    };

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
        startChar: firstToken ? firstToken.startChar : (p - 1) * (wordsPerPage || 80) * 6,
      };
    };

    const pageCharRanges = pages.map((p, i) => {
      const first = tokens[p.startWord];
      const last = tokens[p.endWord - 1];
      return {
        page: i + 1,
        start: first?.startChar ?? (i * (wordsPerPage || 80) * 6),
        end: last?.endChar ?? ((i + 1) * (wordsPerPage || 80) * 6),
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
     * Searches for a verbatim text snippet across the book's full content,
     * navigates to its dynamic page, and highlights the passage.
     *
     * @param {string} snippet
     * @returns {number|null} Target page number if resolved, null otherwise
     */
    bookRef.current.findAndHighlightSnippet = (
      snippet, locatedPage = null, locatedWordIndex = null, locatedEndWordIndex = null
    ) => {
      if (!snippet || typeof snippet !== "string") return null;
      const cleanSnippet = snippet.trim();
      if (!cleanSnippet) return null;

      // Server location uses global reader word indices. Local tokens cover only the loaded page.
      const matchRange = Number.isInteger(locatedWordIndex)
        ? null : findSnippetTokenRange(tokens, cleanSnippet);
      const pageNumber = locatedPage || currentPageIndex + 1;
      const pageWordOffset = (pageNumber - 1) * wordsPerPage;
      const startIndex = Number.isInteger(locatedWordIndex)
        ? locatedWordIndex
        : matchRange ? pageWordOffset + matchRange.startTokenIdx : null;
      if (startIndex == null) return null;
      const snippetWordCount = cleanSnippet.split(/\s+/).filter(Boolean).length;
      const endIndex = Math.min(
        pageWordOffset + wordsPerPage - 1,
        Number.isInteger(locatedEndWordIndex)
          ? locatedEndWordIndex
          : matchRange && !Number.isInteger(locatedWordIndex)
            ? pageWordOffset + matchRange.endTokenIdx
            : startIndex + snippetWordCount - 1
      );

      clearHighlightPollTimers();
      bookRef.current.clearSnippetHighlights?.();

      const applyHighlights = () => {
        let firstEl = null;
        for (let index = startIndex; index <= endIndex; index++) {
          document.querySelectorAll(`[data-word-index="${index}"]`).forEach((el) => {
            el.classList.add("talk-to-book-citation-highlight");
            if (!firstEl && el.getClientRects().length > 0) firstEl = el;
          });
        }
        if (firstEl) firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return Boolean(firstEl);
      };

      applyHighlights();
      [100, 250, 500, 900, 1500].forEach((delay) => {
        highlightPollTimersRef.current.push(setTimeout(applyHighlights, delay));
      });
      return pageNumber;
    };

    bookRef.current.clearSnippetHighlights = () => {
      clearHighlightPollTimers();
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
    clearHighlightPollTimers,
  ]);

  return {
    clearHighlightPollTimers,
  };
}

export default useFlipBookImperativeApi;
