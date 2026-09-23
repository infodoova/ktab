import React from "react";
import "./MetricsGrid.css";

/**
 * Editorial auto-responsive grid for MetricCards.
 * Adapts smoothly from mobile (2 columns) to desktop (3 or 4 columns).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - MetricCard items
 * @param {number} [props.columns=4] - Target desktop column count
 * @param {string} [props.className] - Optional extra class
 */
export function MetricsGrid({ children, columns = 4, className = "" }) {
  return (
    <div
      className={`ktab-global-metrics-grid ktab-global-metrics-grid--cols-${columns} ${className}`}
      dir="rtl"
    >
      {children}
    </div>
  );
}

export default MetricsGrid;
