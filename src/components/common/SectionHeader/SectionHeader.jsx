import React from "react";
import PropTypes from "prop-types";
import "./SectionHeader.css";

/**
 * Reusable Standalone SectionHeader Component (Strictly 2 sentences, same medium size).
 * Matches user's exact specification:
 * - Line 1: Squircle Icon + Sentence 1 (medium size, semi-bold gray)
 * - Line 2: Sentence 2 (same medium size, extra bold black)
 * Zero 3rd sentence description.
 */
export default function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  align = "start",
  theme = "light",
  className = "",
}) {
  return (
    <div
      className={`ktab-section-header ktab-header-${align} ktab-header-${theme} ${className}`}
      dir="rtl"
    >
      {/* 1. Sentence 1 with Squircle Icon (Same Medium Size) */}
      {(Icon || eyebrow) && (
        <div className="ktab-header-eyebrow-row">
          {Icon && (
            <div className="ktab-header-icon-box" aria-hidden="true">
              {React.isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon size={20} strokeWidth={2} className="ktab-header-icon" />
              )}
            </div>
          )}
          {eyebrow && <span className="ktab-header-eyebrow">{eyebrow}</span>}
        </div>
      )}

      {/* 2. Sentence 2 (Same Medium Size, Bold Headline) */}
      {title && <h2 className="ktab-header-title">{title}</h2>}
    </div>
  );
}

SectionHeader.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  eyebrow: PropTypes.node,
  title: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["start", "center", "end"]),
  theme: PropTypes.oneOf(["light", "dark"]),
  className: PropTypes.string,
};
