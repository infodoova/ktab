import { useState, useEffect } from "react";

/**
 * Handles viewport breakpoint detection, body scroll locking, and keyboard escape dismissal for drawers.
 *
 * @param {Object} params
 * @param {boolean} params.isOpen - Whether the drawer is open
 * @param {Function} params.onClose - Callback triggered on escape or close action
 * @returns {{ isMobile: boolean }}
 */
export function useDetailsDrawer({ isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  // Track viewport width changes to adjust drawer slide direction dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (e) => setIsMobile(e.matches);

    // Modern MediaQueryList addEventListener with backwards compatibility fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Prevent background document scrolling and bind Escape key dismiss handler
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return { isMobile };
}
