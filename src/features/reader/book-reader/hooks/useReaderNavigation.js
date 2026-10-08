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
  wordsPerPage = 80,
  initialNavigation,
  onPageChangeNotification,
  loadPage,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const generatedPagesRef = useRef([]);
  const pendingSnippetQueryRef = useRef(null);
  const locatingRef = useRef(false);
  const hasInitialTargetRef = useRef(Boolean(
    new URLSearchParams(location.search).get("snippet") ||
    new URLSearchParams(location.search).get("pdfPage") ||
    new URLSearchParams(location.search).get("page") ||
    location.state?.highlightSnippet || location.state?.pdfPageNumber ||
    location.state?.targetPage || location.state?.initialPage
  ));
  const [citationLoading, setCitationLoading] = useState(hasInitialTargetRef.current);

  /** Move to the page already fetched during reader initialization. */
  const resolveSnippetNavigation = useCallback(async () => {
    if (!pendingSnippetQueryRef.current || locatingRef.current || !bookRef.current?.goToPage) return false;
    const request = pendingSnippetQueryRef.current;
    locatingRef.current = true;
    try {
      const targetPage = request.page;
      const loadedPage = await loadPage?.(targetPage);
      if (!loadedPage) throw new Error("Citation page could not be loaded");
      bookRef.current.goToPage(targetPage, true);
      setCurrentPage(targetPage);
      if (request.snippet) {
        bookRef.current.findAndHighlightSnippet?.(
          request.snippet, targetPage, request.startWordIndex, request.endWordIndex
        );
      }
      pendingSnippetQueryRef.current = null;
      navigate(location.pathname, { replace: true, state: {} });
      // Keep the overlay through the page transition, including curl mode.
      setTimeout(() => setCitationLoading(false), 600);
      return true;
    } catch (error) {
      console.warn("Could not open reader citation:", error);
      pendingSnippetQueryRef.current = null;
      setCitationLoading(false);
      return false;
    } finally {
      locatingRef.current = false;
    }
  }, [bookRef, loadPage, location.pathname, navigate]);

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

  // Initial citation lookup, page fetch, or orientation/wordsPerPage changes
  useEffect(() => {
    if (!initialNavigation?.page || loadingText) return;
    if (initialNavigation.isWppChange) {
      bookRef.current?.goToPage?.(initialNavigation.page, true);
      setCurrentPage(initialNavigation.page);
      return;
    }
    if (!hasInitialTargetRef.current) return;
    pendingSnippetQueryRef.current = initialNavigation;
    resolveSnippetNavigation();
    const timer = setTimeout(resolveSnippetNavigation, 350);
    return () => clearTimeout(timer);
  }, [initialNavigation, loadingText, resolveSnippetNavigation, bookRef]);

  // Clean snippet highlights on unmount
  useEffect(() => {
    return () => {
      bookRef.current?.clearSnippetHighlights?.();
    };
  }, [bookRef]);

  return {
    currentPage,
    citationLoading,
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
