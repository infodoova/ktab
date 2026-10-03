import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Traverses parent nodes to find if an element or its ancestor has scrollable content.
 * Returns the scrollable element if scrollable and overflowing; otherwise null.
 */
function getScrollableParent(node, rootNode) {
  let curr = node;
  while (curr && curr !== rootNode && curr !== document.body) {
    if (curr.scrollHeight > curr.clientHeight + 4) {
      const style = window.getComputedStyle(curr);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return curr;
      }
    }
    curr = curr.parentElement;
  }
  return null;
}

/**
 * Dedicated gesture and physics controller for Flipboard-style vertical folding:
 * - Fluid touch scrolling with natural finger tracking and low friction
 * - High-responsiveness flick detection (>0.22 px/ms or >=36° rotation)
 * - Zero-latency tap support (top half -> prev, bottom half -> next)
 * - Wheel and trackpad scroll handling with debounce
 * - Boundary rubber-band resistance on first/last pages
 * - Sinusoidal mathematical shadow darkening peaking at 90°
 */
export function useFlipboardMobileFold({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  isAtLastPage,
  onCloseStory,
}) {
  const [foldDirection, setFoldDirection] = useState(null); // 'next' | 'prev' | null
  const [angle, setAngle] = useState(0); // 0 to 180 degrees
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Gesture tracking refs
  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const touchStartTime = useRef(null);
  const lastTouchY = useRef(null);
  const lastTouchX = useRef(null);
  const touchTarget = useRef(null);
  const isDirectionDecided = useRef(false);
  const isRubberBanding = useRef(false);
  const animationFrameRef = useRef(null);
  const isMouseDown = useRef(false);
  const lastTapTimestamp = useRef(0);
  const wheelLockRef = useRef(false);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Compute realistic sinusoidal lighting shadows (peaks at 90 degrees edge-on)
  const radians = (angle * Math.PI) / 180;
  const shadowFactor = Math.sin(radians);
  const shadowOpacity = Math.max(0, Math.min(0.65, shadowFactor * 0.65));
  const underShadowOpacity = Math.max(0, Math.min(0.4, shadowFactor * 0.4));

  // Smoothly animate the fold angle to a target value (0 or 180)
  const animateToAngle = useCallback(
    (targetAngle, durationMs, onFinished) => {
      setIsAnimating(true);
      setIsDragging(false);

      const startAngle = angle;
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        // Smooth cubic ease-out for physical paper deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;

        setAngle(currentAngle);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          setAngle(targetAngle);
          setIsAnimating(false);
          if (onFinished) onFinished();
        }
      }

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [angle]
  );

  // Trigger a full programmatic fold (used by tap and wheel navigation)
  const triggerProgrammaticFold = useCallback(
    (direction) => {
      if (isAnimating || isDragging) return;

      if (direction === "next") {
        if (currentPage >= totalPages - 1) {
          if (onCloseStory) onCloseStory();
          return;
        }
        setFoldDirection("next");
        setAngle(0);
        requestAnimationFrame(() => {
          animateToAngle(180, 380, () => {
            if (onNext) onNext();
            requestAnimationFrame(() => {
              setFoldDirection(null);
              setAngle(0);
            });
          });
        });
      } else if (direction === "prev") {
        if (currentPage <= 0) return;
        setFoldDirection("prev");
        setAngle(0);
        requestAnimationFrame(() => {
          animateToAngle(180, 380, () => {
            if (onPrev) onPrev();
            requestAnimationFrame(() => {
              setFoldDirection(null);
              setAngle(0);
            });
          });
        });
      }
    },
    [
      isAnimating,
      isDragging,
      currentPage,
      totalPages,
      onCloseStory,
      onNext,
      onPrev,
      animateToAngle,
    ]
  );

  // Core start handler
  const startDrag = useCallback(
    (clientX, clientY, target) => {
      if (isAnimating) return;
      touchStartY.current = clientY;
      touchStartX.current = clientX;
      touchStartTime.current = Date.now();
      lastTouchY.current = clientY;
      lastTouchX.current = clientX;
      touchTarget.current = target;
      isDirectionDecided.current = false;
      isRubberBanding.current = false;
    },
    [isAnimating]
  );

  // Core move handler (High sensitivity touch scroll tracking)
  const moveDrag = useCallback(
    (clientX, clientY, cancelableEvent) => {
      if (isAnimating || touchStartY.current === null) return;

      const diffY = clientY - touchStartY.current;
      const diffX = clientX - touchStartX.current;
      lastTouchY.current = clientY;
      lastTouchX.current = clientX;

      // Ignore horizontal swipes strictly
      if (!isDirectionDecided.current) {
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 6) {
          touchStartY.current = null;
          return;
        }
        // Responsive 4px threshold to start tracking immediately
        if (Math.abs(diffY) > 4) {
          // Check internal scroll before deciding to fold
          const scrollable = getScrollableParent(touchTarget.current, null);
          if (scrollable) {
            const isAtTop = scrollable.scrollTop <= 2;
            const isAtBottom =
              scrollable.scrollTop + scrollable.clientHeight >=
              scrollable.scrollHeight - 2;

            if (diffY < 0 && !isAtBottom) {
              // Dragging UP, but container can still scroll down internally
              touchStartY.current = null;
              return;
            }
            if (diffY > 0 && !isAtTop) {
              // Dragging DOWN, but container can still scroll up internally
              touchStartY.current = null;
              return;
            }
          }

          isDirectionDecided.current = true;
          setIsDragging(true);
        } else {
          return;
        }
      }

      // Prevent native viewport scrolling while folding
      if (cancelableEvent && cancelableEvent.cancelable) {
        cancelableEvent.preventDefault();
      }

      const viewportHeight = window.innerHeight || 800;
      // 32% of screen height drag maps to full 180° rotation for effortless scrolling
      const sweepRange = viewportHeight * 0.32;

      if (diffY < 0) {
        // Dragging UP -> Next Page
        if (currentPage >= totalPages - 1) {
          // Boundary rubber-band resistance on last page
          isRubberBanding.current = true;
          const pull = Math.min(1, Math.abs(diffY) / viewportHeight);
          const resistedAngle = Math.pow(pull, 0.72) * 26; // Max 26 degrees
          setFoldDirection("next");
          setAngle(resistedAngle);
        } else {
          isRubberBanding.current = false;
          const progress = Math.min(1, Math.max(0, -diffY / sweepRange));
          setFoldDirection("next");
          setAngle(progress * 180);
        }
      } else if (diffY > 0) {
        // Dragging DOWN -> Previous Page
        if (currentPage <= 0) {
          // Boundary rubber-band resistance on first page
          isRubberBanding.current = true;
          const pull = Math.min(1, Math.abs(diffY) / viewportHeight);
          const resistedAngle = Math.pow(pull, 0.72) * 26;
          setFoldDirection("prev");
          setAngle(resistedAngle);
        } else {
          isRubberBanding.current = false;
          const progress = Math.min(1, Math.max(0, diffY / sweepRange));
          setFoldDirection("prev");
          setAngle(progress * 180);
        }
      }
    },
    [isAnimating, currentPage, totalPages]
  );

  // Core release handler (Handles both touch-scroll completion and instant tap)
  const endDrag = useCallback(() => {
    if (touchStartY.current === null) return;

    const startY = touchStartY.current;
    const endY = lastTouchY.current !== null ? lastTouchY.current : startY;
    const startX = touchStartX.current || 0;
    const endX = lastTouchX.current !== null ? lastTouchX.current : startX;

    const diffY = endY - startY;
    const diffX = endX - startX;
    const elapsed = Date.now() - (touchStartTime.current || Date.now());
    const velocity = elapsed > 0 ? Math.abs(diffY) / elapsed : 0; // px/ms

    touchStartY.current = null;
    touchStartX.current = null;
    touchStartTime.current = null;
    lastTouchY.current = null;
    lastTouchX.current = null;
    isMouseDown.current = false;

    // 1. Detect Direct Tap (Short duration and minimal movement)
    const isDirectTap =
      elapsed < 320 && Math.abs(diffY) < 10 && Math.abs(diffX) < 10;

    if (isDirectTap && !isDragging && !foldDirection) {
      lastTapTimestamp.current = Date.now();
      const viewportHeight = window.innerHeight || 800;
      const isBottomHalf = startY > viewportHeight * 0.5;
      triggerProgrammaticFold(isBottomHalf ? "next" : "prev");
      return;
    }

    if (!foldDirection) {
      setIsDragging(false);
      return;
    }

    if (isRubberBanding.current) {
      // Spring back from boundary resistance
      animateToAngle(0, 220, () => {
        setFoldDirection(null);
        setAngle(0);
      });
      return;
    }

    // 2. Touch Scroll Physics Threshold
    // Effortless flick (>0.22 px/ms with >14px drag) or reached >= 36° (20% of fold) or drag > 42px
    const isFlick = velocity > 0.22 && Math.abs(diffY) > 14;
    const passedThreshold = angle >= 36 || Math.abs(diffY) >= 42 || isFlick;

    if (passedThreshold) {
      // Complete the fold to 180 degrees
      const remainingAngle = 180 - angle;
      const speedBonus = Math.min(90, velocity * 70);
      const baseDuration = (remainingAngle / 180) * 300;
      const duration = Math.max(150, Math.min(320, baseDuration - speedBonus));

      animateToAngle(180, duration, () => {
        if (foldDirection === "next") {
          if (currentPage >= totalPages - 1) {
            if (onCloseStory) onCloseStory();
          } else {
            if (onNext) onNext();
          }
        } else if (foldDirection === "prev") {
          if (onPrev) onPrev();
        }
        // Let the new page state commit before resetting fold flap
        requestAnimationFrame(() => {
          setFoldDirection(null);
          setAngle(0);
        });
      });
    } else {
      // Spring back to 0 degrees
      const duration = Math.max(130, Math.min(260, (angle / 180) * 280));
      animateToAngle(0, duration, () => {
        setFoldDirection(null);
        setAngle(0);
      });
    }
  }, [
    foldDirection,
    angle,
    isDragging,
    animateToAngle,
    triggerProgrammaticFold,
    currentPage,
    totalPages,
    onNext,
    onPrev,
    onCloseStory,
  ]);

  // Touch event adapters
  const onTouchStart = useCallback(
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      startDrag(e.touches[0].clientX, e.touches[0].clientY, e.target);
    },
    [startDrag]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      moveDrag(e.touches[0].clientX, e.touches[0].clientY, e);
    },
    [moveDrag]
  );

  // Mouse event adapters for testing and desktop emulation
  const onMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      isMouseDown.current = true;
      startDrag(e.clientX, e.clientY, e.target);
    },
    [startDrag]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (!isMouseDown.current) return;
      moveDrag(e.clientX, e.clientY, e);
    },
    [moveDrag]
  );

  const onMouseUp = useCallback(() => {
    if (!isMouseDown.current) return;
    endDrag();
  }, [endDrag]);

  // Wheel and Trackpad 2-finger scroll support
  const onWheel = useCallback(
    (e) => {
      if (isAnimating || isDragging || wheelLockRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      wheelLockRef.current = true;
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 550);

      if (e.deltaY > 0) {
        triggerProgrammaticFold("next");
      } else {
        triggerProgrammaticFold("prev");
      }
    },
    [isAnimating, isDragging, triggerProgrammaticFold]
  );

  // Click handler fallback for mouse clicks
  const onTapScreen = useCallback(
    (clientY, containerHeight) => {
      // Avoid duplicate trigger if touchEnd already handled this tap
      if (Date.now() - lastTapTimestamp.current < 450) return;
      if (isAnimating || isDragging) return;

      const isBottomHalf = clientY > containerHeight * 0.5;
      triggerProgrammaticFold(isBottomHalf ? "next" : "prev");
    },
    [isAnimating, isDragging, triggerProgrammaticFold]
  );

  return {
    foldDirection,
    angle,
    isDragging,
    isAnimating,
    shadowOpacity,
    underShadowOpacity,
    onTouchStart,
    onTouchMove,
    onTouchEnd: endDrag,
    onTouchCancel: endDrag,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave: onMouseUp,
    onWheel,
    onTapScreen,
  };
}
