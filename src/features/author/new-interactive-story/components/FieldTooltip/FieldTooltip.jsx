import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import "./FieldTooltip.css";

/**
 * Viewport-aware tooltip for form fields.
 * Uses a React Portal to render the popover at the document body level,
 * preventing clipping by parent overflow containers.
 * 
 * Desktop: hover/click shows floating popover above/below the icon.
 * Mobile (≤640px): renders as a fixed bottom-sheet.
 * Closes on outside click, scroll, or escape key.
 */
export function FieldTooltip({ text, label = "معلومات إضافية" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState({});
  const [showBelow, setShowBelow] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  /**
   * Computes absolute positioning for the portal-rendered popover
   * based on the trigger button's bounding rect relative to the viewport.
   */
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth <= 640;

    if (isMobile) {
      // Mobile: bottom-sheet, no positioning needed (handled by CSS fixed)
      setPopoverStyle({});
      setShowBelow(false);
      return;
    }

    const spaceAbove = rect.top;
    const flipBelow = spaceAbove < 120;
    setShowBelow(flipBelow);

    // Center the popover horizontally on the trigger icon
    const triggerCenterX = rect.left + rect.width / 2;

    if (flipBelow) {
      setPopoverStyle({
        position: "fixed",
        top: `${rect.bottom + 8}px`,
        left: `${triggerCenterX}px`,
        transform: "translateX(-50%)",
      });
    } else {
      setPopoverStyle({
        position: "fixed",
        bottom: `${window.innerHeight - rect.top + 8}px`,
        left: `${triggerCenterX}px`,
        transform: "translateX(-50%)",
      });
    }
  }, []);

  const toggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen((prev) => {
        const next = !prev;
        if (next) {
          // Allow one frame for the portal to mount before measuring
          requestAnimationFrame(updatePosition);
        }
        return next;
      });
    },
    [updatePosition]
  );

  const handleMouseEnter = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on outside click, scroll, resize, or Escape
  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);

    const handleOutsideClick = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        close();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, { passive: true, capture: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close, { capture: true });
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  if (!text) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;

  return (
    <span className="field-tooltip-wrap">
      <button
        ref={triggerRef}
        type="button"
        className={`field-tooltip-trigger ${isOpen ? "is-active" : ""}`}
        onClick={toggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={label}
        aria-expanded={isOpen}
      >
        <Info size={13} />
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Mobile backdrop scrim */}
            {isMobile && (
              <div
                className="field-tooltip-backdrop"
                onClick={() => setIsOpen(false)}
              />
            )}
            <span
              ref={popoverRef}
              role="tooltip"
              className={`field-tooltip-popover ${
                showBelow
                  ? "field-tooltip-popover--below"
                  : "field-tooltip-popover--above"
              }`}
              style={!isMobile ? popoverStyle : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {text}
            </span>
          </>,
          document.body
        )}
    </span>
  );
}

export default FieldTooltip;
