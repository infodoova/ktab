import React, { memo, useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Palette,
  Check,
  X,
  RotateCcw,
  Maximize,
  Minimize,
} from "lucide-react";
import { FlipboardPage, FlipboardImage } from "./FlipboardPage";
import { FlipboardMobileFold } from "./FlipboardMobileFold";
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
    goToNextPageInstant,
    goToPrevPageInstant,
    isAtLastPage,
    goToPage,
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useFlipboardReader(storyId, initialStory);

  // Native Fullscreen API state & toggle
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    try {
      const doc = document;
      const docEl = document.documentElement;
      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFs) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen({ navigationUI: "hide" }).catch(() => docEl.requestFullscreen());
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle warning:", err);
    }
  }, []);

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
        if (!isVerticalMode) handleTouchStart(e);
      }}
      onTouchEnd={(e) => {
        if (!isVerticalMode) handleTouchEnd(e);
      }}
      onClick={() => {
        if (isGalleryOpen) closeGallery();
      }}
      dir="rtl"
    >
      {/* ------------------------------------------------------------------
          1. Top Floating Row: Back Button & Fullscreen / Theme Controls
          ------------------------------------------------------------------ */}
      <div className="flipboard-floating-top-row">
        {/* Right Corner (RTL): Navigation & Actions Group */}
        <div className="flipboard-floating-nav-group">
          <button
            type="button"
            className="flipboard-floating-back-btn"
            onClick={onExit}
            aria-label="الرجوع للقصص"
            title="الرجوع للقصص"
          >
            <ArrowRight size={22} strokeWidth={2.6} className="flipboard-floating-back-arrow" />
            <span className="flipboard-floating-back-label">الرجوع</span>
          </button>

          <button
            type="button"
            className={`flipboard-floating-fullscreen-btn ${
              isFullscreen ? "flipboard-floating-fullscreen-btn--active" : ""
            }`}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "تصغير الشاشة" : "ملء الشاشة"}
            title={isFullscreen ? "تصغير الشاشة" : "ملء الشاشة"}
          >
            {isFullscreen ? (
              <Minimize size={19} strokeWidth={2.4} />
            ) : (
              <Maximize size={19} strokeWidth={2.4} />
            )}
            <span className="flipboard-floating-fullscreen-label">
              {isFullscreen ? "تصغير" : "ملء الشاشة"}
            </span>
          </button>
        </div>

        {/* Left Corner (RTL): Authentic Theme UI Anchor & Popover (Desktop Only) */}
        {isDualPage && (
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
                            backgroundImage: bg.svg ? `url("${bg.svg}")` : undefined,
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
        )}
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
                <FlipboardImage
                  src={bookCoverImg || bunnyCover}
                  alt={bookTitle}
                  className="flipboard-closed-book-cover-img"
                  loading="eager"
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
            } ${isFlipping ? "flipboard-book-container--flipping" : ""}`}
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
                {displayRightPage && (
                  <FlipboardPage
                    page={displayRightPage}
                    pageIndex={currentPage}
                    totalPages={totalPages}
                  />
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
                      image: bookCoverImg || "",
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
            3. Mode B: Mobile & Vertical iPad (Flipboard-Style Calendar Fold)
            - 100% full screen edge-to-edge
            - 50% horizontal center hinge fold
            - Real-time gesture tracking with 1:1 physics & rubber banding
            - Two 90° phases with sinusoidal lighting & under-shadows
            - Subtle tactile center crease line
            ------------------------------------------------------------------ */
        <main className="flipboard-vertical-stage">
          <FlipboardMobileFold
            pages={pages}
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={goToNextPageInstant}
            goToPrevPage={goToPrevPageInstant}
            isAtLastPage={isAtLastPage}
            selectedBg={selectedBg}
            bookCoverImg={bookCoverImg}
            bookTitle={bookTitle}
          />
        </main>
      )}
    </div>
  );
});

export default FlipboardReader;
