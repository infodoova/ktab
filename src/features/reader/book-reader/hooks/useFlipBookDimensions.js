import { useState, useEffect, useMemo, useCallback } from "react";

/**
 * Custom hook managing responsive viewport metrics, device categorizations,
 * dynamic single-page card dimensions, and scaled font sizing for the reader engine.
 *
 * @param {Object} params
 * @param {number} params.fontSize
 * @param {number} params.wordsPerPage
 * @returns {Object} Responsive metrics, typography parameters, and layout bounds
 */
export function useFlipBookDimensions({ fontSize = 18, wordsPerPage = 110 } = {}) {
  const getViewportDimensions = useCallback(() => {
    if (typeof window === "undefined") return { width: 1200, height: 800 };
    const width = window.innerWidth || document.documentElement.clientWidth || 1200;
    const height =
      window.innerHeight ||
      window.visualViewport?.height ||
      document.documentElement.clientHeight ||
      800;
    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }, []);

  const [windowDimensions, setWindowDimensions] = useState(getViewportDimensions);

  useEffect(() => {
    let rafId = null;

    function handleResize() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setWindowDimensions(getViewportDimensions());
      });
    }

    function handleOrientation() {
      handleResize();
      setTimeout(handleResize, 120);
      setTimeout(handleResize, 300);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleOrientation);
      window.visualViewport?.addEventListener("resize", handleResize);

      // Multi-stage settle to defeat SPA navigation race conditions:
      // Immediate, next animation frame, 50ms, 150ms, and 300ms
      handleResize();
      const t1 = setTimeout(handleResize, 50);
      const t2 = setTimeout(handleResize, 150);
      const t3 = setTimeout(handleResize, 300);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleOrientation);
        window.visualViewport?.removeEventListener("resize", handleResize);
      };
    }
  }, [getViewportDimensions]);

  const { width: vw, height: vh } = windowDimensions;

  // Check if primary input pointer is fine (PC mouse / touchpad)
  const isPointerFine = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      Boolean(window.matchMedia?.("(pointer: fine)")?.matches)
    );
  }, []);

  const isTouchDevice = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
    );
  }, []);

  // Desktop/Laptop PC with mouse or precision trackpad: always a desktop card view if width >= 768px
  const isPCDesktop = isPointerFine && vw >= 768;

  // Mobile phone screen: narrow width under 768px
  const isMobile = vw < 768;

  // Identify iPads and dedicated tablets ONLY when not operating as a PC desktop with fine mouse pointer
  const isIPadOrTablet = useMemo(() => {
    if (typeof window === "undefined") return false;
    // PC with mouse/trackpad pointer is NEVER a tablet
    if (isPCDesktop) return false;

    const isAppleTablet =
      /iPad|Tablet|PlayBook/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && !isPointerFine);

    if (isAppleTablet) return true;

    // Only apply tablet dimensional heuristics to touch devices without a fine mouse pointer
    if (isTouchDevice && !isPointerFine) {
      const minDim = Math.min(vw, vh);
      const maxDim = Math.max(vw, vh);
      return (
        (minDim >= 600 && minDim <= 1100 && maxDim >= 900 && maxDim <= 1450) ||
        (vw >= 768 && vw <= 1366) ||
        (minDim >= 600 && minDim <= 1100)
      );
    }

    return false;
  }, [vw, vh, isTouchDevice, isPointerFine, isPCDesktop]);

  // Fullscreen edge-to-edge layout for mobile phones and touch tablets; elegant wide card on PC
  const isMobileOrTablet = isMobile || (isIPadOrTablet && !isPCDesktop);
  const isDesktop = !isMobileOrTablet && (isPCDesktop || vw >= 768);

  // Single-page height & width: Fullscreen edge-to-edge on mobile & tablets; elegant wide card on PC
  const pageHeight = useMemo(() => {
    if (isMobileOrTablet) {
      return vh;
    }
    return Math.floor(Math.min(vh * 0.94, vh - 32));
  }, [isMobileOrTablet, vh]);

  const pageWidth = useMemo(() => {
    if (isMobileOrTablet) {
      return vw;
    }
    const proportionalWidth = Math.floor(pageHeight * 0.78);
    return Math.floor(Math.min(vw * 0.58, proportionalWidth, 860));
  }, [isMobileOrTablet, vw, pageHeight]);

  // Font size and line height calibrated for reading density on iPad & mobile
  const effectiveFontSize = useMemo(() => {
    const base = Math.min(28, Math.max(14, fontSize));
    if (isIPadOrTablet) {
      return Math.round(base * 1.28);
    }
    if (isDesktop) return Math.max(base, 19);
    return base;
  }, [fontSize, isIPadOrTablet, isDesktop]);

  const dynamicFontSize = `${effectiveFontSize}px`;
  const dynamicLineHeight = isIPadOrTablet ? "1.86" : (isMobile ? "1.75" : "1.88");

  // 110 words (~650 chars) across standard mobile/desktop; 220 words (~1,300 chars) on iPads/tablets
  const BASE_WORDS_PER_PAGE = wordsPerPage || 110;

  const calculatedWordsPerPage = useMemo(() => {
    if (isIPadOrTablet) {
      return BASE_WORDS_PER_PAGE * 2;
    }
    return BASE_WORDS_PER_PAGE;
  }, [isIPadOrTablet, BASE_WORDS_PER_PAGE]);

  return {
    vw,
    vh,
    isTouchDevice,
    isMobile,
    isIPadOrTablet,
    isMobileOrTablet,
    isDesktop,
    pageHeight,
    pageWidth,
    effectiveFontSize,
    dynamicFontSize,
    dynamicLineHeight,
    calculatedWordsPerPage,
  };
}

export default useFlipBookDimensions;

