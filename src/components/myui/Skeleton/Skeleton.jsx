import React from "react";
import "./Skeleton.css";

/**
 * Custom Liquid Glass Shimmer Skeleton Component
 */
export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`ktab-skeleton ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
