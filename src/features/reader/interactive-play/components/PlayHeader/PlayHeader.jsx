import React from "react";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { SceneTimeline } from "../SceneTimeline/SceneTimeline";
import "./PlayHeader.css";

/**
 * Unified Dark Glassmorphism Top Bar for the Interactive Story Player.
 * Right (in RTL): Story title with truncation (...)
 * Center: Scrollable timeline with all scene balls (and locks)
 * Left: Action controls (Retry/Restart & Back/Exit)
 */
export function PlayHeader({
  title,
  onBack,
  onRestart,
  sceneHistory,
  currentScene,
  onGoToScene,
  totalScenes,
  isGenerating,
}) {
  return (
    <header className="play-header" dir="rtl">
      {/* Right Column (in RTL): Story Title with max-width and ellipsis */}
      <div className="play-header__title-slot">
        <h1 className="play-header__title" title={title || "قصة تفاعلية"}>
          {title || "قصة تفاعلية"}
        </h1>
      </div>

      {/* Center Column: Scrollable scene track with all scenes and lock indicators */}
      <div className="play-header__center-slot">
        <SceneTimeline
          sceneHistory={sceneHistory}
          currentScene={currentScene}
          onGoToScene={onGoToScene}
          totalScenes={totalScenes}
          isGenerating={isGenerating}
        />
      </div>

      {/* Left Column (in RTL): Action buttons (Restart + Exit/Back) */}
      <div className="play-header__actions-slot">
        <button
          type="button"
          className="play-header__action-btn"
          onClick={onRestart}
          title="إعادة بدء القصة من المشهد الأول"
          aria-label="إعادة بدء القصة"
        >
          <RotateCcw size={14} />
          <span className="play-header__action-label">إعادة</span>
        </button>

        <button
          type="button"
          className="play-header__action-btn play-header__action-btn--exit"
          onClick={onBack}
          title="الخروج من القصة"
          aria-label="الخروج من القصة"
        >
          <span className="play-header__action-label">خروج</span>
          <ArrowLeft size={14} />
        </button>
      </div>
    </header>
  );
}

export default PlayHeader;
