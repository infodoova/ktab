import { useCallback } from "react";

/**
 * Custom hook encapsulating UI state and action handlers for MobilePageNav.
 * Enforces lock-mode visibility restrictions, page bound indicators,
 * and tactile haptic feedback on page flips.
 */
export function useMobilePageNav({
  currentPage = 1,
  totalPages = 1,
  isLocked = false,
  onPrevPage,
  onNextPage,
  onOpenFastTravel,
}) {
  const isVisible = !isLocked;
  const isAtStart = currentPage <= 1;
  const isAtEnd = totalPages > 1 && currentPage >= totalPages;

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(12);
    }
  };

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (e?.currentTarget) {
        e.currentTarget.blur();
      }
      triggerHaptic();
      onPrevPage?.();
    },
    [onPrevPage]
  );

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (e?.currentTarget) {
        e.currentTarget.blur();
      }
      triggerHaptic();
      onNextPage?.();
    },
    [onNextPage]
  );

  const handlePageClick = useCallback(
    (e) => {
      e?.stopPropagation();
      if (e?.currentTarget) {
        e.currentTarget.blur();
      }
      triggerHaptic();
      onOpenFastTravel?.();
    },
    [onOpenFastTravel]
  );

  return {
    isVisible,
    currentPage,
    totalPages,
    isAtStart,
    isAtEnd,
    handlePrev,
    handleNext,
    handlePageClick,
  };
}

export default useMobilePageNav;
