import React, { useCallback } from "react";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, BookOpen } from "lucide-react";
import { useFlipBookViewer } from "../../hooks/useFlipBookViewer";
import { KindleSlideTransition } from "../transitions/KindleSlideTransition";
import { Flip3DTransition } from "../transitions/Flip3DTransition";
import { PageCurlTransition } from "../transitions/PageCurlTransition";
import { ALLOW_RIGHT_CLICK } from "../../constants/readerConstants";
import "./FlipBookViewer.css";

/* ==========================================================================
   ELEGANT LOADER OVERLAY
   ========================================================================== */
function BookLoader({ text = "جاري إعداد صفحات الكتاب…" }) {
  return (
    <div className="ktab-book-loader-overlay">
      <div className="ktab-book-loader-card">
        <div className="ktab-book-loader-spinner" />
        <span className="ktab-book-loader-text">{text}</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   MULTI-MODE BOOK VIEWER
   Coordinates isolated transition engines (Curl / 3D Flip / Kindle Slide)
   and renders the PC left-side big square mode selector.
   ========================================================================== */
export function FlipBookViewer(props) {
  const {
    containerRef,
    ready,
    loading,
    isModeSwitching,
    pages,
    tokens,
    totalPages,
    currentPageIndex,
    transitionDir,
    isTransitioning,
    pageWidth,
    pageHeight,
    isMobile,
    theme,
    readOnly,
    dynamicFontSize,
    dynamicLineHeight,
    goToPage,
    handleFlipPrev,
    handleFlipNext,
    handleTouchStart,
    handleTouchEnd,
    transitionMode,
    curlRef,
    handlePageFlipFromEngine,
    handleCurlTurnNext,
    bookTitle,
    bookAuthor,
    onBack,
  } = useFlipBookViewer(props);

  const currentPage = pages[currentPageIndex];
  const nextPage = pages[currentPageIndex + 1];
  const prevPage = pages[currentPageIndex - 1];

  /**
   * Pure declarative renderer for page word tokens and page number footer.
   * Maintains exact word offset attributes (data-word-index) for TTS audio highlighting.
   */
  const renderContent = useCallback(
    (page, pageNum) => {
      if (!page) return null;

      if (page.isEndPage) {
        return (
          <div
            className="ktab-book-page__content-wrap ktab-book-page__content-wrap--end"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => {
              if (!ALLOW_RIGHT_CLICK) e.preventDefault();
            }}
          >
            <div className="ktab-book-end-page">
              <h2 className="ktab-book-end-page__title">النهاية</h2>
              {bookAuthor && (
                <p className="ktab-book-end-page__author">{bookAuthor}</p>
              )}
            </div>
          </div>
        );
      }

      const wordSpans = [];

      for (let w = page.startWord; w < page.endWord; w++) {
        const t = tokens[w];
        if (!t) continue;
        if (w !== page.startWord) wordSpans.push(" ");
        wordSpans.push(
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

      return (
        <div
          className="ktab-book-page__content-wrap"
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => {
            if (!ALLOW_RIGHT_CLICK) e.preventDefault();
          }}
        >
          <div
            className="ktab-book-page__text"
            style={{
              lineHeight: dynamicLineHeight,
              fontSize: dynamicFontSize,
            }}
          >
            {wordSpans}
          </div>

          <div className="ktab-book-page__footer">
            <span className="ktab-book-page__number">{pageNum}</span>
          </div>
        </div>
      );
    },
    [
      tokens,
      dynamicFontSize,
      dynamicLineHeight,
      bookTitle,
      bookAuthor,
      goToPage,
      onBack,
    ]
  );

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
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => {
        if (!ALLOW_RIGHT_CLICK) e.preventDefault();
      }}
      dir="ltr"
    >
      {loading && <BookLoader />}
      {isModeSwitching && <BookLoader text="جاري تجهيز نمط القراءة…" />}

      {/* Tactile Edge Flip Zones (Tap to Turn & Desktop Hover Pills) */}
      {pages.length > 0 && (
        <>
          {/* Right Edge: Advance to Next Page (+1) in RTL */}
          <button
            type="button"
            className={`ktab-flip-edge-trigger ktab-flip-edge-trigger--next ${
              currentPageIndex >= totalPages - 1 ? "ktab-flip-edge-trigger--disabled" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFlipNext();
            }}
            aria-label="الصفحة التالية"
            title="الصفحة التالية"
            disabled={currentPageIndex >= totalPages - 1}
          >
            {!isMobile && (
              <div className="ktab-flip-edge-pill">
                <ChevronRight size={20} strokeWidth={2.4} />
              </div>
            )}
          </button>

          {/* Left Edge: Return to Previous Page (-1) in RTL */}
          <button
            type="button"
            className={`ktab-flip-edge-trigger ktab-flip-edge-trigger--prev ${
              currentPageIndex <= 0 ? "ktab-flip-edge-trigger--disabled" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFlipPrev();
            }}
            aria-label="الصفحة السابقة"
            title="الصفحة السابقة (سهم يسار أو نقر)"
            disabled={currentPageIndex <= 0}
          >
            {!isMobile && (
              <div className="ktab-flip-edge-pill">
                <ChevronLeft size={20} strokeWidth={2.4} />
              </div>
            )}
          </button>

          {/* Top Edge: Return to Previous Page (-1) */}
          <button
            type="button"
            className={`ktab-flip-edge-trigger ktab-flip-edge-trigger--top ${
              currentPageIndex <= 0 ? "ktab-flip-edge-trigger--disabled" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFlipPrev();
            }}
            aria-label="الصفحة السابقة (أعلى)"
            title="الصفحة السابقة (سهم أعلى)"
            disabled={currentPageIndex <= 0}
          >
            {!isMobile && (
              <div className="ktab-flip-edge-pill ktab-flip-edge-pill--vertical">
                <ChevronUp size={20} strokeWidth={2.4} />
              </div>
            )}
          </button>

          {/* Bottom Edge: Advance to Next Page (+1) */}
          <button
            type="button"
            className={`ktab-flip-edge-trigger ktab-flip-edge-trigger--bottom ${
              currentPageIndex >= totalPages - 1 ? "ktab-flip-edge-trigger--disabled" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFlipNext();
            }}
            aria-label="الصفحة التالية (أسفل)"
            title="الصفحة التالية (سهم أسفل)"
            disabled={currentPageIndex >= totalPages - 1}
          >
            {!isMobile && (
              <div className="ktab-flip-edge-pill ktab-flip-edge-pill--vertical">
                <ChevronDown size={20} strokeWidth={2.4} />
              </div>
            )}
          </button>
        </>
      )}

      {/* Graceful Empty State */}
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

      {/* Book Stage: Routes cleanly to the selected transition engine */}
      {ready && currentPage && (
        <div
          className="ktab-kindle-stage"
          style={{
            width: `${pageWidth}px`,
            maxWidth: `${pageWidth}px`,
            height: `${pageHeight}px`,
          }}
        >
          {/* MODE 1: 3D VERTICAL BROCHURE FLIP */}
          {transitionMode === "flip3d" && (
            <Flip3DTransition
              currentPage={currentPage}
              nextPage={nextPage}
              prevPage={prevPage}
              currentPageIndex={currentPageIndex}
              isTransitioning={isTransitioning}
              transitionDir={transitionDir}
              theme={theme}
              renderContent={renderContent}
              onFlipNext={handleFlipNext}
              onFlipPrev={handleFlipPrev}
            />
          )}

          {/* MODE 2: 3D REALISTIC BOOK PAGE CURL */}
          {transitionMode === "curl" && (
            <PageCurlTransition
              ref={curlRef}
              pages={pages}
              currentPageIndex={currentPageIndex}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
              theme={theme}
              onPageChange={handlePageFlipFromEngine}
              renderContent={renderContent}
            />
          )}

          {/* MODE 3: KINDLE STYLE (Smooth Translation Shift & Fade) */}
          {transitionMode === "slide" && (
            <KindleSlideTransition
              currentPage={currentPage}
              currentPageIndex={currentPageIndex}
              isTransitioning={isTransitioning}
              transitionDir={transitionDir}
              theme={theme}
              renderContent={renderContent}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FlipBookViewer;
