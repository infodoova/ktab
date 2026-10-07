import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Custom hook encapsulating BookReviewModal responsive state, animations, and input handlers.
 *
 * @param {Object} params
 * @param {boolean} [params.isOpen]
 * @param {Function} params.setUserRating
 * @param {Function} params.setUserReview
 * @param {Function} params.onClose
 */
export function useBookReviewModal({
  isOpen = false,
  setUserRating,
  setUserReview,
}) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 767;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Smooth Apple-style cubic-bezier transitions (zero spring jitter or text shaking)
  const sheetVariants = useMemo(
    () => ({
      hidden: isMobile
        ? { y: "100%", opacity: 0 }
        : { opacity: 0, scale: 0.96, y: 10 },
      visible: isMobile
        ? {
            y: 0,
            opacity: 1,
            transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
          }
        : {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
          },
      exit: isMobile
        ? {
            y: "100%",
            opacity: 0,
            transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
          }
        : {
            opacity: 0,
            scale: 0.96,
            y: 8,
            transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
          },
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
