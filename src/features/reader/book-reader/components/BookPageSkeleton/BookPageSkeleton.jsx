import React from "react";
import "./BookPageSkeleton.css";

/**
 * Editorial Apple Books-inspired page skeleton placeholder.
 * Simulates book margins, chapter header, justified paragraph lines,
 * and page number footer with a fluid shimmer wave in RTL reading direction.
 */
export function BookPageSkeleton({
  theme = "pure-white",
  pageWidth,
  pageHeight,
  bookTitle = "",
}) {
  return (
    <div
      className={`ktab-page-skeleton-wrapper ktab-reader-theme--${theme}`}
      dir="rtl"
      aria-busy="true"
      aria-label="جاري تجهيز صفحات الكتاب"
    >
      <div
        className={`ktab-page-skeleton-sheet ktab-book-page--${theme}`}
        style={{
          width: pageWidth ? `${pageWidth}px` : "var(--single-page-width, 100%)",
          maxWidth: pageWidth ? `${pageWidth}px` : "var(--single-page-width, 100%)",
          height: pageHeight ? `${pageHeight}px` : "var(--single-page-height, 100%)",
        }}
      >
        <div className="ktab-page-skeleton__content">
          {/* Running Chapter / Book Header */}
          <div className="ktab-page-skeleton__header">
            {bookTitle ? (
              <span className="ktab-page-skeleton__ghost-title">{bookTitle}</span>
            ) : (
              <div className="ktab-page-skeleton__line ktab-page-skeleton__line--header" />
            )}
            <div className="ktab-page-skeleton__divider" />
          </div>

          {/* Paragraph Blocks */}
          <div className="ktab-page-skeleton__body">
            {/* Paragraph 1 */}
            <div className="ktab-page-skeleton__paragraph">
              <div className="ktab-page-skeleton__line" style={{ width: "98%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "94%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "100%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "91%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "96%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "64%" }} />
            </div>

            {/* Paragraph 2 */}
            <div className="ktab-page-skeleton__paragraph">
              <div className="ktab-page-skeleton__line" style={{ width: "95%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "100%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "92%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "97%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "88%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "52%" }} />
            </div>

            {/* Paragraph 3 */}
            <div className="ktab-page-skeleton__paragraph">
              <div className="ktab-page-skeleton__line" style={{ width: "97%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "93%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "89%" }} />
              <div className="ktab-page-skeleton__line" style={{ width: "70%" }} />
            </div>
          </div>

          {/* Page Number Footer */}
          <div className="ktab-page-skeleton__footer">
            <div className="ktab-page-skeleton__line ktab-page-skeleton__line--page-num" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookPageSkeleton;
