import React, { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Share2, Download } from "lucide-react";
import { PlayHeader } from "../components/PlayHeader/PlayHeader";
import { SceneArtwork } from "../components/SceneArtwork/SceneArtwork";
import { NarrativeCard } from "../components/NarrativeCard/NarrativeCard";
import { ChoiceCards } from "../components/ChoiceCards/ChoiceCards";
import { PlayConfirmModal } from "../components/PlayConfirmModal/PlayConfirmModal";
import { PlayError } from "../components/PlaySkeleton/PlaySkeleton";
import { PlaySessionLoader } from "../components/PlaySessionLoader/PlaySessionLoader";
import { useStorySession } from "../hooks/useStorySession";
import { ErrorBoundary } from "@/components/common";
import { AlertToast } from "@/components/myui/AlertToast";
import tokenManager from "@/core/services/tokenManager";
import "./InteractivePlayView.css";

/**
 * Editorial Interactive Story Player View.
 * Desktop: Left 1:1 image + steps; Right narrative description + 4 glassy choices.
 * Mobile: Top horizontal slides + 1:1 image + scrollable text + fixed bottom choice pickers.
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
    lastFailedChoice,
    handleRetryChoice,
    handleSelectChoice,
    handleGoToScene,
    handleRestartSession,
    handleExitSession,
  } = useStorySession();

  if (loading) {
    return <PlaySessionLoader />;
  }

  if (error || !currentScene) {
    return <PlayError error={error} onExit={handleExitSession} />;
  }

  const latestScene =
    sceneHistory.length > 0 ? sceneHistory[sceneHistory.length - 1] : null;

  const isLatestScene = Boolean(
    currentScene &&
    latestScene &&
    currentScene.sceneId === latestScene.sceneId
  );

  const isCurrentActive = Boolean(
    isLatestScene &&
    !currentScene.isPending &&
    !currentScene.chosenNodeId &&
    !generatingScene
  );


  const totalScenes = storyMetadata?.storyScenes || storyMetadata?.sceneCount || 14;

  /* Index of the currently displayed scene within history — used for prev/next arrows */
  const currentHistoryIndex = sceneHistory.findIndex(
    (s) => s.sceneId === currentScene.sceneId
  );
  const canGoPrev = currentHistoryIndex > 0;
  const canGoNext = currentHistoryIndex >= 0 && currentHistoryIndex < sceneHistory.length - 1;

  return (
    <div className="interactive-play" dir="rtl">

      {/* Ambient background: blurred image covers ~35% of the left side */}
      <div className="interactive-play__ambient-bg" aria-hidden="true">
        {currentScene.sceneImage && (
          <div
            className="interactive-play__ambient-image"
            style={{ backgroundImage: `url(${currentScene.sceneImage})` }}
          />
        )}
        <div className="interactive-play__ambient-overlay" />
      </div>

      {/* Unified Top Bar */}
      <PlayHeader
        title={storyMetadata?.title}
        onBack={() => setShowExitConfirm(true)}
        onRestart={() => setShowRestartConfirm(true)}
        sceneHistory={sceneHistory}
        currentScene={currentScene}
        onGoToScene={handleGoToScene}
        totalScenes={totalScenes}
        isGenerating={generatingScene}
      />

      <main className="interactive-play__stage">
        <ErrorBoundary
          variant="card"
          title="تعذر عرض المشهد التفاعلي"
          message="حدث خطأ غير متوقع أثناء معالجة المشهد التفاعلي. يمكنك إعادة المحاولة أو استئناف القصة."
        >
          {/*
           * LAYOUT: dir="ltr" on the row forces physical left→right order
           * regardless of the parent RTL context:
           *   Left column  (smaller): artwork
           *   Right column (larger):  narrative
           * Each card inner content restores dir="rtl".
           */}
          <div className="interactive-play__cards-row">

            {/* Desktop prev-scene arrow — left of image */}
            <button
              type="button"
              className="interactive-play__nav-arrow interactive-play__nav-arrow--prev"
              onClick={() => canGoPrev && handleGoToScene(currentHistoryIndex - 1)}
              disabled={!canGoPrev || generatingScene}
              aria-label="المشهد السابق"
              title="المشهد السابق"
            >
              ‹
            </button>

            <div className="interactive-play__artwork-slot">
              <SceneArtwork
                image={currentScene.sceneImage}
                onImageClick={(img) => setPreviewImage(img)}
                isGenerating={generatingScene}
              />
            </div>

            <div className="interactive-play__narrative-slot">
              <NarrativeCard
                text={currentScene.sceneText}
                isGenerating={generatingScene}
                showRetry={Boolean(lastFailedChoice) && !generatingScene}
                onRetry={handleRetryChoice}
              />
            </div>

            {/* Desktop next-scene arrow — right of narrative */}
            <button
              type="button"
              className="interactive-play__nav-arrow interactive-play__nav-arrow--next"
              onClick={() => canGoNext && handleGoToScene(currentHistoryIndex + 1)}
              disabled={!canGoNext || generatingScene}
              aria-label="المشهد التالي"
              title="المشهد التالي"
            >
              ›
            </button>
          </div>

          {/* Row 2: Full-width 2×2 choices — desktop only */}
          <div className="interactive-play__choices-row interactive-play__choices-desktop">
            <ChoiceCards
              nodes={currentScene.nodes}
              onNodeClick={handleSelectChoice}
              disabled={!isCurrentActive}
              chosenNodeId={currentScene.chosenNodeId}
              isGenerating={generatingScene || currentScene.isPending}
            />
          </div>
        </ErrorBoundary>
      </main>

      {/* Mobile: Fixed bottom choices dock */}
      <div className="interactive-play__choices-mobile">
        <ChoiceCards
          nodes={currentScene.nodes}
          onNodeClick={handleSelectChoice}
          disabled={!isCurrentActive}
          chosenNodeId={currentScene.chosenNodeId}
          isGenerating={generatingScene || currentScene.isPending}
        />
      </div>

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
 * Triggers a direct file download of an image onto the user's device.
 * Attempts authenticated blob fetch first, falls back to canvas blob extraction,
 * and finally anchor tag download.
 */
async function downloadImageToDevice(imageUrl, filename) {
  if (!imageUrl) return false;

  // 1. Direct Data or Blob URL
  if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // 2. Fetch with blob + ngrok bypass + auth headers
  try {
    const headers = {
      "ngrok-skip-browser-warning": "true",
    };
    const token = tokenManager?.getToken?.();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(imageUrl, {
      method: "GET",
      headers,
    });

    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
      return true;
    }
  } catch {
    // Proceed to canvas extraction fallback
  }

  // 3. Canvas extraction fallback
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
      return true;
    }
  } catch {
    // Canvas tainted or blocked
  }

  // 4. Force download via programmatic anchor
  try {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}

/**
 * Inline image preview modal with carousel navigation and share/download actions.
 */
function ImagePreview({ scenes = [], previewImage, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const initialIndex = scenes.findIndex((s) => s.sceneImage === previewImage);

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

  const currentScene = scenes[currentIndex];

  const handleShare = useCallback(
    async (e) => {
      e?.stopPropagation();
      if (!currentScene?.sceneImage) return;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `المشهد ${currentIndex + 1} - كُتّاب`,
            text: currentScene.sceneText || "قصة تفاعلية على منصة كُتّاب",
            url: currentScene.sceneImage,
          });
          return;
        } catch {
          // User cancelled or share unhandled, fall back to copy
        }
      }

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(currentScene.sceneImage);
          AlertToast("تم نسخ رابط الصورة بنجاح", "SUCCESS");
        } catch {
          AlertToast("تعذر نسخ الرابط", "ERROR");
        }
      }
    },
    [currentScene, currentIndex]
  );

  const handleDownload = useCallback(
    async (e) => {
      e?.stopPropagation();
      if (!currentScene?.sceneImage || downloading) return;

      setDownloading(true);
      try {
        const filename = `ktab-story-scene-${currentIndex + 1}.png`;
        const success = await downloadImageToDevice(currentScene.sceneImage, filename);
        if (success) {
          AlertToast("تم حفظ الصورة في التنزيلات بنجاح", "SUCCESS");
        } else {
          AlertToast("تعذر تحميل الصورة، يرجى المحاولة لاحقاً", "ERROR");
        }
      } catch {
        AlertToast("حدث خطأ أثناء تحميل الصورة", "ERROR");
      } finally {
        setDownloading(false);
      }
    },
    [currentScene, currentIndex, downloading]
  );

  if (!previewImage) return null;

  return (
    <div className="interactive-play__preview-overlay" onClick={onClose}>
      {/* Top Close Icon */}
      <button
        type="button"
        className="interactive-play__preview-close-btn"
        onClick={onClose}
        title="إغلاق المعاينة"
        aria-label="إغلاق المعاينة"
      >
        <X size={18} />
      </button>

      <div className="interactive-play__preview-container" onClick={(e) => e.stopPropagation()}>
        {/* Media Frame with Nav Arrows */}
        <div className="interactive-play__preview-media">
          {currentScene?.sceneImage && (
            <img
              src={currentScene.sceneImage}
              alt={`المشهد ${currentIndex + 1}`}
              className="interactive-play__preview-img"
            />
          )}

          {scenes.length > 1 && (
            <>
              <button
                type="button"
                className="interactive-play__preview-nav interactive-play__preview-nav--prev"
                onClick={handlePrev}
                aria-label="المشهد السابق"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="interactive-play__preview-nav interactive-play__preview-nav--next"
                onClick={handleNext}
                aria-label="المشهد التالي"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Action Toolbar: Centered under the image on both desktop and mobile */}
        <div className="interactive-play__preview-toolbar">
          <button
            type="button"
            className="interactive-play__preview-btn"
            onClick={handleShare}
            title="مشاركة الصورة"
            aria-label="مشاركة الصورة"
          >
            <Share2 size={15} />
            <span>مشاركة</span>
          </button>

          <button
            type="button"
            className="interactive-play__preview-btn"
            onClick={handleDownload}
            title="تحميل الصورة"
            aria-label="تحميل الصورة"
          >
            <Download size={15} />
            <span>تحميل الصورة</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InteractivePlayView;
