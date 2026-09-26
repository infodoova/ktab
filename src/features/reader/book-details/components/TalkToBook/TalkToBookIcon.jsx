import React from "react";
import brandIconImg from "@/assets/logo/BrandIcon.png";

/**
 * Ktab official brand emblem component for Talk-to-Book.
 * Renders the brand icon with configurable sizing and styling.
 *
 * @param {Object} props
 * @param {number} [props.size=24] - Square dimension in pixels.
 * @param {string} [props.className=""] - Additional CSS class names.
 * @param {string} [props.alt="كتّاب"] - Alternative text description.
 */
export function TalkToBookIcon({ size = 24, className = "", alt = "كتّاب", ...props }) {
  return (
    <img
      src={brandIconImg}
      alt={alt}
      width={size}
      height={size}
      className={`talk-to-book-brand-logo ${className}`.trim()}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        pointerEvents: "none",
        flexShrink: 0,
      }}
      draggable={false}
      aria-hidden="true"
      {...props}
    />
  );
}

export default TalkToBookIcon;
