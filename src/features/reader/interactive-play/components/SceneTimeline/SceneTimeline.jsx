import React, { useRef, useEffect, useState, useCallback } from "react";
import { Lock, ChevronLeft, ChevronRight } from "lucide-react";
import "./SceneTimeline.css";

/**
 * Connected Journey Track Timeline (Dark Glassmorphism).
 * Displays all scenes (1 to totalScenes) with left and right navigation arrows on PC.
 *
 * @param {Array} sceneHistory - Visited scenes
 * @param {Object} currentScene - Active scene
 * @param {(index: number) => void} onGoToScene - Navigation callback
 * @param {number} totalScenes - Total scenes (default 14)
 * @param {boolean} isGenerating - Whether next scene is generating
 */
export function SceneTimeline({
  sceneHistory = [],
  currentScene,
  onGoToScene,
  totalScenes = 14,
  isGenerating = false,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* Check whether container has horizontal scroll overflow */
  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const overflowing = maxScroll > 6;

    if (!overflowing) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const absScroll = Math.abs(scrollLeft);
    setCanScrollRight(absScroll > 4);
    setCanScrollLeft(absScroll < maxScroll - 4);
  }, []);

  /* Observe container and track size changes to keep arrow states accurate */
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      checkScroll();
    });
    const el = containerRef.current;
    if (!el) return () => cancelAnimationFrame(frameId);

    let ro;
    if (typeof window !== "undefined" && window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        checkScroll();
      });
      ro.observe(el);
      if (trackRef.current) {
        ro.observe(trackRef.current);
      }
    }

    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScroll]);

  /* Auto-scroll active node into view and update arrow states */
  useEffect(() => {
    if (!trackRef.current) return;
    const activeNode = trackRef.current.querySelector("[data-active='true']");
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      const timer = setTimeout(checkScroll, 350);
      return () => clearTimeout(timer);
    }
  }, [currentScene, checkScroll]);

  /* Handle manual arrow clicks */
  const handleScroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const step = 200;
    // In RTL, negative scroll moves left (later scenes), positive moves right (earlier scenes)
    const delta = direction === "left" ? -step : step;
    el.scrollBy({ left: delta, behavior: "smooth" });
    setTimeout(checkScroll, 320);
  };

  const allSteps = Array.from({ length: totalScenes }, (_, i) => {
    const stepNum = i + 1;
    const historyIndex = sceneHistory.findIndex(
      (s) => (s.sceneNumber || 0) === stepNum || s.sceneId === `turn_${stepNum}`
    );
    const historyScene = historyIndex !== -1 ? sceneHistory[historyIndex] : null;
    const isVisited = Boolean(historyScene);
    const isCurrent =
      Boolean(currentScene && (currentScene.sceneNumber === stepNum || currentScene.sceneId === `turn_${stepNum}`));
    const isCompleted = Boolean(historyScene?.chosenNodeId);
    const isGeneratingNode = isCurrent && (isGenerating || currentScene?.isPending);
    const isLocked = !isVisited;

    return {
      stepNum,
      historyIndex,
      isVisited,
      isCurrent,
      isCompleted,
      isGeneratingNode,
      isLocked,
    };
  });

  return (
    <nav className="ktab-connected-timeline" dir="rtl" aria-label="خطوات القصة">
      {/* Scroll Arrow Right (Points to earlier scenes / Scene 1 in RTL) */}
      <button
        type="button"
        className="ktab-connected-timeline__scroll-btn ktab-connected-timeline__scroll-btn--right"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        aria-label="التمرير للمشاهد السابقة"
        title="المشاهد السابقة"
      >
        <ChevronRight size={15} strokeWidth={2.4} />
      </button>

      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="ktab-connected-timeline__container"
      >
        <div ref={trackRef} className="ktab-connected-timeline__track">
          {allSteps.map((step, idx) => {
            const canNavigate = step.isVisited && !isGenerating && !step.isCurrent;

            return (
              <div key={step.stepNum} className="ktab-connected-timeline__node-wrapper">
                {/* Connecting track line to previous node */}
                {idx > 0 && (
                  <div
                    className={`ktab-connected-timeline__line ${
                      allSteps[idx - 1].isCompleted
                        ? "ktab-connected-timeline__line--completed"
                        : allSteps[idx - 1].isVisited
                        ? "ktab-connected-timeline__line--visited"
                        : "ktab-connected-timeline__line--locked"
                    }`}
                  />
                )}

                <button
                  type="button"
                  data-active={step.isCurrent}
                  disabled={!canNavigate}
                  onClick={() => canNavigate && onGoToScene(step.historyIndex)}
                  className={[
                    "ktab-connected-timeline__node",
                    step.isCurrent && "ktab-connected-timeline__node--active",
                    step.isCompleted && "ktab-connected-timeline__node--completed",
                    step.isGeneratingNode && "ktab-connected-timeline__node--generating",
                    step.isLocked && "ktab-connected-timeline__node--locked",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  title={
                    step.isLocked
                      ? `المشهد ${step.stepNum} (لم يُفتح بعد)`
                      : `المشهد ${step.stepNum}`
                  }
                  aria-label={
                    step.isLocked
                      ? `المشهد ${step.stepNum} مقفل`
                      : `الانتقال إلى المشهد ${step.stepNum}`
                  }
                >
                  {step.isLocked ? (
                    <>
                      <span className="ktab-connected-timeline__number ktab-connected-timeline__number--locked">{step.stepNum}</span>
                      <span className="ktab-connected-timeline__lock-badge" aria-hidden="true">
                        <Lock size={10} strokeWidth={2.6} />
                      </span>
                    </>
                  ) : (
                    <span className="ktab-connected-timeline__number">{step.stepNum}</span>
                  )}

                  {step.isGeneratingNode && (
                    <span className="ktab-connected-timeline__spinner" aria-hidden="true" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Arrow Left (Points to later scenes / Scene 14 in RTL) */}
      <button
        type="button"
        className="ktab-connected-timeline__scroll-btn ktab-connected-timeline__scroll-btn--left"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        aria-label="التمرير للمشاهد التالية"
        title="المشاهد التالية"
      >
        <ChevronLeft size={15} strokeWidth={2.4} />
      </button>
    </nav>
  );
}

export default SceneTimeline;
