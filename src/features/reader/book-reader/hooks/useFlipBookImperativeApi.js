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
  pages,
  tokens,
  normalizedText,
  totalPages,
  currentPageIndex,
  handleFlipNext,
  handleFlipPrev,
  goToPage,
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
    if (pendingSnippetRef.current && pages.length > 0 && tokens.length > 0) {
      const snip = pendingSnippetRef.current;
      pendingSnippetRef.current = null;
      setTimeout(() => {
        bookRef?.current?.findAndHighlightSnippet?.(snip);
      }, 60);
    }
  }, [pages, tokens, bookRef]);

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

    bookRef.current.getCurrentPageText = () => {
      const def = pages[currentPageIndex];
      if (!def || def.isEndPage) return "";
      const first = tokens[def.startWord];
      const last = tokens[def.endWord - 1];
      const s = first ? first.startChar : 0;
      const e = last ? last.endChar : normalizedText.length;
      return normalizedText.slice(s, e).trim();
    };

    bookRef.current.getPageText = (page) => {
      const p = Math.min(Math.max(1, page), totalPages);
      const def = pages[p - 1];
      if (!def || def.isEndPage) return "";
      const first = tokens[def.startWord];
      const last = tokens[def.endWord - 1];
      const s = first ? first.startChar : 0;
      const e = last ? last.endChar : normalizedText.length;
      return normalizedText.slice(s, e).trim();
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
     * Searches for a verbatim text snippet across the book's full content,
     * navigates to its dynamic page, and highlights the passage.
     *
     * @param {string} snippet
     * @returns {number|null} Target page number if resolved, null otherwise
     */
    bookRef.current.findAndHighlightSnippet = (snippet) => {
      if (!snippet || typeof snippet !== "string") return null;

      const cleanSnippet = snippet.trim();
      if (!cleanSnippet) return null;

      // Queue snippet if called before pagination finishes
      if (!tokens?.length || !pages?.length) {
        pendingSnippetRef.current = cleanSnippet;
        return null;
      }

      const matchRange = findSnippetTokenRange(tokens, cleanSnippet);
      if (!matchRange) return null;

      const { startTokenIdx, endTokenIdx } = matchRange;

      let targetPage = null;
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const p = pages[pIdx];
        if (startTokenIdx >= p.startWord && startTokenIdx < p.endWord) {
          targetPage = pIdx + 1;
          break;
        }
      }

      if (!targetPage) {
        targetPage = Math.max(1, totalPages);
      }

      // Navigate to target dynamic page
      goToPage(targetPage, true);

      const matchedTokenIndices = [];
      for (let idx = startTokenIdx; idx <= endTokenIdx; idx++) {
        matchedTokenIndices.push(idx);
      }

      clearHighlightPollTimers();
      bookRef.current.clearSnippetHighlights?.();

      const applyHighlights = () => {
        let anyHighlighted = false;
        let firstEl = null;

        matchedTokenIndices.forEach((wIdx) => {
          const el = document.querySelector(`[data-word-index="${wIdx}"]`);
          if (el) {
            el.classList.add("talk-to-book-citation-highlight");
            if (!firstEl) firstEl = el;
            anyHighlighted = true;
          }
        });

        if (firstEl) {
          firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return anyHighlighted;
      };

      const applied = applyHighlights();
      const pollDelays = applied ? [200, 500] : [50, 150, 300, 550, 900, 1400];
      pollDelays.forEach((delay) => {
        const timerId = setTimeout(() => {
          applyHighlights();
        }, delay);
        highlightPollTimersRef.current.push(timerId);
      });

      return targetPage;
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
