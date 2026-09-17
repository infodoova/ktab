import React from "react";
import "./DashboardSkeleton.css";

/**
 * Dashboard skeleton loader for asynchronous dashboard analytics.
 */
export function DashboardSkeleton() {
  return (
    <div className="ktab-dashboard-skeleton" dir="rtl" aria-busy="true">
      {/* 4 Stat Cards Skeleton */}
      <div className="ktab-skeleton-grid-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="ktab-skeleton-box ktab-skeleton-stat-card">
            <div className="ktab-skeleton-shimmer" style={{ width: "5rem", height: "0.875rem" }} />
            <div className="ktab-skeleton-shimmer" style={{ width: "6.5rem", height: "2.75rem", margin: "0.75rem 0" }} />
            <div className="ktab-skeleton-shimmer" style={{ width: "7.5rem", height: "0.75rem" }} />
          </div>
        ))}
      </div>

      {/* 2 Charts Skeleton */}
      <div className="ktab-skeleton-charts-grid">
        <div className="ktab-skeleton-box ktab-skeleton-chart-card">
          <div className="ktab-skeleton-shimmer" style={{ width: "8rem", height: "1.25rem", marginBottom: "0.5rem" }} />
          <div className="ktab-skeleton-shimmer" style={{ width: "12rem", height: "0.875rem", marginBottom: "1.5rem" }} />
          <div className="ktab-skeleton-shimmer" style={{ width: "100%", height: "14rem" }} />
        </div>
        <div className="ktab-skeleton-box ktab-skeleton-chart-card">
          <div className="ktab-skeleton-shimmer" style={{ width: "8rem", height: "1.25rem", marginBottom: "0.5rem" }} />
          <div className="ktab-skeleton-shimmer" style={{ width: "12rem", height: "0.875rem", marginBottom: "1.5rem" }} />
          <div className="ktab-skeleton-shimmer" style={{ width: "100%", height: "14rem" }} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="ktab-skeleton-box ktab-skeleton-table-card">
        <div className="ktab-skeleton-shimmer" style={{ width: "10rem", height: "1.25rem", marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ktab-skeleton-shimmer" style={{ width: "100%", height: "3rem" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
