import React from "react";
import "./Badge.css";

/**
 * Custom Liquid Glass Badge Component
 */
export function Badge({
  children,
  variant = "glass", // "mint" | "amber" | "sky" | "purple" | "glass" | "danger"
  size = "sm", // "sm" | "md"
  dot = false,
  className = "",
  ...props
}) {
  const sizeClass = size === "md" ? "ktab-badge--md" : "ktab-badge--sm";
  const variantClass = `ktab-badge--${variant}`;

  return (
    <span
      className={`ktab-badge ${sizeClass} ${variantClass} ${className}`}
      dir="rtl"
      {...props}
    >
      {dot && <span className="ktab-badge__dot" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
