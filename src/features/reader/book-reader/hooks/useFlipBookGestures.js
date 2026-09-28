import { useRef, useEffect, useCallback } from "react";

/**
 * Handles gestural touch events, mouse wheel scrolling, and keyboard hotkeys
 * for page navigation in the reader view.
 *
 * @param {Object} params
 * @param {React.RefObject} params.containerRef
 * @param {boolean} params.readOnly
 * @param {Function} params.onFlipNext
 * @param {Function} params.onFlipPrev
 */
export function useFlipBookGestures({
  containerRef,
  readOnly = false,
  onFlipNext,
  onFlipPrev,
}) {
  const touchDataRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    active: false,
  });

  const handleTouchStart = useCallback(
    (e) => {
      if (readOnly) return;
      // Ignore touches on explicit control buttons, modals, or open popovers
      if (
        e.target.closest(
          ".ktab-flip-edge-trigger, .ktab-glass-circle-btn, .ktab-reader-mode-hide-btn, .ktab-glass-popover, .ktab-reader-pc-drawer, input, textarea, select, [role='dialog']"
        )
      ) {
        return;
      }
      const t = e.touches[0];
      if (!t) return;

      touchDataRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        startTime: Date.now(),
        active: true,
      };
    },
    [readOnly]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      const data = touchDataRef.current;
      if (!data.active) return;
      data.active = false;

      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - data.startX;
      const dy = t.clientY - data.startY;
      const dt = Math.max(1, Date.now() - data.startTime);
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const velocityX = absDx / dt;
      const velocityY = absDy / dt;

      // 1. Gestural Swiping (Horizontal or vertical swipe across screen)
      if (absDx > absDy && (absDx > 20 || velocityX > 0.16)) {
        if (dx < 0) {
          onFlipNext();
        } else {
          onFlipPrev();
        }
        return;
      }

      if (absDy >= absDx && (absDy > 20 || velocityY > 0.16)) {
        if (dy < 0) {
          onFlipNext();
        } else {
          onFlipPrev();
        }
        return;
      }

      // 2. Quick Tap on screen edges (< 320ms and < 15px movement)
      if (absDx < 15 && absDy < 15 && dt < 320) {
        const clientX = t.clientX;
        const clientY = t.clientY;
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;

        // Max Right (Right 35%) -> Next Page
        if (clientX > windowW * 0.65) {
          onFlipNext();
          return;
        }

        // Max Left (Left 35%) -> Previous Page
        if (clientX < windowW * 0.35) {
          onFlipPrev();
          return;
        }

        // Max Down/Bottom (Bottom 20%) -> Next Page
        if (clientY > windowH * 0.80) {
          onFlipNext();
          return;
        }

        // Max Top (Top 20%) -> Previous Page
        if (clientY < windowH * 0.20) {
          onFlipPrev();
          return;
        }
      }
    },
    [onFlipNext, onFlipPrev]
  );

  // Mouse wheel pagination listener
  const lastWheelTimeRef = useRef(0);
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 350) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 20) return;

      e.preventDefault();
      lastWheelTimeRef.current = now;

      if (e.deltaY > 0) {
        onFlipNext();
      } else {
        onFlipPrev();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [containerRef, onFlipNext, onFlipPrev]);

  // Keyboard navigation (Arrows, PageUp/Down, Space)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (readOnly) return;
      if (e.target.closest("input, textarea, select, [contenteditable='true']")) return;

      switch (e.key) {
        // Next page triggers: Right arrow, Down arrow, PageDown, Space
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          onFlipNext();
          break;

        // Previous page triggers: Left arrow, Up arrow, PageUp
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          onFlipPrev();
          break;

        case " ":
          e.preventDefault();
          if (e.shiftKey) {
            onFlipPrev();
          } else {
            onFlipNext();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [readOnly, onFlipNext, onFlipPrev]);

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}

export default useFlipBookGestures;
