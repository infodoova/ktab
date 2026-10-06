import React, { useState, useEffect } from "react";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { fetchBookSectionContent } from "../../services/bookReaderService";
import { RefreshCw, AlertCircle } from "lucide-react";
import "./BookSectionModal.css";

/**
 * Editorial Liquid Glass Appendix & Section Content Viewer.
 * Uses common DetailsDrawer:
 * - Desktop: Opens as a left-side modal panel.
 * - Mobile: Translates into an elegant bottom sheet.
 */
export function BookSectionModal({
  isOpen,
  onClose,
  section,
  bookId,
  theme = "pure-white",
  fontSize = 18,
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !section?.id || !bookId) {
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setContent("");

    fetchBookSectionContent(bookId, section.id)
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data || res;
        setContent(data?.content || "");
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch section content:", err);
        setError("تعذر تحميل محتوى هذا الملحق. يرجى المحاولة مرة أخرى.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, section?.id, bookId]);

  if (!isOpen || !section) return null;

  const htmlContent = content
    ? DOMPurify.sanitize(marked.parse(content, { breaks: false, gfm: true }))
    : "";

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={section.title || "الملحق"}
      subtitle="ملحق ومراجع الكتاب"
      width="580px"
      className={`ktab-section-drawer ktab-section-drawer--${theme}`}
    >
      <div className="ktab-section-drawer-inner" dir="rtl">
        {loading && (
          <div className="ktab-section-modal__loading">
            <div className="ktab-section-modal__spinner" />
            <span>جارٍ تحميل محتوى الملحق...</span>
          </div>
        )}

        {error && !loading && (
          <div className="ktab-section-modal__error">
            <AlertCircle size={28} />
            <p>{error}</p>
            <button
              type="button"
              className="ktab-section-modal__retry-btn"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchBookSectionContent(bookId, section.id)
                  .then((res) => {
                    const data = res?.data || res;
                    setContent(data?.content || "");
                    setLoading(false);
                  })
                  .catch(() => {
                    setError("تعذر تحميل محتوى هذا الملحق. يرجى المحاولة مرة أخرى.");
                    setLoading(false);
                  });
              }}
            >
              <RefreshCw size={14} />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <div
            className="ktab-section-modal__content"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </DetailsDrawer>
  );
}

export default BookSectionModal;
