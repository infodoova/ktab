import { useState, useMemo, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook encapsulating UI state and interaction handlers for ReaderGlassHeader.
 * Manages universal tools panel expansion (for both desktop side panel and mobile dock),
 * smooth closing animation lifecycle, font percentage metrics, and focus-clearing action clicks.
 */
export function useReaderGlassHeader({
  fontSize = 18,
  isControlsVisible = true,
  isLocked = false,
}) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openTools = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setIsToolsOpen(true);
  }, []);

  const closeTools = useCallback(() => {
    if (!isToolsOpen || isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsToolsOpen(false);
      setIsClosing(false);
    }, 240);
  }, [isToolsOpen, isClosing]);

  const toggleTools = useCallback(() => {
    if (isToolsOpen) {
      closeTools();
    } else {
      openTools();
    }
  }, [isToolsOpen, closeTools, openTools]);

  // Handle Escape key to close tools panel if open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isToolsOpen) {
        closeTools();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isToolsOpen, closeTools]);

  const fontPercent = useMemo(
    () => Math.round((fontSize / 18) * 100),
    [fontSize]
  );

  const isHidden = isLocked;

  /**
   * Clears button focus before firing the action callback to prevent
   * persistent focus ring and keyboard trap behaviors on programmatic updates.
   */
  const handleActionClick = (e, callback) => {
    if (e?.currentTarget) {
      e.currentTarget.blur();
    }
    callback?.();
  };

  return {
    isToolsOpen,
    isMobileMenuOpen: isToolsOpen, // backwards compatibility
    isClosing,
    toggleTools,
    openTools,
    closeTools,
    openMobileMenu: openTools,
    closeMobileMenu: closeTools,
    fontPercent,
    isHidden,
    handleActionClick,
  };
}

export default useReaderGlassHeader;

