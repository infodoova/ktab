import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchReaderPage, locateReaderPdfPage, locateReaderSnippet } from "../services/bookReaderService";
import { fetchBookDetailsById } from "@/features/reader/book-details/services/bookDetailsService";
import { getTargetWordsPerPage } from "../utils/readerPaginationUtils";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Loads authentic book pages strictly paginated on-demand.
 * Starts strictly from pure body pages (excluding introductions, front matter, appendixes, bibliographies).
 * Prevents full-text dumping in network payloads for maximum performance and anti-scraping protection.
 *
 * @param {string|number} id - Book ID
 * @returns {Object} Content state, metadata, and loading indicators
 */
export function useReaderContent(id) {
  const location = useLocation();
  const initialLocationRef = useRef(location);

  const [bookTitle, setBookTitle] = useState(() => {
    return (
      location?.state?.bookTitle ||
      location?.state?.title ||
      location?.state?.book?.title ||
      ""
    );
  });

  const [bookAuthor, setBookAuthor] = useState(() => {
    return (
      location?.state?.bookAuthor ||
      location?.state?.author ||
      location?.state?.book?.author ||
      location?.state?.authorName ||
      location?.state?.book?.authorName ||
      ""
    );
  });

  const [bookText, setBookText] = useState("");
  const [loadingText, setLoadingText] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [wordsPerPage, setWordsPerPage] = useState(() => getTargetWordsPerPage());
  const [currentPageData, setCurrentPageData] = useState(null);
  const [initialNavigation, setInitialNavigation] = useState(null);

  // Active page number and words-per-page transition flag for orientation/viewport changes
  const activePageRef = useRef(1);
  const isWppChangeRef = useRef(false);

  // In-memory cache for loaded pages (pageNumber -> pageData)
  const pagesCacheRef = useRef({});

  // Monitor viewport dimensions / device rotation to update wordsPerPage dynamically
  useEffect(() => {
    let rafId = null;

    function handleViewportChange() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const nextWpp = getTargetWordsPerPage();
        setWordsPerPage((prevWpp) => {
          if (nextWpp === prevWpp) return prevWpp;

          const currentPage = activePageRef.current || 1;
          const currentWordIndex = (currentPage - 1) * prevWpp;
          const mappedPage = Math.floor(currentWordIndex / nextWpp) + 1;
          activePageRef.current = mappedPage;
          isWppChangeRef.current = true;
          return nextWpp;
        });
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("orientationchange", handleViewportChange);
      window.visualViewport?.addEventListener("resize", handleViewportChange);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("orientationchange", handleViewportChange);
        window.visualViewport?.removeEventListener("resize", handleViewportChange);
      }
    };
  }, []);

  const loadPage = useCallback(
    async (pageNum) => {
      if (!id || pageNum < 1) return null;
      activePageRef.current = pageNum;

      // 1. Check in-memory cache first
      if (pagesCacheRef.current[pageNum]) {
        const cached = pagesCacheRef.current[pageNum];
        setCurrentPageData(cached);
        setBookText(cached.content || "");
        if (cached.totalPages) {
          setTotalPages(cached.totalPages);
        }
        return cached;
      }

      // 2. Fetch requested page from backend strictly on-demand
      try {
        const res = await fetchReaderPage(id, { page: pageNum, wordsPerPage });
        if (res?.data) {
          const data = res.data;
          pagesCacheRef.current[pageNum] = data;
          setCurrentPageData(data);
          setBookText(data.content || "");
          if (data.totalPages) {
            setTotalPages(data.totalPages);
          }
          if (data.bookTitle && !bookTitle) {
            setBookTitle(data.bookTitle);
          }

          // Pre-warm the next page asynchronously in background so subsequent forward turn is instant
          const maxP = data.totalPages || totalPages;
          if (pageNum < maxP) {
            const nextPageNum = pageNum + 1;
            if (!pagesCacheRef.current[nextPageNum]) {
              fetchReaderPage(id, { page: nextPageNum, wordsPerPage })
                .then((nextRes) => {
                  if (nextRes?.data) {
                    pagesCacheRef.current[nextPageNum] = nextRes.data;
                  }
                })
                .catch(() => {});
            }
          }

          return data;
        }
      } catch (err) {
        console.warn("Failed to fetch reader page:", pageNum, err);
      }
      return null;
    },
    [id, wordsPerPage, bookTitle, totalPages]
  );

  useEffect(() => {
    let active = true;

    async function loadInitialPage() {
      setLoadingText(true);
      pagesCacheRef.current = {};

      try {
        const entryLocation = initialLocationRef.current;
        const params = new URLSearchParams(entryLocation.search);
        const snippet = params.get("snippet") || params.get("highlight")
          || entryLocation.state?.highlightSnippet || entryLocation.state?.highlightText;
        const pdfPage = Number(params.get("pdfPage") || entryLocation.state?.pdfPageNumber);
        const directPage = Number(params.get("page")
          || entryLocation.state?.targetPage || entryLocation.state?.initialPage);
        
        let targetPage;
        if (isWppChangeRef.current && activePageRef.current > 0) {
          targetPage = activePageRef.current;
        } else {
          targetPage = Number.isInteger(directPage) && directPage > 0 ? directPage : 1;
        }
        let wordRange = null;

        if (snippet || pdfPage > 0) {
          try {
            const located = snippet
              ? await locateReaderSnippet(id, snippet, wordsPerPage)
              : await locateReaderPdfPage(id, pdfPage, wordsPerPage);
            if (located?.data?.found) {
              targetPage = located.data.page;
              wordRange = located.data;
            }
          } catch (error) {
            console.warn("Could not locate initial citation:", error);
          }
        }

        const res = await fetchReaderPage(id, { page: targetPage, wordsPerPage });

        if (res?.messageStatus !== "SUCCESS" && !res?.data) {
          AlertToast(res?.message || "فشل تحميل صفحات الكتاب", "ERROR");
          if (active) setLoadingText(false);
          return;
        }

        const data = res.data;
        if (active && data) {
          const isWpp = isWppChangeRef.current;
          isWppChangeRef.current = false;
          activePageRef.current = data.page || targetPage;
          pagesCacheRef.current[data.page || targetPage] = data;
          setInitialNavigation({
            page: data.page || targetPage,
            isWppChange: isWpp,
            snippet: wordRange?.found ? snippet : null,
            startWordIndex: wordRange?.startWordIndex ?? null,
            endWordIndex: wordRange?.endWordIndex ?? null,
          });
          setCurrentPageData(data);
          setBookText(data.content || "");
          const totalP = Math.max(1, data.totalPages || 1);
          setTotalPages(totalP);

          // Pre-warm the page after the initial destination.
          const nextPage = (data.page || targetPage) + 1;
          if (nextPage <= totalP) {
            fetchReaderPage(id, { page: nextPage, wordsPerPage })
              .then((nextRes) => {
                if (nextRes?.data && active) {
                  pagesCacheRef.current[nextPage] = nextRes.data;
                }
              })
              .catch(() => {});
          }

          if (data.bookTitle) {
            setBookTitle(data.bookTitle);
          }

          if (!bookTitle || !bookAuthor) {
            fetchBookDetailsById(id)
              .then((metaRes) => {
                if (!active) return;
                if (metaRes?.data?.title || metaRes?.data?.name) {
                  setBookTitle(metaRes.data.title || metaRes.data.name);
                }
                const rawAuth = metaRes?.data?.author || metaRes?.data?.authorName || metaRes?.data?.authors;
                if (rawAuth) {
                  const authStr = Array.isArray(rawAuth)
                    ? rawAuth.map((a) => (typeof a === "string" ? a : a?.name || a?.authorName)).filter(Boolean).join("، ")
                    : (typeof rawAuth === "string" ? rawAuth : "");
                  if (authStr) setBookAuthor(authStr);
                }
              })
              .catch(() => {});
          }

          setLoadingText(false);
        }
      } catch (err) {
        console.error("Initial page load error:", err);
        AlertToast("فشل الاتصال بالخادم لتحميل صفحة الكتاب", "ERROR");
        if (active) setLoadingText(false);
      }
    }

    if (id) {
      loadInitialPage();
    }

    return () => {
      active = false;
    };
  }, [id, wordsPerPage]);

  return {
    bookTitle,
    setBookTitle,
    bookAuthor,
    setBookAuthor,
    bookText,
    loadingText,
    totalPages,
    setTotalPages,
    wordsPerPage,
    setWordsPerPage,
    currentPageData,
    initialNavigation,
    loadPage,
    pagesCacheRef,
  };
}

export default useReaderContent;
