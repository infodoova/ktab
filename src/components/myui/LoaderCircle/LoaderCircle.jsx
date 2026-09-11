import React from "react";
import "./LoaderCircle.css";

export function LoaderCircle({ className = "" }) {
  return (
    <div className={`ktab-loader-container ${className}`}>
      <div className="ktab-loader-spinner" />
    </div>
  );
}

export default LoaderCircle;
