import React from "react";
import "./PlaySkeleton.css";

/**
 * Full-page loading skeleton for the interactive play session.
 * Mirrors the two-column layout of the actual player.
 */
export function PlaySkeleton() {
  return (
    <div className="play-skeleton">
      <div className="play-skeleton__container">
        {/* Left column */}
        <div>
          <div className="play-skeleton__artwork">
            <div className="play-skeleton__artwork-spinner" />
          </div>
          <div className="play-skeleton__timeline" style={{ marginTop: 16 }}>
            <div className="play-skeleton__timeline-header">
              <div className="play-skeleton__bar play-skeleton__bar--sm" />
              <div className="play-skeleton__bar play-skeleton__bar--sm" />
            </div>
            <div className="play-skeleton__dots">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="play-skeleton__dot" />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="play-skeleton__right">
          <div className="play-skeleton__narrative">
            <div className="play-skeleton__tag" />
            <div className="play-skeleton__bar play-skeleton__bar--lg" />
            <div className="play-skeleton__bar play-skeleton__bar--xl" />
            <div className="play-skeleton__bar play-skeleton__bar--lg" />
            <div className="play-skeleton__bar play-skeleton__bar--80" />
          </div>

          <div className="play-skeleton__choices">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="play-skeleton__choice">
                <div className="play-skeleton__choice-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-page error state for session start failures.
 *
 * @param {string} error - Error message to display
 * @param {() => void} onExit - Handler to navigate back to stories catalog
 */
export function PlayError({ error, onExit }) {
  return (
    <div className="play-error">
      <h2 className="play-error__title">{error || "تعذر بدء الجلسة"}</h2>
      <button className="play-error__btn" onClick={onExit}>
        العودة للقصص التفاعلية
      </button>
    </div>
  );
}

export default PlaySkeleton;
