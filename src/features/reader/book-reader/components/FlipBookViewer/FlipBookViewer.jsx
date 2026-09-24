import React, { forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useFlipBookViewer } from "../../hooks/useFlipBookViewer";
import "./FlipBookViewer.css";

/* ==========================================================================
   ELEGANT LOADER OVERLAY
   ========================================================================== */
function BookLoader() {
  return (
    <div className="ktab-book-loader-overlay">
      <div className="ktab-book-loader-card">
        <div className="ktab-book-loader-spinner" />
        <span className="ktab-book-loader-text">جاري إعداد صفحات الكتاب…</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   FLIPBOOK VIEWER DECLARATIVE VIEW
   ========================================================================== */
export function FlipBookViewer(props) {
  const {
    containerRef,
    flipRef,
    ready,
    loading,
    pages,
    tokens,
    pageWidth,
    pageHeight,
    isMobile,
    theme,
    readOnly,
    dynamicFontSize,
    dynamicLineHeight,
    handleFlipPrev,
    handleFlipNext,
    handleTouchStart,
    handleTouchEnd,
    onPageChange,
  } = useFlipBookViewer(props);

  return (
    <div
      ref={containerRef}
      className={`ktab-flipbook-container ktab-reader-theme--${theme} ${
        readOnly ? "pointer-events-none" : ""
      }`}
      style={{
        "--single-page-width": `${pageWidth}px`,
        "--single-page-height": `${pageHeight}px`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      dir="ltr"
    >
      {loading && <BookLoader />}

      {/* Tactile Edge Flip Zones for Both Mobile and Desktop */}
      {pages.length > 0 && (
        <>
          {/* Right Edge: Advance to Next Page (+1) */}
          <button
            type="button"
            className="ktab-flip-edge-trigger ktab-flip-edge-trigger--prev"
            onClick={(e) => {
              e.stopPropagation();
              handleFlipNext();
            }}
            aria-label="الصفحة التالية"
            title="الصفحة التالية"
          >
            {!isMobile && (
              <div className="ktab-flip-edge-pill">
                <ChevronRight size={20} strokeWidth={2.4} />
              </div>
            )}
          </button>

          {/* Left Edge: Return to Previous Page (-1) */}
          <button
            type="button"
            className="ktab-flip-edge-trigger ktab-flip-edge-trigger--next"
            onClick={(e) => {
              e.stopPropagation();
              handleFlipPrev();
            }}
            aria-label="الصفحة السابقة"
            title="الصفحة السابقة"
          >
            {!isMobile && (
              <div className="ktab-flip-edge-pill">
                <ChevronLeft size={20} strokeWidth={2.4} />
              </div>
            )}
          </button>
        </>
      )}

      {/* Graceful Empty State (When text is unavailable from database) */}
      {ready && pages.length === 0 && (
        <div className="ktab-book-empty-container" dir="rtl">
          <div className="ktab-book-empty-card">
            <div className="ktab-book-empty-icon">
              <BookOpen size={32} strokeWidth={1.8} />
            </div>
            <h3 className="ktab-book-empty-title">لا يتوفر نص مكتوب لهذا الكتاب في الخادم</h3>
            <p className="ktab-book-empty-desc">
              تم الاستعلام عن محتوى الكتاب من خادم الـ API، ولكن قاعدة البيانات لا تحتوي على نص مستخرج لهذا المعرف حتى الآن.
            </p>
          </div>
        </div>
      )}

      {/* Main Single-Page HTMLFlipBook Engine */}
      {ready && pages.length > 0 && (
        <HTMLFlipBook
          key={`flip-${isMobile ? "m" : "d"}-${pageWidth}-${pageHeight}`}
          ref={flipRef}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          usePortrait={true}
          autoSize={false}
          showPageCorners={false}
          disableFlipByClick={false}
          maxShadowOpacity={0.08}
          flippingTime={450}
          swipeDistance={15}
          mobileScrollSupport={false}
          className="ktab-book-flip-engine"
          style={{
            width: `${pageWidth}px`,
            maxWidth: `${pageWidth}px`,
            height: `${pageHeight}px`,
            margin: "0 auto",
          }}
          onFlip={(e) => onPageChange?.((e?.data ?? 0) + 1)}
        >
          {pages.map((p, i) => (
            <Page
              key={i}
              number={i + 1}
              theme={theme}
              dynamicFontSize={dynamicFontSize}
              dynamicLineHeight={dynamicLineHeight}
            >
              {(() => {
                const out = [];
                for (let w = p.startWord; w < p.endWord; w++) {
                  const t = tokens[w];
                  if (!t) continue;
                  if (w !== p.startWord) out.push(" ");
                  out.push(
                    <span
                      key={w}
                      data-word-index={w}
                      data-word-start={t.startChar}
                      data-word-end={t.endChar}
                    >
                      {t.value}
                    </span>
                  );
                }
                return out;
              })()}
            </Page>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
}

const Page = forwardRef(
  ({ number, children, theme = "pure-white", dynamicFontSize, dynamicLineHeight }, ref) => (
    <div
      ref={ref}
      className={`ktab-book-page ktab-book-page--${theme}`}
      dir="rtl"
    >
      {/* Front Face: Book Text Content */}
      <div className="ktab-book-page__content-wrap">
        <div
          className="ktab-book-page__text"
          style={{
            lineHeight: dynamicLineHeight,
            fontSize: dynamicFontSize,
          }}
        >
          {children}
        </div>

        {number && (
          <div className="ktab-book-page__footer">
            <span className="ktab-book-page__number">{number}</span>
          </div>
        )}
      </div>

      {/* Back Face: Solid White with Centered Ktab Logo (Revealed on swiping / page turn) */}
      <div className="ktab-book-page__backface" aria-hidden="true" dir="ltr">
        <div className="ktab-book-page__backface-inner">
          <img
            src={brandIconImg}
            alt="كتاب"
            className="ktab-book-backface-logo"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
);

Page.displayName = "Page";

export default FlipBookViewer;
