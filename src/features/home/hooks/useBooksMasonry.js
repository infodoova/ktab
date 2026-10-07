import { useRef, useEffect, useCallback, useMemo } from "react";
import { usePublicCoverImages } from "./usePublicCoverImages";

/**
 * Fetches public covers and animates two marquee tracks using cached widths.
 */
export function useBooksMasonry() {
  const { books, isLoading, error, retry, refreshAfterImageError } = usePublicCoverImages("all", 24, 12);
  const { row1, row2 } = useMemo(() => {
    const all = books;
    const set1 = all;
    const set2 = [
      ...all.slice(6),
      ...all.slice(0, 6),
    ];

    // Repeat short API lists enough to fill wide screens without fake covers.
    const repeatCount = Math.max(3, Math.ceil(12 / Math.max(all.length, 1)) * 3);
    return {
      row1: Array.from({ length: repeatCount }, () => set1).flat(),
      row2: Array.from({ length: repeatCount }, () => set2).flat(),
    };
  }, [books]);

  // Marquee track DOM refs
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  // Cached pixel widths for single-set wrap (avoids getBoundingClientRect in RAF loop)
  const setWidth1 = useRef(2448);
  const setWidth2 = useRef(2448);

  // Measure track widths once on mount and on window resize only
  useEffect(() => {
    const measureWidths = () => {
      if (books.length && row1Ref.current && row1Ref.current.children.length > books.length) {
        const c0 = row1Ref.current.children[0];
        const c12 = row1Ref.current.children[books.length];
        if (c0 && c12) {
          const dist = Math.abs(
            c12.getBoundingClientRect().left - c0.getBoundingClientRect().left
          );
          if (dist > 0) setWidth1.current = dist;
        }
      }

      if (books.length && row2Ref.current && row2Ref.current.children.length > books.length) {
        const c0 = row2Ref.current.children[0];
        const c12 = row2Ref.current.children[books.length];
        if (c0 && c12) {
          const dist = Math.abs(
            c12.getBoundingClientRect().left - c0.getBoundingClientRect().left
          );
          if (dist > 0) setWidth2.current = dist;
        }
      }
    };

    // Recalculate immediately when an API response changes the set length.
    measureWidths();
    window.addEventListener("resize", measureWidths, { passive: true });

    return () => {
      window.removeEventListener("resize", measureWidths);
    };
  }, [books.length]);

  // Hover state flags for smooth slowdown
  const isHoveredRow1 = useRef(false);
  const isHoveredRow2 = useRef(false);

  // Position and speed states for physics loop
  const pos1 = useRef(0);
  const pos2 = useRef(0);
  const speed1 = useRef(0.85);
  const speed2 = useRef(0.85);

  // Animation frame ID
  const rafId = useRef(null);

  // Pure GPU Animation Loop (Zero layout recalculations / Zero DOM reads)
  useEffect(() => {
    const normalSpeed = 0.85;
    const slowSpeed = 0.18;
    const lerpFactor = 0.05;

    const animate = () => {
      // Smoothly interpolate speed towards target
      const targetSpeed1 = isHoveredRow1.current ? slowSpeed : normalSpeed;
      speed1.current += (targetSpeed1 - speed1.current) * lerpFactor;

      const targetSpeed2 = isHoveredRow2.current ? slowSpeed : normalSpeed;
      speed2.current += (targetSpeed2 - speed2.current) * lerpFactor;

      // Update Track 1 (Gliding Leftwards)
      if (row1Ref.current) {
        const w1 = setWidth1.current;
        pos1.current = (pos1.current + speed1.current) % w1;
        row1Ref.current.style.transform = `translate3d(${-pos1.current}px, 0, 0)`;
      }

      // Update Track 2 (Gliding Rightwards for dynamic visual depth)
      if (row2Ref.current) {
        const w2 = setWidth2.current;
        pos2.current = (pos2.current + speed2.current) % w2;
        row2Ref.current.style.transform = `translate3d(${pos2.current - w2}px, 0, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleRow1MouseEnter = useCallback(() => {
    isHoveredRow1.current = true;
  }, []);

  const handleRow1MouseLeave = useCallback(() => {
    isHoveredRow1.current = false;
  }, []);

  const handleRow2MouseEnter = useCallback(() => {
    isHoveredRow2.current = true;
  }, []);

  const handleRow2MouseLeave = useCallback(() => {
    isHoveredRow2.current = false;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO PLAYBACK DELEGATION (SINGLE AUDIO SOURCE)
  // ═══════════════════════════════════════════════════════════════════════════
  // Audio preview is paused while the API supplies only cover URLs:
  // useVoiceSampleStore.getState().openSample(book);

  return {
    row1,
    row2,
    isLoading,
    error,
    retry,
    refreshAfterImageError,
    row1Ref,
    row2Ref,
    handleRow1MouseEnter,
    handleRow1MouseLeave,
    handleRow2MouseEnter,
    handleRow2MouseLeave,
  };
}

export default useBooksMasonry;
