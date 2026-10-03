import React, { memo, useRef } from "react";
import { FlipboardPage } from "./FlipboardPage";
import { useFlipboardMobileFold } from "../../hooks/useFlipboardMobileFold";
import "./FlipboardMobileFold.css";

/**
 * Reusable half-page viewport slice:
 * - Clips exactly 50% of the screen height (top or bottom)
 * - Renders FlipboardPage at 200% height to preserve 1:1 image and text geometry
 * - Subpixel compensation (calc(50% + 0.5px)) prevents 1px line cracks on high-DPI screens
 */
const HalfPage = memo(function HalfPage({
  page,
  half,
  pageIndex,
  totalPages,
  selectedBg,
}) {
  if (!page) return null;

  return (
    <div
      className={`flipboard-half-clip flipboard-half-clip--${half}`}
      aria-hidden="true"
    >
      <div
        className={`flipboard-half-inner flipboard-half-inner--${half}`}
        style={{
          backgroundImage: selectedBg?.svg ? `url("${selectedBg.svg}")` : undefined,
          backgroundColor: selectedBg?.accent || "#0a1f1d",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      >
        <FlipboardPage
          page={page}
          pageIndex={pageIndex}
          totalPages={totalPages}
          isVerticalFullscreen={true}
        />
      </div>
    </div>
  );
});

/**
 * FlipboardMobileFold:
 * Physics-based 3D calendar fold reader for mobile and vertical iPad:
 * - Unified base layers (zero remount flash on navigation completion)
 * - Strict two-phase 90° face switching (eliminates 100% of z-fighting & inverted text)
 * - Hardware-accelerated GPU 3D transforms with will-change
 * - Fluid touch scrolling and zero-latency tap navigation
 * - Subtle tactile center crease line
 */
export const FlipboardMobileFold = memo(function FlipboardMobileFold({
  pages,
  currentPage,
  totalPages,
  goToNextPage,
  goToPrevPage,
  isAtLastPage,
  onCloseStory,
  selectedBg,
}) {
  const containerRef = useRef(null);

  const {
    foldDirection,
    angle,
    isDragging,
    isAnimating,
    shadowOpacity,
    underShadowOpacity,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onWheel,
    onTapScreen,
  } = useFlipboardMobileFold({
    currentPage,
    totalPages,
    onNext: goToNextPage,
    onPrev: goToPrevPage,
    isAtLastPage,
    onCloseStory,
  });

  const currentPageData = pages[currentPage] || null;
  const nextPageData =
    currentPage < totalPages - 1 ? pages[currentPage + 1] : currentPageData;
  const prevPageData = currentPage > 0 ? pages[currentPage - 1] : currentPageData;

  const isFolding = foldDirection !== null;
  // Phase 1 (0° to 90°): Front face pointing at camera
  // Phase 2 (90° to 180°): Back face pointing at camera
  const isPhase1 = angle < 90;

  const handleClick = (e) => {
    // Ignore interactive element clicks
    if (e.target.closest("button") || e.target.closest("a")) return;
    if (isDragging || isAnimating) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickY = e.clientY - rect.top;
    onTapScreen(clickY, rect.height);
  };

  return (
    <div
      ref={containerRef}
      className={`flipboard-fold-stage ${
        isDragging ? "flipboard-fold-stage--dragging" : ""
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
      onClick={handleClick}
    >
      {/* ------------------------------------------------------------------
          1. Static Base Half Layers (Always present to ensure 0ms remount flash)
          - Upper base: Shows current page top, or previous page top when folding down
          - Lower base: Shows current page bottom, or next page bottom when folding up
          ------------------------------------------------------------------ */}
      <div className="flipboard-fold-base flipboard-fold-base--top">
        <HalfPage
          page={foldDirection === "prev" ? prevPageData : currentPageData}
          half="top"
          pageIndex={foldDirection === "prev" ? currentPage - 1 : currentPage}
          totalPages={totalPages}
          selectedBg={selectedBg}
        />
        {/* Under-shadow cast by the moving flap */}
        {isFolding && (
          <div
            className={`flipboard-fold-under-shadow ${
              foldDirection === "next"
                ? "flipboard-fold-under-shadow--top"
                : "flipboard-fold-under-shadow--hinge-top"
            }`}
            style={{
              opacity:
                foldDirection === "next"
                  ? underShadowOpacity
                  : underShadowOpacity * 0.7,
            }}
          />
        )}
      </div>

      <div className="flipboard-fold-base flipboard-fold-base--bottom">
        <HalfPage
          page={foldDirection === "next" ? nextPageData : currentPageData}
          half="bottom"
          pageIndex={foldDirection === "next" ? currentPage + 1 : currentPage}
          totalPages={totalPages}
          selectedBg={selectedBg}
        />
        {/* Under-shadow cast by the moving flap */}
        {isFolding && (
          <div
            className={`flipboard-fold-under-shadow ${
              foldDirection === "next"
                ? "flipboard-fold-under-shadow--hinge-bottom"
                : "flipboard-fold-under-shadow--bottom"
            }`}
            style={{
              opacity:
                foldDirection === "next"
                  ? underShadowOpacity * 0.7
                  : underShadowOpacity,
            }}
          />
        )}
      </div>

      {/* ------------------------------------------------------------------
          2. Moving 3D Flap (Active only during user drag or page turn animation)
          - Swipe UP ('next'): Bottom half folds up over top half (0° -> 180°)
          - Swipe DOWN ('prev'): Top half folds down over bottom half (0° -> -180°)
          ------------------------------------------------------------------ */}
      {isFolding && (
        <div className="flipboard-fold-3d-scene">
          <div
            className={`flipboard-fold-flap flipboard-fold-flap--${foldDirection}`}
            style={{
              transform:
                foldDirection === "next"
                  ? `rotateX(${angle}deg)`
                  : `rotateX(${-angle}deg)`,
            }}
          >
            {/* Phase 1 (0° to 90°): Front Face */}
            <div
              className="flipboard-flap-face flipboard-flap-face--front"
              style={{
                display: isPhase1 ? "block" : "none",
                pointerEvents: isPhase1 ? "auto" : "none",
              }}
            >
              <HalfPage
                page={currentPageData}
                half={foldDirection === "next" ? "bottom" : "top"}
                pageIndex={currentPage}
                totalPages={totalPages}
                selectedBg={selectedBg}
              />
              <div
                className="flipboard-flap-shade"
                style={{ opacity: shadowOpacity }}
              />
            </div>

            {/* Phase 2 (90° to 180°): Back Face */}
            <div
              className={`flipboard-flap-face flipboard-flap-face--back-${foldDirection}`}
              style={{
                display: !isPhase1 ? "block" : "none",
                pointerEvents: !isPhase1 ? "auto" : "none",
              }}
            >
              <HalfPage
                page={foldDirection === "next" ? nextPageData : prevPageData}
                half={foldDirection === "next" ? "top" : "bottom"}
                pageIndex={
                  foldDirection === "next" ? currentPage + 1 : currentPage - 1
                }
                totalPages={totalPages}
                selectedBg={selectedBg}
              />
              <div
                className="flipboard-flap-shade"
                style={{ opacity: shadowOpacity }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          3. Subtle Center Crease Line (Visual tactile spine at 50% height)
          ------------------------------------------------------------------ */}
      <div className="flipboard-fold-crease" aria-hidden="true" />
    </div>
  );
});

export default FlipboardMobileFold;
