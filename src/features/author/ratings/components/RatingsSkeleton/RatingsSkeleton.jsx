import React from "react";
import "./RatingsSkeleton.css";

/**
 * Pure presentation shimmer loader for Author Ratings page.
 */
export function RatingsSkeleton() {
  return (
    <div className="ktab-ratings-skeleton" dir="rtl">
      {/* Metrics Summary Skeleton */}
      <div className="ktab-ratings-skeleton__section">
        <div className="ktab-ratings-skeleton__header-line" />
        <div className="ktab-ratings-skeleton__metrics-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ktab-ratings-skeleton__metric-card">
              <div className="ktab-ratings-skeleton__metric-top">
                <div className="ktab-ratings-skeleton__metric-title" />
                <div className="ktab-ratings-skeleton__metric-icon" />
              </div>
              <div className="ktab-ratings-skeleton__metric-value" />
              <div className="ktab-ratings-skeleton__metric-footer" />
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List Skeleton */}
      <div className="ktab-ratings-skeleton__section">
        <div className="ktab-ratings-skeleton__header-line" />
        <div className="ktab-ratings-skeleton__feed">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ktab-ratings-skeleton__review-card">
              <div className="ktab-ratings-skeleton__review-top">
                <div className="ktab-ratings-skeleton__reviewer">
                  <div className="ktab-ratings-skeleton__avatar" />
                  <div className="ktab-ratings-skeleton__reviewer-meta">
                    <div className="ktab-ratings-skeleton__reviewer-name" />
                    <div className="ktab-ratings-skeleton__reviewer-date" />
                  </div>
                </div>
                <div className="ktab-ratings-skeleton__rating-badge" />
              </div>
              <div className="ktab-ratings-skeleton__review-body" />
              <div className="ktab-ratings-skeleton__review-body-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RatingsSkeleton;
