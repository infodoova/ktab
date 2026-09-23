import React, { useRef, useEffect } from "react";
import { Lock } from "lucide-react";
import "./SceneTimeline.css";

/**
 * Connected Journey Track Timeline (Dark Glassmorphism).
 * Displays all scenes (1 to totalScenes). Reached scenes are interactive;
 * future ungenerated scenes display a lock icon.
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
  const trackRef = useRef(null);

  /* Auto-scroll active node into view */
  useEffect(() => {
    if (!trackRef.current) return;
    const activeNode = trackRef.current.querySelector("[data-active='true']");
    if (activeNode) {
      activeNode.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentScene]);

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
    <nav className="ktab-connected-timeline" aria-label="خطوات القصة">
      <div className="ktab-connected-timeline__container">
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
                      <Lock size={8} className="ktab-connected-timeline__lock-badge" />
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
    </nav>
  );
}

export default SceneTimeline;
