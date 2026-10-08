import { useState, useEffect, useMemo, useCallback } from "react";
import { isIPadDevice } from "../utils/readerPaginationUtils";

/**
 * Custom hook managing responsive viewport metrics, device categorizations,
 * dynamic single-page card dimensions, and scaled font sizing for the reader engine.
 *
 * @param {Object} params
 * @param {number} params.fontSize
 * @param {number} params.wordsPerPage
 * @returns {Object} Responsive metrics, typography parameters, and layout bounds
 */
export function useFlipBookDimensions({ fontSize = 18, wordsPerPage = 80 } = {}) {
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

  // Identify iPads and dedicated tablets (including iPadOS desktop Safari and DevTools simulation)
  const isIPadOrTablet = useMemo(() => {
    return isIPadDevice(vw, vh);
  }, [vw, vh]);

  const isVertical = vh > vw;
  const isVerticalIPad = isIPadOrTablet && isVertical;

  // Desktop/Laptop PC with mouse or precision trackpad: desktop card view when not an iPad/tablet
  const isPCDesktop = isPointerFine && vw >= 768 && !isIPadOrTablet;

  // Mobile phone screen: narrow width under 768px
  const isMobile = vw < 768 && !isIPadOrTablet;

  // Fullscreen edge-to-edge layout for mobile phones and touch tablets; elegant wide card on PC
  const isMobileOrTablet = isMobile || isIPadOrTablet;
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
    if (isVerticalIPad) {
      // 160 words on vertical iPad: 15% calibrated scale for optimal line fitting without clipping
      return Math.round(base * 1.15);
    }
    if (isIPadOrTablet) {
      return Math.round(base * 1.28);
    }
    if (isDesktop) return Math.max(base, 19);
    return base;
  }, [fontSize, isVerticalIPad, isIPadOrTablet, isDesktop]);

  const dynamicFontSize = `${effectiveFontSize}px`;
  const dynamicLineHeight = isVerticalIPad
    ? "1.80"
    : isIPadOrTablet
    ? "1.86"
    : isMobile
    ? "1.75"
    : "1.88";

  // 160 words on vertical iPad / tablet; 80 words elsewhere
  const calculatedWordsPerPage = wordsPerPage || (isVerticalIPad ? 160 : 80);

  return {
    vw,
    vh,
    isTouchDevice,
    isMobile,
    isIPadOrTablet,
    isVerticalIPad,
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


