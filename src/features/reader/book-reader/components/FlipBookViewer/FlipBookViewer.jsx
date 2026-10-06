import React, { useCallback } from "react";
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, BookOpen } from "lucide-react";
import { useFlipBookViewer } from "../../hooks/useFlipBookViewer";
import { KindleSlideTransition } from "../transitions/KindleSlideTransition";
import { Flip3DTransition } from "../transitions/Flip3DTransition";
import { PageCurlTransition } from "../transitions/PageCurlTransition";
import { BookPageSkeleton } from "../BookPageSkeleton";
import { PreservedGuillemets } from "../PreservedGuillemets";
import { ALLOW_RIGHT_CLICK } from "../../constants/readerConstants";
import { normalizeText, tokenize } from "../../utils/readerPaginationUtils";
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
    pagesCacheRef,
    currentPageData,
    text,
    wordsPerPage,
  } = useFlipBookViewer(props);

  const currentPage = pages[currentPageIndex];
  const nextPage = pages[currentPageIndex + 1];
  const prevPage = pages[currentPageIndex - 1];

  /**
   * Declarative renderer for page word tokens and page number footer.
   * Renders cached or current page text on demand, maintaining word indices for TTS highlighting.
   * Renders fluid in-page shimmer lines if page is in transit to prevent blank flashes.
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

      // 1. Retrieve page text from in-memory cache or current page state
      const cached = pagesCacheRef?.current?.[pageNum];
      const isMatchingCurrentPageData =
        pageNum === currentPageIndex + 1 &&
        (currentPageData?.page === pageNum || (!currentPageData?.page && pageNum === 1));
      const pageText =
        cached?.content ||
        (isMatchingCurrentPageData ? (currentPageData?.content || text) : "") ||
        "";

      // 2. In-page smooth skeleton loader while fetching uncached page (eliminates previous page glitch)
      if (!pageText) {
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
              className="ktab-page-skeleton__body"
              style={{ width: "100%", gap: "16px", flex: 1, justifyContent: "center" }}
            >
              <div className="ktab-page-skeleton__paragraph" style={{ gap: "14px" }}>
                <div className="ktab-page-skeleton__line" style={{ width: "98%" }} />
                <div className="ktab-page-skeleton__line" style={{ width: "93%" }} />
                <div className="ktab-page-skeleton__line" style={{ width: "97%" }} />
                <div className="ktab-page-skeleton__line" style={{ width: "89%" }} />
                <div className="ktab-page-skeleton__line" style={{ width: "95%" }} />
                <div className="ktab-page-skeleton__line" style={{ width: "65%" }} />
              </div>
            </div>
            <div className="ktab-book-page__footer">
              <span className="ktab-book-page__number">{pageNum}</span>
            </div>
          </div>
        );
      }

      // Keep the source gaps around each word so reader text matches the API spacing.
      const cleanText = normalizeText(pageText);
      const pageTokens = tokenize(cleanText);
      const wordElements = [];
      const baseWordOffset = (pageNum - 1) * (wordsPerPage || 80);
      let previousEnd = 0;

      pageTokens.forEach((token, index) => {
        wordElements.push(cleanText.slice(previousEnd, token.startChar));
        wordElements.push(
          <span
            key={index}
            data-word-index={baseWordOffset + index}
            data-word-start={token.startChar}
            data-word-end={token.endChar}
          >
            <PreservedGuillemets text={token.value} />
          </span>
        );
        previousEnd = token.endChar + 1;
      });
      wordElements.push(cleanText.slice(previousEnd));

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
            <p className="ktab-book-page__paragraph">{wordElements}</p>
          </div>

          <div className="ktab-book-page__footer">
            <span className="ktab-book-page__number">{pageNum}</span>
          </div>
        </div>
      );
    },
    [
      bookAuthor,
      pagesCacheRef,
      currentPageIndex,
      currentPageData,
      text,
      wordsPerPage,
      dynamicLineHeight,
      dynamicFontSize,
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
      {(!ready || loading || !currentPage) && (
        <BookPageSkeleton
          theme={theme}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          bookTitle={bookTitle}
        />
      )}
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
