import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchReaderPage } from "../services/bookReaderService";
import { fetchBookDetailsById } from "@/features/reader/book-details/services/bookDetailsService";
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
  const [wordsPerPage, setWordsPerPage] = useState(80);
  const [currentPageData, setCurrentPageData] = useState(null);

  // In-memory cache for loaded pages (pageNumber -> pageData)
  const pagesCacheRef = useRef({});

  const loadPage = useCallback(
    async (pageNum) => {
      if (!id || pageNum < 1) return null;

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
        const res = await fetchReaderPage(id, { page: 1, wordsPerPage });

        if (res?.messageStatus !== "SUCCESS" && !res?.data) {
          AlertToast(res?.message || "فشل تحميل صفحات الكتاب", "ERROR");
          if (active) setLoadingText(false);
          return;
        }

        const data = res.data;
        if (active && data) {
          pagesCacheRef.current[1] = data;
          setCurrentPageData(data);
          setBookText(data.content || "");
          const totalP = Math.max(1, data.totalPages || 1);
          setTotalPages(totalP);

          // Pre-warm page 2 in background
          if (totalP > 1) {
            fetchReaderPage(id, { page: 2, wordsPerPage })
              .then((nextRes) => {
                if (nextRes?.data && active) {
                  pagesCacheRef.current[2] = nextRes.data;
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
    loadPage,
    pagesCacheRef,
  };
}

export default useReaderContent;
