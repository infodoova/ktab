import React from "react";
import "./StoriesSkeleton.css";

/**
 * Editorial Apple Shimmer Skeleton Loader for Interactive Stories.
 */
export function StoriesSkeleton({ count = 8, showHero = false }) {
  return (
    <div className="ktab-stories-skeleton" dir="rtl" aria-hidden="true">
      {showHero && (
        <div className="ktab-stories-skeleton__hero">
          <div className="ktab-stories-skeleton__hero-content">
            <div className="ktab-stories-skeleton__pill" />
            <div className="ktab-stories-skeleton__title" />
            <div className="ktab-stories-skeleton__desc" />
            <div className="ktab-stories-skeleton__btn" />
          </div>
          <div className="ktab-stories-skeleton__hero-artwork" />
        </div>
      )}

      <div className="ktab-stories-skeleton__grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="ktab-stories-skeleton__card">
            <div className="ktab-stories-skeleton__card-cover" />
            <div className="ktab-stories-skeleton__card-genre" />
            <div className="ktab-stories-skeleton__card-title" />
            <div className="ktab-stories-skeleton__card-desc" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesSkeleton;
