import React from "react";
import "./TransitionModeIcon.css";

/**
 * CurlModeIcon (ورق واقعي)
 * Authentic 3D paper curl: dimensional book page with realistic peeling leaf,
 * bound spine detail, revealed underpage, and curved typography rhythm lines.
 */
export function CurlModeIcon({ size = 52, className = "", ...props }) {
  return (
    <svg
      className={`ktab-transition-icon ktab-transition-icon--curl ${className}`}
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Revealed page underneath the peeled corner */}
      <path
        d="M24 42H37C38.6569 42 40 40.6569 40 39V26L24 42Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path
        d="M31 42H37C38.6569 42 40 40.6569 40 39V33"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
      />
      <line
        x1="33"
        y1="37"
        x2="38"
        y2="37"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Main Bound Base Sheet */}
      <path
        d="M14 7H37C38.6569 7 40 8.34315 40 10V26L24 42H14C12.3431 42 11 40.6569 11 39V10C11 8.34315 12.3431 7 14 7Z"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Bound Spine Hinge & Stitch Details */}
      <rect
        x="11"
        y="7"
        width="3.5"
        height="35"
        rx="1.75"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <line
        x1="14.5"
        y1="9"
        x2="14.5"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        opacity="0.3"
      />

      {/* Editorial Content Lines on Main Page */}
      <line
        x1="18.5"
        y1="13.5"
        x2="34"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <line
        x1="18.5"
        y1="19"
        x2="33"
        y2="19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="18.5"
        y1="24.5"
        x2="30"
        y2="24.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="18.5"
        y1="30"
        x2="26"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
      />
      <line
        x1="18.5"
        y1="35.5"
        x2="21.5"
        y2="35.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* 3D Realistic Peeling Leaf (Folded Underpage & Cylindrical Ridge) */}
      <g className="ktab-icon-curl-leaf">
        {/* Soft shadow cast by the curl */}
        <path
          d="M24 42C29 42 36.5 37.5 40 26C35 29.5 28 36.5 24 42Z"
          fill="currentColor"
          fillOpacity="0.24"
        />
        {/* The curled flap underside */}
        <path
          d="M24 42C27.5 42 36 37 40 26C35 29 28.5 36 24 42Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Ridge highlight reflecting light on paper bend */}
        <path
          d="M26.5 40.5C31 36.5 35.5 32 38.5 27.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>
    </svg>
  );
}

/**
 * Flip3DModeIcon (تقليب رأسي)
 * Vertical 3D page flip: top-bound notebook with rings,
 * lifting upper sheet in 3D perspective, lower destination sheet, and kinetic vertical flow.
 */
export function Flip3DModeIcon({ size = 52, className = "", ...props }) {
  return (
    <svg
      className={`ktab-transition-icon ktab-transition-icon--flip3d ${className}`}
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Lower Destination Page (revealed below) */}
      <rect
        x="13"
        y="14"
        width="26"
        height="28"
        rx="3.5"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Editorial Content Lines on Lower Page */}
      <line
        x1="18"
        y1="28"
        x2="34"
        y2="28"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="18"
        y1="33.5"
        x2="32"
        y2="33.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line
        x1="18"
        y1="38"
        x2="26"
        y2="38"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Top Spiral/Pad Binding Bar */}
      <rect
        x="13"
        y="7"
        width="26"
        height="5.5"
        rx="2"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* 3 Minimalist Binding Loops */}
      <circle cx="18" cy="9.75" r="1.25" fill="currentColor" opacity="0.85" />
      <circle cx="26" cy="9.75" r="1.25" fill="currentColor" opacity="0.85" />
      <circle cx="34" cy="9.75" r="1.25" fill="currentColor" opacity="0.85" />

      {/* 3D Lifting Upper Page in Perspective */}
      <g className="ktab-icon-flip-top-sheet">
        {/* Tilted page face in perspective */}
        <path
          d="M14 12.5L12 22C17 18.5 35 18.5 40 22L38 12.5H14Z"
          fill="currentColor"
          fillOpacity="0.14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Curled roll underside */}
        <path
          d="M12 22C17 25 35 25 40 22C35 19 17 19 12 22Z"
          fill="currentColor"
          fillOpacity="0.26"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Foreshortened text line on lifted sheet */}
        <line
          x1="17"
          y1="16"
          x2="35"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>

      {/* Elegant Side Vertical Kinetic Arc Indicators */}
      <path
        d="M8.5 29C7.5 23.5 7.5 19.5 9.5 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M7.5 17.5L9.5 15.5L11.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M43.5 29C44.5 23.5 44.5 19.5 42.5 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M40.5 17.5L42.5 15.5L44.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

/**
 * SlideModeIcon (انزلاق أفقي)
 * Continuous horizontal slide: dual layered sheets gliding laterally,
 * prominent active card, trailing upcoming sheet, and lateral velocity streaks.
 */
export function SlideModeIcon({ size = 52, className = "", ...props }) {
  return (
    <svg
      className={`ktab-transition-icon ktab-transition-icon--slide ${className}`}
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Rear Incoming Sheet (offset to trailing side) */}
      <g className="ktab-icon-slide-rear-sheet">
        <rect
          x="21"
          y="9"
          width="21"
          height="32"
          rx="3.5"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity="0.45"
        />
        {/* Faint editorial lines peeking through */}
        <line
          x1="26"
          y1="15"
          x2="37"
          y2="15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.3"
        />
        <line
          x1="26"
          y1="20"
          x2="35"
          y2="20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.25"
        />
        <line
          x1="26"
          y1="25"
          x2="32"
          y2="25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.2"
        />
      </g>

      {/* Front Active Gliding Sheet */}
      <g className="ktab-icon-slide-front-sheet">
        <rect
          x="9"
          y="7"
          width="22"
          height="35"
          rx="3.8"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        {/* Crisp Typography Layout on Front Sheet */}
        <line
          x1="14"
          y1="13"
          x2="25"
          y2="13"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1="14"
          y1="18.5"
          x2="26"
          y2="18.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />
        <line
          x1="14"
          y1="23.5"
          x2="24"
          y2="23.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.45"
        />
        <line
          x1="14"
          y1="28.5"
          x2="26"
          y2="28.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.35"
        />
        <line
          x1="14"
          y1="33.5"
          x2="20"
          y2="33.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.25"
        />
      </g>

      {/* Kinetic Lateral Gliding Motion Streaks */}
      <line
        x1="33"
        y1="36"
        x2="43"
        y2="36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <line
        x1="36"
        y1="40"
        x2="41"
        y2="40"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Leading Edge Glide Chevron */}
      <path
        d="M5.5 24.5H3.5M3.5 24.5L5.5 22.5M3.5 24.5L5.5 26.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * Unified TransitionModeIcon Component
 * Renders the designated transition mode illustration based on mode ID.
 */
export function TransitionModeIcon({ mode = "curl", size = 52, className = "", ...props }) {
  switch (mode) {
    case "curl":
      return <CurlModeIcon size={size} className={className} {...props} />;
    case "flip3d":
      return <Flip3DModeIcon size={size} className={className} {...props} />;
    case "slide":
      return <SlideModeIcon size={size} className={className} {...props} />;
    default:
      return <CurlModeIcon size={size} className={className} {...props} />;
  }
}

export default TransitionModeIcon;
