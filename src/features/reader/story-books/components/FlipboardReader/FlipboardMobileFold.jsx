import React, { memo, useRef } from "react";
import { FlipboardPage } from "./FlipboardPage";
import { useFlipboardMobileFold } from "../../hooks/useFlipboardMobileFold";
import "./FlipboardMobileFold.css";

/**
 * MobilePageSlot:
 * Displays one complete 1:1 page in either the top or bottom 50% half of the screen.
 * - Top Half: Page N (e.g. Page 1)
 * - Bottom Half: Page N+1 (e.g. Page 2)
 * Both visible simultaneously on mobile (2 pages per screen).
 */
const MobilePageSlot = memo(function MobilePageSlot({
  page,
  pageIndex,
  totalPages,
  position = "top",
}) {
  if (!page) {
    return (
      <div className={`flipboard-mobile-slot flipboard-mobile-slot--${position}`} aria-hidden="true" />
    );
  }

  return (
    <div
      className={`flipboard-mobile-slot flipboard-mobile-slot--${position}`}
      aria-hidden="true"
    >
      <div className="flipboard-mobile-slot__inner">
        <FlipboardPage
          page={page}
          pageIndex={pageIndex}
          totalPages={totalPages}
          isMobileSlot={true}
          slotPosition={position}
        />
      </div>
    </div>
  );
});

/**
 * FlipboardMobileFold:
 * Physics-based 3D calendar fold reader for mobile and vertical iPad:
 * - 2 pages per screen on mobile (Top Page & Bottom Page)
 * - Strict two-phase 90° face switching during calendar fold
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
  bookCoverImg = "",
  bookTitle = "",
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

  // Resolve page or cover fallback
  const getPage = (index) => {
    if (index >= 0 && index < totalPages) return pages[index];
    if (index === totalPages && totalPages % 2 !== 0) {
      return {
        type: "cover",
        image: bookCoverImg || "",
        title: bookTitle,
      };
    }
    return null;
  };

  const isFolding = foldDirection !== null;
  // Phase 1 (0° to 90°): Front face pointing at camera
  // Phase 2 (90° to 180°): Back face pointing at camera
  const isPhase1 = angle < 90;

  // Lock base page reference during an active fold to eliminate 1-frame race condition jumps
  const foldPageRef = useRef(currentPage);
  if (!isFolding) {
    foldPageRef.current = currentPage;
  }
  const basePage = foldPageRef.current;

  const currentTop = getPage(basePage);
  const currentBottom = getPage(basePage + 1);

  const nextTop = getPage(basePage + 2);
  const nextBottom = getPage(basePage + 3);

  const prevTop = getPage(basePage - 2);
  const prevBottom = getPage(basePage - 1);

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
      style={{
        backgroundImage: selectedBg?.svg ? `url("${selectedBg.svg}")` : undefined,
        backgroundColor: selectedBg?.accent || "#0a1f1d",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
          1. Static Base Layers (Always present for 0ms flash)
          - Upper Base: Current top page (or previous top page when folding down)
          - Lower Base: Current bottom page (or next bottom page when folding up)
          ------------------------------------------------------------------ */}
      <div className="flipboard-fold-base flipboard-fold-base--top">
        <MobilePageSlot
          page={foldDirection === "prev" ? prevTop : currentTop}
          pageIndex={foldDirection === "prev" ? basePage - 2 : basePage}
          totalPages={totalPages}
          position="top"
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
        <MobilePageSlot
          page={foldDirection === "next" ? nextBottom : currentBottom}
          pageIndex={foldDirection === "next" ? basePage + 3 : basePage + 1}
          totalPages={totalPages}
          position="bottom"
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
          2. Moving 3D Flap (Active only during user drag or fold animation)
          - Swipe UP ('next'): Bottom flap folds up over top half (0° -> 180°)
          - Swipe DOWN ('prev'): Top flap folds down over bottom half (0° -> -180°)
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
              <MobilePageSlot
                page={foldDirection === "next" ? currentBottom : currentTop}
                pageIndex={foldDirection === "next" ? basePage + 1 : basePage}
                totalPages={totalPages}
                position={foldDirection === "next" ? "bottom" : "top"}
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
              <MobilePageSlot
                page={foldDirection === "next" ? nextTop : prevBottom}
                pageIndex={foldDirection === "next" ? basePage + 2 : basePage - 1}
                totalPages={totalPages}
                position={foldDirection === "next" ? "top" : "bottom"}
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
          3. Center Crease Line (Visual tactile spine at 50% height)
          ------------------------------------------------------------------ */}
      <div className="flipboard-fold-crease" aria-hidden="true" />
    </div>
  );
});

export default FlipboardMobileFold;
