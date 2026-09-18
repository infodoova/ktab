import React, { useRef, useEffect } from "react";
import "./SceneTimeline.css";

/**
 * Unified scene journey timeline showing thumbnail dots and overall progress bar.
 * Combines the functionality of legacy SceneNavigator and StorylineProgress.
 *
 * @param {Array} sceneHistory - Array of all visited scenes
 * @param {Object} currentScene - Currently active scene object
 * @param {(index: number) => void} onGoToScene - Handler for scene navigation
 * @param {number} totalScenes - Total number of scenes in this story
 * @param {React.Ref} externalRef - Optional external ref for scroll control
 */
export function SceneTimeline({
  sceneHistory = [],
  currentScene,
  onGoToScene,
  totalScenes = 10,
  externalRef,
}) {
  const internalRef = useRef(null);
  const trackRef = externalRef || internalRef;

  /* Auto-scroll the active scene thumbnail into view */
  useEffect(() => {
    if (!trackRef.current) return;
    const activeBtn = trackRef.current.querySelector("[data-active='true']");
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentScene, trackRef]);

  const currentNumber = currentScene?.sceneNumber || 1;
  const progressPercent = Math.min(100, Math.round((currentNumber / totalScenes) * 100));

  return (
    <div className="scene-timeline">
      <div className="scene-timeline__header">
        <span className="scene-timeline__title">تاريخ الرحلة</span>
        <span className="scene-timeline__counter">
          المشهد {currentNumber} / {sceneHistory.length}
        </span>
      </div>

      <div ref={trackRef} className="scene-timeline__track">
        {sceneHistory.map((scene, index) => {
          const isActive = currentScene?.sceneId === scene.sceneId;
          return (
            <button
              key={scene.sceneId}
              data-active={isActive}
              onClick={() => onGoToScene(index)}
              className={`scene-timeline__dot ${isActive ? "scene-timeline__dot--active" : ""}`}
              style={{
                backgroundImage: scene.sceneImage ? `url(${scene.sceneImage})` : "none",
              }}
            >
              <div className="scene-timeline__dot-overlay" />
              <span className="scene-timeline__dot-number">{index + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="scene-timeline__progress">
        <div className="scene-timeline__progress-header">
          <span className="scene-timeline__progress-label">تقدم المغامرة</span>
          <span className="scene-timeline__progress-value">{progressPercent}%</span>
        </div>
        <div className="scene-timeline__progress-bar">
          <div
            className="scene-timeline__progress-fill"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="scene-timeline__progress-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SceneTimeline;
