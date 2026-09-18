import React, { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PlayHeader } from "../components/PlayHeader/PlayHeader";
import { SceneArtwork } from "../components/SceneArtwork/SceneArtwork";
import { NarrativeCard } from "../components/NarrativeCard/NarrativeCard";
import { ChoiceCards } from "../components/ChoiceCards/ChoiceCards";
import { SceneTimeline } from "../components/SceneTimeline/SceneTimeline";
import { PlayConfirmModal } from "../components/PlayConfirmModal/PlayConfirmModal";
import { PlaySkeleton, PlayError } from "../components/PlaySkeleton/PlaySkeleton";
import { useStorySession } from "../hooks/useStorySession";
import { ErrorBoundary } from "@/components/common";
import "./InteractivePlayView.css";

/**
 * Root view for the Interactive Story player.
 * Declarative JSX only — all state and logic lives in useStorySession.
 */
export function InteractivePlayView() {
  const {
    loading,
    generatingScene,
    currentScene,
    sceneHistory,
    error,
    storyMetadata,
    showExitConfirm,
    setShowExitConfirm,
    showRestartConfirm,
    setShowRestartConfirm,
    previewImage,
    setPreviewImage,
    sceneSelectorRef,
    lastFailedChoice,
    handleRetryChoice,
    handleSelectChoice,
    handleGoToScene,
    handleRestartSession,
    handleExitSession,
  } = useStorySession();

  if (loading) {
    return <PlaySkeleton />;
  }

  if (error || !currentScene) {
    return <PlayError error={error} onExit={handleExitSession} />;
  }

  const isCurrentActive =
    sceneHistory.length > 0 &&
    currentScene.sceneId === sceneHistory[sceneHistory.length - 1].sceneId;

  const totalScenes = storyMetadata?.storyScenes || storyMetadata?.sceneCount || 10;

  return (
    <div className="interactive-play">
      <PlayHeader
        title={storyMetadata?.title}
        onBack={() => setShowExitConfirm(true)}
        onRestart={() => setShowRestartConfirm(true)}
      />

      <main className="interactive-play__stage">
        <ErrorBoundary
          variant="card"
          title="تعذر عرض المشهد التفاعلي"
          message="حدث خطأ غير متوقع أثناء معالجة المشهد التفاعلي. يمكنك إعادة المحاولة أو استئناف القصة."
        >
          <div className="interactive-play__grid">
            {/* Left column: artwork + desktop timeline */}
            <div className="interactive-play__left">
              <SceneArtwork
                image={currentScene.sceneImage}
                onImageClick={(img) => setPreviewImage(img)}
                isGenerating={generatingScene}
              />
              <SceneTimeline
                sceneHistory={sceneHistory}
                currentScene={currentScene}
                onGoToScene={handleGoToScene}
                totalScenes={totalScenes}
                externalRef={sceneSelectorRef}
              />
            </div>

            {/* Mobile timeline (between artwork and narrative on small screens) */}
            <div className="interactive-play__mobile-timeline">
              <SceneTimeline
                sceneHistory={sceneHistory}
                currentScene={currentScene}
                onGoToScene={handleGoToScene}
                totalScenes={totalScenes}
              />
            </div>

            {/* Right column: narrative + choices */}
            <div className="interactive-play__right">
              <NarrativeCard
                text={currentScene.sceneText}
                sceneNumber={currentScene.sceneNumber}
                showRetry={Boolean(lastFailedChoice) && !generatingScene}
                onRetry={handleRetryChoice}
              />
              <ChoiceCards
                nodes={currentScene.nodes}
                onNodeClick={handleSelectChoice}
                disabled={!isCurrentActive || Boolean(currentScene.chosenNodeId)}
                chosenNodeId={currentScene.chosenNodeId}
                isGenerating={generatingScene}
              />
            </div>
          </div>
        </ErrorBoundary>
      </main>

      {/* Image Preview Modal */}
      <ImagePreview
        scenes={sceneHistory}
        previewImage={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Exit Confirmation */}
      {showExitConfirm && (
        <PlayConfirmModal
          title="الخروج من القصة"
          message="هل تريد الخروج؟ يمكنك استئناف مغامرتك لاحقاً."
          confirmText="تأكيد الخروج"
          onConfirm={handleExitSession}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}

      {/* Restart Confirmation */}
      {showRestartConfirm && (
        <PlayConfirmModal
          title="إعادة بدء القصة"
          message="هل تريد البدء من المشهد الأول من جديد؟ سيتم فقدان تقدمك الحالي."
          confirmText="إعادة البدء"
          onConfirm={handleRestartSession}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}
    </div>
  );
}

/**
 * Inline image preview modal with carousel navigation.
 * Kept in this file since it only depends on the view's preview state.
 */
function ImagePreview({ scenes = [], previewImage, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const initialIndex = scenes.findIndex((s) => s.sceneImage === previewImage);

  /* Sync index when preview opens */
  const [prevImage, setPrevImage] = useState(previewImage);
  if (previewImage !== prevImage) {
    setPrevImage(previewImage);
    if (previewImage && initialIndex >= 0) {
      setCurrentIndex(initialIndex);
    }
  }

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (scenes.length > 0) setCurrentIndex((p) => (p + 1) % scenes.length);
    },
    [scenes.length]
  );

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (scenes.length > 0) setCurrentIndex((p) => (p - 1 + scenes.length) % scenes.length);
    },
    [scenes.length]
  );

  if (!previewImage) return null;
  const currentScene = scenes[currentIndex];

  return (
    <div className="interactive-play__preview-overlay" onClick={onClose}>
      <div className="interactive-play__preview-container" onClick={(e) => e.stopPropagation()}>
        {currentScene?.sceneImage && (
          <img
            src={currentScene.sceneImage}
            alt={`Scene ${currentIndex + 1}`}
            className="interactive-play__preview-img"
          />
        )}

        <button className="interactive-play__preview-close" onClick={onClose}>
          <X size={18} />
        </button>

        {scenes.length > 1 && (
          <>
            <button
              className="interactive-play__preview-nav interactive-play__preview-nav--prev"
              onClick={handlePrev}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="interactive-play__preview-nav interactive-play__preview-nav--next"
              onClick={handleNext}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default InteractivePlayView;
