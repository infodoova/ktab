import React, { useRef, useCallback } from "react";
import "./Flip3DTransition.css";

/**
 * 3D Vertical Upward Sheet Flip Transition Component.
 * - Entire continuous page text without splitting or center dividing seams.
 * - Smooth 3D upward perspective flip on next (swipe up / tap).
 * - Smooth downward roll-in transition on previous (swipe down / tap).
 * - Full responsive touch gesture support for mobile and tablets.
 * - Strictly renders authentic book content without cover backfaces.
 */
export function Flip3DTransition({
  currentPage,
  nextPage,
  prevPage,
  currentPageIndex,
  isTransitioning,
  transitionDir,
  theme,
  renderContent,
}) {
  if (!currentPage) return null;

  return (
    <div className="ktab-vertical-flip-stage" dir="rtl">
      {/* 1. Underlying stationary page layer */}
      {isTransitioning && transitionDir === "next" && currentPage && (
        <div className={`ktab-vertical-page-underlying ktab-book-page--${theme}`}>
          {renderContent(currentPage, currentPageIndex + 1)}
        </div>
      )}

      {isTransitioning && transitionDir === "prev" && nextPage && (
        <div className={`ktab-vertical-page-underlying ktab-book-page--${theme}`}>
          {renderContent(nextPage, currentPageIndex + 2)}
        </div>
      )}

      {/* 2. Top Animated Page Sheet */}
      <div
        className={`ktab-vertical-page-sheet ktab-book-page--${theme} ${
          isTransitioning
            ? transitionDir === "next"
              ? "ktab-vertical-page-sheet--flipping-up"
              : "ktab-vertical-page-sheet--flipping-down"
            : ""
        }`}
      >
        {isTransitioning && transitionDir === "next" && prevPage
          ? renderContent(prevPage, currentPageIndex)
          : renderContent(currentPage, currentPageIndex + 1)}
      </div>
    </div>
  );
}

export default Flip3DTransition;
