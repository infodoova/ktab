import React from "react";
import "./DashboardSkeleton.css";

/**
 * Loading skeleton matching reader dashboard layout hierarchy:
 * metrics row, active reading card, and horizontal book shelves.
 */
export function DashboardSkeleton() {
  return (
    <div className="ktab-reader-skeleton" aria-hidden="true" dir="rtl">
      {/* Metrics Row Skeleton */}
      <div className="ktab-reader-skeleton__stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="ktab-reader-skeleton-box ktab-reader-skeleton__stat-card"
          >
            <div
              className="ktab-reader-skeleton-shimmer"
              style={{ width: "45%", height: "0.85rem" }}
            />
            <div
              className="ktab-reader-skeleton-shimmer"
              style={{ width: "60%", height: "2.25rem", margin: "0.5rem 0" }}
            />
            <div
              className="ktab-reader-skeleton-shimmer"
              style={{ width: "35%", height: "0.75rem" }}
            />
          </div>
        ))}
      </div>

      {/* Continue Reading Card Skeleton */}
      <div className="ktab-reader-skeleton-box ktab-reader-skeleton__continue-card">
        <div
          className="ktab-reader-skeleton-shimmer"
          style={{ width: "4.5rem", height: "6rem", borderRadius: "0.75rem", flexShrink: 0 }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            className="ktab-reader-skeleton-shimmer"
            style={{ width: "35%", height: "1.125rem" }}
          />
          <div
            className="ktab-reader-skeleton-shimmer"
            style={{ width: "20%", height: "0.85rem" }}
          />
          <div
            className="ktab-reader-skeleton-shimmer"
            style={{ width: "90%", height: "0.5rem", borderRadius: "9999px" }}
          />
        </div>
      </div>

      {/* Shelf Skeleton */}
      <div className="ktab-reader-skeleton__shelf">
        <div
          className="ktab-reader-skeleton-shimmer"
          style={{ width: "12rem", height: "1.25rem", marginBottom: "0.5rem" }}
        />
        <div className="ktab-reader-skeleton__shelf-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="ktab-reader-skeleton__book-card">
              <div className="ktab-reader-skeleton-shimmer ktab-reader-skeleton__book-cover" />
              <div
                className="ktab-reader-skeleton-shimmer"
                style={{ width: "75%", height: "0.85rem" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
