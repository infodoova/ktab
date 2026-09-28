import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchBookContent } from "../services/bookReaderService";
import { fetchBookDetailsById } from "@/features/reader/book-details/services/bookDetailsService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Loads authentic book text content and author/title metadata.
 * Parses backend responses across strings, page arrays, or chapter structures.
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
  const [wordsPerPage] = useState(80);

  useEffect(() => {
    let active = true;

    async function loadBookData() {
      setLoadingText(true);
      try {
        const res = await fetchBookContent(id);

        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message || "فشل تحميل الكتاب", res?.messageStatus || "ERROR");
          setLoadingText(false);
          return;
        }

        const data = res.data;
        let rawContent = "";
        if (typeof data === "string") {
          rawContent = data;
        } else if (Array.isArray(data)) {
          rawContent = data
            .map((item) => (typeof item === "string" ? item : item?.text || item?.content || ""))
            .filter(Boolean)
            .join("\n\n");
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.pages)) {
            rawContent = data.pages
              .map((p) => (typeof p === "string" ? p : p?.text || p?.content || ""))
              .filter(Boolean)
              .join("\n\n");
          } else if (Array.isArray(data.chapters)) {
            rawContent = data.chapters
              .map((c) => (typeof c === "string" ? c : c?.text || c?.content || ""))
              .filter(Boolean)
              .join("\n\n");
          } else {
            rawContent = data.text || data.content || data.bookText || "";
          }
        }

        // Clean out literal stringified null/undefined artifacts
        const cleaned = String(rawContent || "")
          .replace(/\b(null|undefined)\b/gi, "")
          .trim();

        if (active) {
          if (data?.title || data?.bookTitle || data?.name) {
            setBookTitle(data.title || data.bookTitle || data.name);
          }
          if (data?.author || data?.authorName || data?.authors) {
            const rawAuth = data?.author || data?.authorName || data?.authors;
            const authStr = Array.isArray(rawAuth)
              ? rawAuth.map((a) => (typeof a === "string" ? a : a?.name || a?.authorName)).filter(Boolean).join("، ")
              : (typeof rawAuth === "string" ? rawAuth : "");
            if (authStr) setBookAuthor(authStr);
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

          setBookText(cleaned);
          const wordEstimate = cleaned.trim().split(/\s+/).filter(Boolean).length;
          const pageEstimate = Math.max(1, Math.ceil(wordEstimate / 110));
          setTotalPages(pageEstimate);
          setLoadingText(false);
        }
      } catch (err) {
        console.error("Book text load error:", err);
        AlertToast("فشل الاتصال بالخادم لتحميل نص الكتاب", "ERROR");
        if (active) setLoadingText(false);
      }
    }

    if (id) loadBookData();

    return () => {
      active = false;
    };
  }, [id]);

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
  };
}

export default useReaderContent;
