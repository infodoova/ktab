import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";
import "./OptionTooltip.css";

/**
 * Editorial Apple / Eleven Reader Viewport-Aware Option & Field Tooltip.
 * 
 * - Desktop: Smooth floating popover with viewport clamping and automatic flip.
 * - Mobile & Touch (≤768px): Resilient press/tap activation opening a bottom sheet
 *   with backdrop scrim, explicit close button, and zero accidental parent-triggering.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.text - Tooltip description or explanatory content
 * @param {string} [props.label] - Title or label of the option/field
 * @param {React.ReactNode} [props.icon] - Custom icon (defaults to <Info size={14} />)
 * @param {number} [props.iconSize=14] - Trigger icon size
 * @param {string} [props.className] - Additional wrapper class name
 * @param {string} [props.ariaLabel] - Accessibility label
 */
export function OptionTooltip({
  text,
  label = "معلومات إضافية",
  icon,
  iconSize = 14,
  className = "",
  ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({});
  const [showBelow, setShowBelow] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const isTouchRef = useRef(false);

  // Detect touch devices and listen for screen resize / orientation changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    isTouchRef.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const mql = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mql.matches);
    mql.addEventListener("change", handleMediaChange);

    return () => {
      mql.removeEventListener("change", handleMediaChange);
    };
  }, []);

  /**
   * Computes fixed positioning for desktop popover clamped to viewport bounds.
   */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || window.innerWidth <= 768) {
      setPopoverStyle({});
      setShowBelow(false);
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flipBelow = spaceAbove < 120 && spaceBelow > spaceAbove;
    setShowBelow(flipBelow);

    const triggerCenterX = rect.left + rect.width / 2;
    const estimatedWidth = 270;
    const halfWidth = estimatedWidth / 2;
    const padding = 16;

    // Clamp horizontally within viewport
    const minX = halfWidth + padding;
    const maxX = window.innerWidth - halfWidth - padding;
    const clampedX = Math.max(minX, Math.min(triggerCenterX, maxX));

    if (flipBelow) {
      setPopoverStyle({
        position: "fixed",
        top: `${rect.bottom + 8}px`,
        left: `${clampedX}px`,
        transform: "translateX(-50%)",
      });
    } else {
      setPopoverStyle({
        position: "fixed",
        bottom: `${window.innerHeight - rect.top + 8}px`,
        left: `${clampedX}px`,
        transform: "translateX(-50%)",
      });
    }
  }, []);

  // Handle Press / Click (Works reliably on mobile touch and desktop click)
  const handleToggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setIsOpen((prev) => {
        const next = !prev;
        if (next) {
          requestAnimationFrame(updatePosition);
        }
        return next;
      });
    },
    [updatePosition]
  );

  // Desktop Hover handlers (strictly disabled on touch to avoid double-triggering)
  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current || window.innerWidth <= 768) return;
    setIsOpen(true);
    requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current || window.innerWidth <= 768) return;
    setIsOpen(false);
  }, []);

  // Outside click, escape key, and scroll dismissals
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointer = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScroll = (e) => {
      // Don't close if user is scrolling inside the mobile sheet text
      if (popoverRef.current && popoverRef.current.contains(e.target)) return;
      // Close on desktop page scroll
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  if (!text) return null;

  return (
    <span
      className={`ktab-option-tooltip-wrap ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`ktab-option-tooltip-trigger ${isOpen ? "is-active" : ""}`}
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel || label}
        aria-expanded={isOpen}
      >
        {icon || <Info size={iconSize} strokeWidth={2.2} />}
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Mobile backdrop scrim */}
            {isMobile && (
              <div
                className="ktab-option-tooltip-backdrop"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                aria-hidden="true"
              />
            )}

            {/* Tooltip Content Popover / Mobile Bottom Sheet */}
            <div
              ref={popoverRef}
              role="tooltip"
              className={`ktab-option-tooltip-popover ${
                showBelow
                  ? "ktab-option-tooltip-popover--below"
                  : "ktab-option-tooltip-popover--above"
              } ${isMobile ? "ktab-option-tooltip-popover--mobile" : ""}`}
              style={!isMobile ? popoverStyle : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ktab-option-tooltip-inner">
                {isMobile && (
                  <div className="ktab-option-tooltip-header">
                    <span className="ktab-option-tooltip-title">{label}</span>
                    <button
                      type="button"
                      className="ktab-option-tooltip-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      aria-label="إغلاق التلميح"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="ktab-option-tooltip-body">{text}</div>
              </div>
            </div>
          </>,
          document.body
        )}
    </span>
  );
}

export default OptionTooltip;
