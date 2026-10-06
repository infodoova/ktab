import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveReadingProgress } from "../services/bookReaderService";

/**
 * Manages current reading page index, page turns, citation query routing,
 * and asynchronous reading progress persistence.
 *
 * @param {Object} params
 * @param {string|number} params.bookId
 * @param {React.RefObject} params.bookRef
 * @param {string} params.bookText
 * @param {boolean} params.loadingText
 * @param {string} [params.token]
 * @param {Function} [params.onPageChangeNotification]
 * @returns {Object} Navigation state and handler methods
 */
export function useReaderNavigation({
  bookId,
  bookRef,
  bookText,
  loadingText,
  token,
  onPageChangeNotification,
  loadPage,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const generatedPagesRef = useRef([]);
  const pendingSnippetQueryRef = useRef(null);

  /**
   * Resolves queued citation snippets or fallback page targets once reader engine is mounted.
   */
  const resolveSnippetNavigation = useCallback(() => {
    if (!pendingSnippetQueryRef.current) return false;
    const { snippet, fallbackPage } = pendingSnippetQueryRef.current;

    // 1. Prioritize verbatim snippet matching across reader tokens
    if (snippet && bookRef.current?.findAndHighlightSnippet) {
      const resolvedPage = bookRef.current.findAndHighlightSnippet(snippet);
      if (resolvedPage) {
        pendingSnippetQueryRef.current = null;
        setCurrentPage(resolvedPage);
        navigate(location.pathname, { replace: true, state: {} });
        if (window.history?.replaceState) {
          window.history.replaceState({}, document.title, location.pathname);
        }
        return true;
      }
    }

    // 2. Fallback to direct page target only if pagination completed and snippet did not resolve
    if (
      generatedPagesRef.current?.length > 0 &&
      fallbackPage > 0 &&
      bookRef.current?.goToPage
    ) {
      pendingSnippetQueryRef.current = null;
      bookRef.current.goToPage(fallbackPage, true);
      setCurrentPage(fallbackPage);
      navigate(location.pathname, { replace: true, state: {} });
      if (window.history?.replaceState) {
        window.history.replaceState({}, document.title, location.pathname);
      }
      return true;
    }

    return false;
  }, [bookRef, location.pathname, navigate]);

  const onPagesGenerated = useCallback(
    (pageInfo) => {
      generatedPagesRef.current = pageInfo;
      resolveSnippetNavigation();
    },
    [resolveSnippetNavigation]
  );

  const currentPageText = useMemo(() => {
    if (bookRef.current?.getCurrentPageText) {
      const txt = bookRef.current.getCurrentPageText();
      if (txt) return txt;
    }
    const pages = generatedPagesRef.current;
    const pageInfo = pages[currentPage - 1];
    if (pageInfo && !pageInfo.isEndPage && bookText) {
      return bookText.slice(pageInfo.startChar, pageInfo.endChar).trim();
    }
    return "";
  }, [currentPage, bookText, bookRef]);

  const handleNextPage = useCallback(() => {
    try {
      if (bookRef.current?.nextPage) {
        bookRef.current.nextPage();
      } else if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipNext();
      }
    } catch {
      // Ignored if rapid flip animation is in progress
    }
  }, [bookRef]);

  const handlePrevPage = useCallback(() => {
    try {
      if (bookRef.current?.prevPage) {
        bookRef.current.prevPage();
      } else if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipPrev();
      }
    } catch {
      // Ignored if rapid flip animation is in progress
    }
  }, [bookRef]);

  const handleGoToPage = useCallback(
    (pageNum) => {
      if (bookRef.current?.goToPage) {
        bookRef.current.goToPage(pageNum);
        setCurrentPage(pageNum);
      }
    },
    [bookRef]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      if (loadPage && newPage) {
        loadPage(newPage);
      }
      if (token && bookId && newPage) {
        const total = generatedPagesRef.current.length || 1;
        saveReadingProgress(bookId, { page: newPage, totalPages: total }).catch(() => {});
      }
      onPageChangeNotification?.(newPage, generatedPagesRef.current);
    },
    [bookId, token, onPageChangeNotification, loadPage]
  );

  // Jump automatically to target cited page from query param (?page=X or ?snippet=Y)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get("page");
    const snippetParam =
      searchParams.get("snippet") ||
      searchParams.get("highlight") ||
      location?.state?.highlightSnippet ||
      location?.state?.highlightText;

    const targetPage = parseInt(
      pageParam || location?.state?.targetPage || location?.state?.initialPage,
      10
    );

    if (snippetParam) {
      pendingSnippetQueryRef.current = {
        snippet: snippetParam,
        fallbackPage: targetPage > 0 ? targetPage : null,
      };
    } else if (targetPage > 0) {
      pendingSnippetQueryRef.current = {
        snippet: null,
        fallbackPage: targetPage,
      };
    }

    if (!loadingText) {
      resolveSnippetNavigation();
      const timer = setTimeout(() => {
        resolveSnippetNavigation();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [location.search, location?.state, loadingText, resolveSnippetNavigation]);

  // Clean snippet highlights on unmount
  useEffect(() => {
    return () => {
      bookRef.current?.clearSnippetHighlights?.();
    };
  }, [bookRef]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    generatedPagesRef,
    currentPageText,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageChange,
    onPagesGenerated,
  };
}

export default useReaderNavigation;
