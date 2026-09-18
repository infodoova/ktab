import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Custom hook encapsulating BookReviewModal responsive state, animations, and input handlers.
 *
 * @param {Object} params
 * @param {Function} params.setUserRating
 * @param {Function} params.setUserReview
 * @param {Function} params.onClose
 */
export function useBookReviewModal({
  setUserRating,
  setUserReview,
  onClose,
}) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 640;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Animation variants: bottom-sheet slide on mobile, center scale on desktop
  const sheetVariants = useMemo(
    () => ({
      hidden: isMobile
        ? { y: "100%", opacity: 0.5 }
        : { opacity: 0, scale: 0.95, y: 12 },
      visible: isMobile
        ? { y: 0, opacity: 1 }
        : { opacity: 1, scale: 1, y: 0 },
      exit: isMobile
        ? { y: "100%", opacity: 0.5 }
        : { opacity: 0, scale: 0.95, y: 12 },
    }),
    [isMobile]
  );

  const handleStarClick = useCallback(
    (e) => {
      const rating = Number(e.currentTarget.dataset.star);
      if (rating) {
        setUserRating(rating);
      }
    },
    [setUserRating]
  );

  const handleReviewChange = useCallback(
    (e) => {
      setUserReview(e.target.value);
    },
    [setUserReview]
  );

  const handleDialogClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return {
    isMobile,
    sheetVariants,
    handleStarClick,
    handleReviewChange,
    handleDialogClick,
  };
}

export default useBookReviewModal;
