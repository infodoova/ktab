import React, { memo } from "react";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Palette,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { FlipboardPage } from "./FlipboardPage";
import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import { useFlipboardReader } from "../../hooks/useFlipboardReader";
import "./FlipboardReader.css";

/**
 * Ultra-Professional Multi-Mode Flipboard Reader:
 * - PC & iPad Landscape: 3D Dual-Page Horizontal Book on chosen desk background
 * - Mobile & iPad Portrait: Fullscreen Edge-to-Edge Vertical Flipboard with in-page background
 * - End of Story: 3D Book Closing animation with Retry & Exit buttons placed underneath (no buttons on cover)
 * - Authentic Theme UI: Liquid Glass Popover with mini page preview cards (ThemeUI)
 * - Zero page numbers, zero arrows on mobile, zero clutter
 */
export const FlipboardReader = memo(function FlipboardReader({
  storyId,
  initialStory = null,
  onExit,
}) {
  const {
    story,
    loading,
    pages,
    currentPage,
    totalPages,
    isFlipping,
    flipDirection,
    isDualPage,
    isVerticalMode,
    canGoNext,
    canGoPrev,
    isPointerDown,

    // Backgrounds
    availableBackgrounds,
    selectedBgId,
    selectedBg,
    isGalleryOpen,
    selectBackground,
    toggleGallery,
    closeGallery,

    // Closed Book State
    isBookClosed,
    isClosing,
    restartStory,
    bookCoverImg,
    bookTitle,

    // Handlers
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useFlipboardReader(storyId, initialStory);

  if (loading || !story) {
    return (
      <div className="flipboard-reader-loader" dir="rtl">
        <div className="flipboard-reader-loader__spinner" />
        <p className="flipboard-reader-loader__text">جاري فتح الحكاية...</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Continuous, Zero-Flicker Page Mapping
  // ---------------------------------------------------------------------------
  // 1. Dual-Page Mode (PC & iPad Landscape)
  const restingRightPage = pages[currentPage] || pages[0];
  const restingLeftPage =
    currentPage + 1 < totalPages ? pages[currentPage + 1] : null;

  const nextLeafFrontPage = pages[currentPage + 1] || null;
  const nextLeafBackPage = pages[currentPage + 2] || null;
  const nextUnderlyingLeftPage = pages[currentPage + 3] || null;

  const prevLeafFrontPage = pages[currentPage] || null;
  const prevLeafBackPage = currentPage > 0 ? pages[currentPage - 1] : null;
  const prevUnderlyingRightPage = currentPage > 1 ? pages[currentPage - 2] : null;

  const displayRightPage = isFlipping
    ? flipDirection === "prev"
      ? prevUnderlyingRightPage
      : restingRightPage
    : restingRightPage;

  const displayLeftPage = isFlipping
    ? flipDirection === "next"
      ? nextUnderlyingLeftPage
      : restingLeftPage
    : restingLeftPage;

  // 2. Fullscreen Vertical Flipboard Mode (Mobile & iPad Portrait)
  const verticalActivePage = pages[currentPage] || pages[0];
  const verticalNextPage =
    currentPage + 1 < totalPages ? pages[currentPage + 1] : null;
  const verticalPrevPage = currentPage > 0 ? pages[currentPage - 1] : null;

  const verticalUnderPage = isFlipping
    ? flipDirection === "next"
      ? verticalNextPage
      : verticalActivePage
    : verticalActivePage;

  const verticalLeafPage = isFlipping
    ? flipDirection === "next"
      ? verticalActivePage
      : verticalPrevPage
    : null;

  return (
    <div
      className={`flipboard-reader-viewport ${
        isVerticalMode
          ? "flipboard-reader-viewport--vertical"
          : "flipboard-reader-viewport--dual"
      }`}
      style={
        !isVerticalMode || isBookClosed || isClosing
          ? {
              backgroundImage: `url("${selectedBg.svg}")`,
              backgroundColor: selectedBg.accent || "#0a1f1d",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
            }
          : undefined
      }
      onTouchStart={(e) => {
        if (isGalleryOpen) closeGallery();
        handleTouchStart(e);
      }}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (isGalleryOpen) closeGallery();
      }}
      dir="rtl"
    >
      {/* ------------------------------------------------------------------
          1. Top Floating Row: Back Button & Authentic Theme UI Popover
          ------------------------------------------------------------------ */}
      <div className="flipboard-floating-top-row">
        {/* Right Corner (RTL): Back Button */}
        <button
          type="button"
          className="flipboard-floating-back-btn"
          onClick={onExit}
          aria-label="الرجوع للقصص"
          title="الرجوع للقصص"
        >
          <ArrowRight size={18} strokeWidth={2.4} />
          <span>الرجوع</span>
        </button>

        {/* Left Corner (RTL): Authentic Theme UI Anchor & Popover */}
        <div className="flipboard-theme-anchor" dir="rtl">
          <button
            type="button"
            className={`flipboard-floating-theme-btn ${
              isGalleryOpen ? "flipboard-floating-theme-btn--active" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleGallery();
            }}
            aria-label="لون وخلفية الصفحات"
            title="المظهر"
          >
            <Palette size={18} strokeWidth={2.2} />
            <span className="flipboard-floating-theme-label">المظهر</span>
          </button>

          {isGalleryOpen && (
            <div
              className="ktab-glass-popover ktab-theme-popover"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              dir="rtl"
            >
              <div className="ktab-popover-header">
                <div className="ktab-popover-header-row">
                  <span className="ktab-popover-title">لون وخلفية الصفحات</span>
                  <button
                    type="button"
                    className="ktab-popover-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeGallery();
                    }}
                    aria-label="إغلاق"
                  >
                    <X size={15} />
                  </button>
                </div>
                <span className="ktab-popover-subtitle">
                  اختر عالم وخلفية الحكاية المفضلة لديك
                </span>
              </div>

              <div className="ktab-theme-cards-grid">
                {availableBackgrounds.map((bg) => {
                  const isSelected = bg.id === selectedBgId;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      className={`ktab-theme-card-option ${
                        isSelected ? "ktab-theme-card-option--active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectBackground(bg.id);
                        closeGallery();
                      }}
                      title={bg.title}
                    >
                      <div
                        className="ktab-theme-mini-page"
                        style={{
                          backgroundImage: `url("${bg.svg}")`,
                          backgroundColor: bg.accent || "#0a1f1d",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {isSelected && (
                          <div className="ktab-theme-check-badge">
                            <Check size={12} strokeWidth={3.5} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. Closed Book Scene (Triggered on Reaching the End)
          - 3D Book Closing Animation
          - Book cover artwork completely filled in it
          - Retry and Exit buttons placed strictly UNDER it (no buttons on cover)
          ------------------------------------------------------------------ */}
      {(isBookClosed || isClosing) ? (
        <main
          className={`flipboard-closed-stage ${
            isClosing
              ? "flipboard-closed-stage--closing"
              : "flipboard-closed-stage--settled"
          }`}
        >
          <div className="flipboard-closed-book-wrapper">
            {/* 3D Closed Hardcover Book */}
            <div className="flipboard-closed-book-3d">
              {/* 3D Spine Edge for realism */}
              <div className="flipboard-closed-book-spine" />
              {/* Paper Stack Edge */}
              <div className="flipboard-closed-book-pages-edge" />
              {/* Front Cover Filled With Artwork */}
              <div className="flipboard-closed-book-front">
                <img
                  src={bookCoverImg || bunnyCover}
                  alt={bookTitle}
                  className="flipboard-closed-book-cover-img"
                  onError={(e) => {
                    if (e.currentTarget.src !== bunnyCover) {
                      e.currentTarget.src = bunnyCover;
                    }
                  }}
                  loading="eager"
                  decoding="sync"
                />
              </div>
            </div>

            {/* Actions Row: Strictly UNDER the closed book, zero overlap on cover */}
            <div className="flipboard-closed-actions">
              <button
                type="button"
                className="flipboard-closed-btn flipboard-closed-btn--retry"
                onClick={restartStory}
                aria-label="إعادة القراءة"
                title="إعادة قراءة الحكاية من البداية"
              >
                <RotateCcw size={17} strokeWidth={2.4} />
                <span>إعادة القراءة</span>
              </button>

              <button
                type="button"
                className="flipboard-closed-btn flipboard-closed-btn--exit"
                onClick={onExit}
                aria-label="العودة للقصص"
                title="الخروج إلى قائمة القصص"
              >
                <ArrowRight size={17} strokeWidth={2.4} />
                <span>العودة للقصص</span>
              </button>
            </div>
          </div>
        </main>
      ) : isDualPage ? (
        <main className="flipboard-stage">
          {/* Side Prev Arrow */}
          <button
            type="button"
            className={`flipboard-arrow-btn flipboard-arrow-btn--prev ${
              !canGoPrev ? "flipboard-arrow-btn--hidden" : ""
            }`}
            onClick={goToPrevPage}
            disabled={!canGoPrev || isFlipping}
            aria-label="الصفحة السابقة"
            title="الصفحة السابقة"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          {/* 3D Dual Book */}
          <div
            className={`flipboard-book-container flipboard-book-container--dual ${
              isPointerDown ? "flipboard-book-container--dragging" : ""
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flipboard-dual-spread">
              {/* Right Page (In RTL: Previous Page on Click) */}
              <div
                className={`flipboard-dual-pane flipboard-dual-pane--right ${
                  canGoPrev ? "flipboard-dual-pane--interactive" : ""
                }`}
                onClick={(e) => {
                  if (e.target.closest("button") || e.target.closest("a")) return;
                  if (canGoPrev) goToPrevPage();
                }}
                title={canGoPrev ? "انقر للرجوع للصفحة السابقة" : undefined}
              >
                {displayRightPage ? (
                  <FlipboardPage
                    page={displayRightPage}
                    pageIndex={currentPage}
                    totalPages={totalPages}
                  />
                ) : (
                  <div className="flipboard-dual-empty-back">
                    <span className="flipboard-dual-empty-brand">كتاب</span>
                  </div>
                )}
              </div>

              {/* Center Spine Crease */}
              <div className="flipboard-spine-crease" aria-hidden="true" />

              {/* Left Page (In RTL: Next Page on Click) */}
              <div
                className={`flipboard-dual-pane flipboard-dual-pane--left ${
                  canGoNext ? "flipboard-dual-pane--interactive" : ""
                }`}
                onClick={(e) => {
                  if (e.target.closest("button") || e.target.closest("a")) return;
                  if (canGoNext) goToNextPage();
                }}
                title={canGoNext ? "انقر للتقدم للصفحة التالية" : undefined}
              >
                {displayLeftPage ? (
                  <FlipboardPage
                    page={displayLeftPage}
                    pageIndex={currentPage + 1}
                    totalPages={totalPages}
                  />
                ) : (
                  <FlipboardPage
                    page={{
                      type: "cover",
                      image: bookCoverImg || bunnyCover,
                      title: bookTitle,
                    }}
                    pageIndex={currentPage + 1}
                    totalPages={totalPages}
                  />
                )}
              </div>

              {/* 3D Horizontal Flip Leaf Layer */}
              {isFlipping && (
                <div
                  className={`flipboard-leaf-3d flipboard-leaf-3d--${flipDirection}`}
                >
                  <div className="flipboard-leaf-face flipboard-leaf-face--front">
                    <FlipboardPage
                      page={
                        flipDirection === "next"
                          ? nextLeafFrontPage
                          : prevLeafFrontPage
                      }
                      pageIndex={currentPage}
                      totalPages={totalPages}
                    />
                    <div className="flipboard-shadow-overlay" />
                  </div>
                  <div className="flipboard-leaf-face flipboard-leaf-face--back">
                    <FlipboardPage
                      page={
                        flipDirection === "next"
                          ? nextLeafBackPage
                          : prevLeafBackPage
                      }
                      pageIndex={currentPage + 1}
                      totalPages={totalPages}
                    />
                    <div className="flipboard-shadow-overlay" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Next Arrow */}
          <button
            type="button"
            className={`flipboard-arrow-btn flipboard-arrow-btn--next ${
              !canGoNext ? "flipboard-arrow-btn--hidden" : ""
            }`}
            onClick={goToNextPage}
            disabled={!canGoNext || isFlipping}
            aria-label="الصفحة التالية"
            title="الصفحة التالية"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
        </main>
      ) : (
        /* ------------------------------------------------------------------
            3. Mode B: Mobile & iPad Portrait (Fullscreen Vertical Flipboard)
            - 100% full screen edge-to-edge (no margins, no desk, no white box)
            - Background is inside the page itself
            - Pure vertical flip motion
            - Zero page numbers, zero arrows
            ------------------------------------------------------------------ */
        <main
          className="flipboard-vertical-stage"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Fullscreen Vertical Container */}
          <div
            className="flipboard-vertical-container"
            onClick={(e) => {
              if (e.target.closest("button") || e.target.closest("a")) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clickY = e.clientY - rect.top;
              // Clicking bottom 50% moves next; clicking top 50% moves prev
              if (clickY > rect.height * 0.5) {
                if (canGoNext) goToNextPage();
              } else {
                if (canGoPrev) goToPrevPage();
              }
            }}
          >
            {/* Fullscreen Edge-to-Edge Page with Selected Background */}
            <div
              className="flipboard-vertical-page-wrapper"
              style={{
                backgroundImage: `url("${selectedBg.svg}")`,
                backgroundColor: selectedBg.accent || "#0a1f1d",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
              }}
            >
              <FlipboardPage
                page={verticalUnderPage}
                pageIndex={currentPage}
                totalPages={totalPages}
                isVerticalFullscreen={true}
              />
            </div>

            {/* 3D Vertical Flip Leaf */}
            {isFlipping && verticalLeafPage && (
              <div
                className={`flipboard-vertical-leaf-3d flipboard-vertical-leaf-3d--${flipDirection}`}
                style={{
                  backgroundImage: `url("${selectedBg.svg}")`,
                  backgroundColor: selectedBg.accent || "#0a1f1d",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center bottom",
                }}
              >
                <FlipboardPage
                  page={verticalLeafPage}
                  pageIndex={currentPage}
                  totalPages={totalPages}
                  isVerticalFullscreen={true}
                />
                <div className="flipboard-vertical-shadow" />
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
});

export default FlipboardReader;
