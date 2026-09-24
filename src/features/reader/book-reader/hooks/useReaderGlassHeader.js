import { useState, useMemo, useRef, useEffect } from "react";

/**
 * Custom hook encapsulating UI state and interaction handlers for ReaderGlassHeader.
 * Manages mobile toolbar expansion, smooth closing animation lifecycle,
 * font percentage metrics, and focus-clearing action clicks.
 */
export function useReaderGlassHeader({
  fontSize = 18,
  isControlsVisible = true,
  isLocked = false,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const fontPercent = useMemo(
    () => Math.round((fontSize / 18) * 100),
    [fontSize]
  );

  const isHidden = !isControlsVisible || isLocked;

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

  const openMobileMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    if (!isMobileMenuOpen || isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 250);
  };

  return {
    isMobileMenuOpen,
    isClosing,
    openMobileMenu,
    closeMobileMenu,
    fontPercent,
    isHidden,
    handleActionClick,
  };
}

export default useReaderGlassHeader;
