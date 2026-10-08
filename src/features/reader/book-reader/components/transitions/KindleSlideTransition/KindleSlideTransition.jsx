import React from "react";
import "./KindleSlideTransition.css";

/**
 * Isolated Kindle-style slide & fade page transition component.
 */
export function KindleSlideTransition({
  currentPage,
  currentPageIndex,
  isTransitioning,
  transitionDir,
  theme,
  renderContent,
}) {
  if (!currentPage) return null;

  return (
    <div className="ktab-kindle-slide-wrap" dir="rtl">
      <div
        key={currentPageIndex}
        className={`ktab-kindle-slide-page ktab-book-page--${theme} ${
          isTransitioning
            ? transitionDir === "next"
              ? "ktab-kindle-slide-page--shift-next"
              : "ktab-kindle-slide-page--shift-prev"
            : "ktab-kindle-slide-page--active"
        }`}
        dir="rtl"
      >
        {renderContent(currentPage, currentPageIndex + 1)}
      </div>
    </div>
  );
}

export default KindleSlideTransition;
