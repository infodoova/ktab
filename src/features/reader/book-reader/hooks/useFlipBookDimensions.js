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
    if (typeof window === "undefined") return { width: 390, height: 844 };
    const width = document.documentElement.clientWidth || window.innerWidth;
    const height =
      window.visualViewport?.height ||
      document.documentElement.clientHeight ||
      window.innerHeight;
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
      // Viewport metrics settle 100-300ms after physical rotation on iOS Safari
      setTimeout(handleResize, 120);
      setTimeout(handleResize, 300);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleOrientation);
      window.visualViewport?.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleOrientation);
        window.visualViewport?.removeEventListener("resize", handleResize);
      }
    };
  }, [getViewportDimensions]);

  const { width: vw, height: vh } = windowDimensions;

  const isTouchDevice = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
    );
  }, []);

  const isMobile = vw < 768;

  // Identify iPads and all tablets in both portrait and landscape orientation, including HTML5 fullscreen
  const isIPadOrTablet = useMemo(() => {
    if (typeof window === "undefined") return false;
    const isAppleTablet =
      /iPad|Tablet|PlayBook/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const minDim = Math.min(vw, vh);
    const maxDim = Math.max(vw, vh);

    const hasTabletDimensions =
      minDim >= 600 && minDim <= 1100 && maxDim >= 900 && maxDim <= 1450;

    return (
      isAppleTablet ||
      hasTabletDimensions ||
      (isTouchDevice && vw >= 768 && vw <= 1366) ||
      (isTouchDevice && minDim >= 600 && minDim <= 1100)
    );
  }, [vw, vh, isTouchDevice]);

  // Fullscreen edge-to-edge layout for all mobile phones, iPads, and tablets (portrait & landscape)
  const isMobileOrTablet = isMobile || isIPadOrTablet || (vw <= 1366 && isTouchDevice);
  const isDesktop = !isMobileOrTablet && vw > 1366;

  // Single-page height & width: Fullscreen edge-to-edge on mobile, iPads, & tablets; elegant wide card on PC
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
