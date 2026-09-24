import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Share2, Download, ChevronUp, Check, Loader2, RotateCcw, ArrowLeft } from "lucide-react";
import { PlayHeader } from "../components/PlayHeader/PlayHeader";
import { SceneArtwork } from "../components/SceneArtwork/SceneArtwork";
import { NarrativeCard } from "../components/NarrativeCard/NarrativeCard";
import { ChoiceCards } from "../components/ChoiceCards/ChoiceCards";
import { ChoicesBottomSheet } from "../components/ChoicesBottomSheet/ChoicesBottomSheet";
import { PlayConfirmModal } from "../components/PlayConfirmModal/PlayConfirmModal";
import { PlayError } from "../components/PlaySkeleton/PlaySkeleton";
import { PlaySessionLoader } from "../components/PlaySessionLoader/PlaySessionLoader";
import { useStorySession } from "../hooks/useStorySession";
import { useStoryKeyboard } from "../hooks/useStoryKeyboard";
import { ErrorBoundary } from "@/components/common";
import { AlertToast } from "@/components/myui/AlertToast";
import "./InteractivePlayView.css";

/**
 * Editorial Interactive Story Player View.
 * Desktop: Viewport-locked. Image LEFT, narrative RIGHT, 2×2 choices below.
 * Tablet / Mobile: Ambient image + centered artwork + full scrollable narrative + bottom sheet choices.
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
    isChoicesSheetOpen,
    setIsChoicesSheetOpen,
    lastFailedChoice,
    handleRetryChoice,
    handleSelectChoice,
    handleGoToScene,
    handleRestartSession,
    handleExitSession,
  } = useStorySession();

  const latestScene =
    sceneHistory && sceneHistory.length > 0
      ? sceneHistory[sceneHistory.length - 1]
      : null;

  const isLatestScene = Boolean(
    currentScene &&
    latestScene &&
    currentScene.sceneId === latestScene.sceneId
  );

  /* Final scene conclusion: no remaining choices and generation complete */
  const isEnding = Boolean(
    isLatestScene &&
    !generatingScene &&
    !currentScene?.isPending &&
    !currentScene?.chosenNodeId &&
    (!currentScene?.nodes || currentScene.nodes.length === 0)
  );

  const isCurrentActive = Boolean(
    isLatestScene &&
    !currentScene?.isPending &&
    !currentScene?.chosenNodeId &&
    !generatingScene &&
    !isEnding
  );

  const totalScenes = storyMetadata?.storyScenes || storyMetadata?.sceneCount || 14;

  /* Index of the currently displayed scene within history — used for prev/next navigation */
  const currentHistoryIndex = currentScene
    ? (sceneHistory || []).findIndex((s) => s.sceneId === currentScene.sceneId)
    : -1;
  const canGoPrev = currentHistoryIndex > 0;
  const canGoNext =
    Boolean(sceneHistory) &&
    currentHistoryIndex >= 0 &&
    currentHistoryIndex < sceneHistory.length - 1;

  /* Keyboard shortcuts hook must be called unconditionally on every render to obey Rules of Hooks */
  useStoryKeyboard({
    canGoPrev: canGoPrev && !loading,
    canGoNext: canGoNext && !loading,
    onGoPrev: () => handleGoToScene(currentHistoryIndex - 1),
    onGoNext: () => handleGoToScene(currentHistoryIndex + 1),
    nodes: currentScene?.nodes || [],
    onSelectChoice: handleSelectChoice,
    isCurrentActive: isCurrentActive && !loading,
    isGenerating: generatingScene || loading,
    previewImage,
    onClosePreview: () => setPreviewImage(null),
    isChoicesSheetOpen,
    onCloseChoicesSheet: () => setIsChoicesSheetOpen(false),
  });

  if (loading) {
    return <PlaySessionLoader />;
  }

  if (error || !currentScene) {
    return <PlayError error={error} onExit={handleExitSession} />;
  }

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

            {/* Desktop next-scene arrow — left of image (points forward in RTL timeline) */}
            <button
              type="button"
              className="interactive-play__nav-arrow interactive-play__nav-arrow--prev"
              onClick={() => canGoNext && handleGoToScene(currentHistoryIndex + 1)}
              disabled={!canGoNext || generatingScene}
              aria-label="المشهد التالي"
              title="المشهد التالي"
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
                showRetry={false}
                onRetry={handleRetryChoice}
              />
            </div>

            {/* Desktop prev-scene arrow — right of narrative (points back to Scene 1 in RTL) */}
            <button
              type="button"
              className="interactive-play__nav-arrow interactive-play__nav-arrow--next"
              onClick={() => canGoPrev && handleGoToScene(currentHistoryIndex - 1)}
              disabled={!canGoPrev || generatingScene}
              aria-label="المشهد السابق"
              title="المشهد السابق"
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
              isEnding={isEnding}
              onRestart={() => setShowRestartConfirm(true)}
              onExit={() => setShowExitConfirm(true)}
            />
          </div>
        </ErrorBoundary>
      </main>

      {/* Mobile & Tablet (< 1024px): Sleek, persistent bottom action trigger bar */}
      <div className="interactive-play__choices-mobile-bar">
        {Boolean(lastFailedChoice) && !generatingScene ? (
          /* Error State: Replaces "اختر مسارك التالي" with prominent retry */
          <button
            type="button"
            className="interactive-play__choices-trigger interactive-play__choices-trigger--error"
            onClick={handleRetryChoice}
            aria-label="إعادة محاولة توليد المشهد"
          >
            <span className="interactive-play__choices-trigger-title">
              تعذر الاتصال • انقر لإعادة المحاولة
            </span>
            <div className="interactive-play__choices-trigger-icon-wrap" aria-hidden="true">
              <RotateCcw size={16} strokeWidth={2.4} />
            </div>
          </button>
        ) : generatingScene || currentScene.isPending ? (
          /* Pro Loading State: Sleek rotating spinner, no dots, no green */
          <div className="interactive-play__choices-trigger interactive-play__choices-trigger--generating">
            <span className="interactive-play__choices-trigger-title">
              جاري إعداد وكتابة المشهد التالي...
            </span>
            <div className="interactive-play__choices-trigger-icon-wrap" aria-hidden="true">
              <Loader2 size={16} className="interactive-play__pro-spinner" strokeWidth={2.4} />
            </div>
          </div>
        ) : isEnding ? (
          /* Ending State: Two prominent actions side-by-side (Restart & Exit) */
          <div className="interactive-play__ending-mobile-bar">
            <button
              type="button"
              className="interactive-play__ending-mobile-btn interactive-play__ending-mobile-btn--restart"
              onClick={() => setShowRestartConfirm(true)}
              aria-label="إعادة بدء القصة"
            >
              <RotateCcw size={16} strokeWidth={2.4} />
              <span>إعادة بدء القصة</span>
            </button>
            <button
              type="button"
              className="interactive-play__ending-mobile-btn interactive-play__ending-mobile-btn--exit"
              onClick={() => setShowExitConfirm(true)}
              aria-label="الخروج من القصة"
            >
              <span>الخروج</span>
              <ArrowLeft size={16} strokeWidth={2.4} />
            </button>
          </div>
        ) : isCurrentActive ? (
          /* Active Choice State: Centered text, no "4 choices" badge */
          <button
            type="button"
            className="interactive-play__choices-trigger interactive-play__choices-trigger--active"
            onClick={() => setIsChoicesSheetOpen(true)}
            aria-label="عرض خيارات المسار التالي"
          >
            <span className="interactive-play__choices-trigger-title">
              اختر مسارك التالي
            </span>
            <div className="interactive-play__choices-trigger-icon-wrap" aria-hidden="true">
              <ChevronUp size={17} strokeWidth={2.6} />
            </div>
          </button>
        ) : currentScene.chosenNodeId ? (
          /* Chosen Path State */
          <button
            type="button"
            className="interactive-play__choices-trigger interactive-play__choices-trigger--chosen"
            onClick={() => setIsChoicesSheetOpen(true)}
            aria-label="عرض الخيار المختار"
          >
            <span className="interactive-play__choices-trigger-title">
              المسار المختار: {currentScene.nodes?.find((n) => n.nodeId === currentScene.chosenNodeId)?.nodeText || currentScene.chosenNodeId}
            </span>
            <div className="interactive-play__choices-trigger-icon-wrap" aria-hidden="true">
              <ChevronUp size={17} strokeWidth={2.6} />
            </div>
          </button>
        ) : (
          /* Readonly / Past Scene State */
          <button
            type="button"
            className="interactive-play__choices-trigger interactive-play__choices-trigger--readonly"
            onClick={() => setIsChoicesSheetOpen(true)}
            aria-label="عرض خيارات المشهد السابق"
          >
            <span className="interactive-play__choices-trigger-title">
              مشهد سابق (عرض الخيارات)
            </span>
            <div className="interactive-play__choices-trigger-icon-wrap" aria-hidden="true">
              <ChevronUp size={17} strokeWidth={2.6} />
            </div>
          </button>
        )}
      </div>

      {/* Choices Bottom Sheet Modal (< 1024px) */}
      <ChoicesBottomSheet
        isOpen={isChoicesSheetOpen}
        onClose={() => setIsChoicesSheetOpen(false)}
        nodes={currentScene.nodes || []}
        onNodeClick={(node) => {
          handleSelectChoice(node);
          setIsChoicesSheetOpen(false);
        }}
        disabled={!isCurrentActive}
        chosenNodeId={currentScene.chosenNodeId}
        isGenerating={generatingScene || currentScene.isPending}
        sceneId={currentScene.sceneNumber || currentScene.sceneId}
        isEnding={isEnding}
        onRestart={() => {
          setIsChoicesSheetOpen(false);
          setShowRestartConfirm(true);
        }}
        onExit={() => {
          setIsChoicesSheetOpen(false);
          setShowExitConfirm(true);
        }}
      />

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
          variant="exit"
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
          variant="restart"
          onConfirm={handleRestartSession}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}
    </div>
  );
}

/**
 * Safely triggers an in-browser download of a Blob by creating an ephemeral object URL.
 */
function triggerBlobDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

/**
 * Triggers a direct file download of an image onto the user's device.
 * Uses a Cloudflare edge-proxy fallback to safely obtain image bytes for
 * Blob downloads, preventing unwanted full-page navigation away from the application.
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

  // 2. Direct simple fetch (without custom auth headers to avoid S3 presigned CORS rejection)
  try {
    const res = await fetch(imageUrl, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // CORS restricted on direct origin, proceed to proxy
  }

  // 3. Cloudflare-backed proxy fetch with Access-Control-Allow-Origin: *
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxyUrl, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Proxy fetch failed, proceed to canvas fallback
  }

  // 4. Canvas extraction fallback via proxy
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = proxyUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) {
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Canvas extraction fallback failed
  }

  // 5. Non-destructive fallback: open in new tab (never navigate current window away)
  try {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}

/**
 * Inline image preview modal with carousel navigation, ghost-tap protection, and actions.
 */
function ImagePreview({ scenes = [], previewImage, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const openTimestampRef = useRef(0);

  const initialIndex = scenes.findIndex((s) => s.sceneImage === previewImage);

  const [prevImage, setPrevImage] = useState(previewImage);
  if (previewImage !== prevImage) {
    setPrevImage(previewImage);
    if (previewImage && initialIndex >= 0) {
      setCurrentIndex(initialIndex);
    }
  }

  useEffect(() => {
    if (previewImage) {
      openTimestampRef.current = Date.now();
    }
  }, [previewImage]);

  // Prevents accidental touch-bleed or synthetic click propagation from previous view
  const isGhostTap = useCallback(() => {
    return Date.now() - openTimestampRef.current < 450;
  }, []);

  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (isGhostTap()) return;
      if (scenes.length > 0) setCurrentIndex((p) => (p + 1) % scenes.length);
    },
    [scenes.length, isGhostTap]
  );

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (isGhostTap()) return;
      if (scenes.length > 0) setCurrentIndex((p) => (p - 1 + scenes.length) % scenes.length);
    },
    [scenes.length, isGhostTap]
  );

  const currentScene = scenes[currentIndex];

  const handleShare = useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (isGhostTap()) return;
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
    [currentScene, currentIndex, isGhostTap]
  );

  const handleDownload = useCallback(
    async (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (isGhostTap()) return;
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
    [currentScene, currentIndex, downloading, isGhostTap]
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
