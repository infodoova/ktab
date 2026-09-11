import React from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { SceneText } from "../components/SceneText";
import { NodeChoices } from "../components/NodeChoices";
import { ImageScenes } from "../components/ImageScenes";
import { ImagePreviewModal } from "../components/ImagePreviewModal";
import { SceneNavigator } from "../components/SceneNavigator";
import { StorylineProgress } from "../components/StorylineProgress";
import { Loaders } from "../components/Loaders";
import { useStorySession } from "../hooks/useStorySession";
import { ErrorBoundary } from "@/components/common";

/**
 * Pure presentation in-game player for Interactive Story sessions.
 */

export function InteractivePlayView() {
  const {
    isDarkMode,
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
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center">
        <Loaders type="initial" isDarkMode={isDarkMode} />
      </div>
    );
  }

  if (error || !currentScene) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center p-6 text-center space-y-6" dir="rtl">
        <h2 className="text-2xl font-black">{error || "تعذر بدء الجلسة"}</h2>
        <button
          onClick={handleExitSession}
          className="btn-premium px-8 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest"
        >
          العودة للقصص التفاعلية
        </button>
      </div>
    );
  }

  const isCurrentActive =
    sceneHistory.length > 0 &&
    currentScene.sceneId === sceneHistory[sceneHistory.length - 1].sceneId;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-x-hidden" dir="rtl">
      {/* Game Header Bar */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
            aria-label="الخروج"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white">
              {storyMetadata?.title || "المغامرة التفاعلية"}
            </h1>
            <span className="text-[10px] uppercase font-bold text-[#5de3ba] tracking-widest">
              جلسة نشطة
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRestartConfirm(true)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
            title="إعادة البدء من البداية"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <ErrorBoundary
          variant="card"
          title="تعذر عرض المشهد التفاعلي"
          message="حدث خطأ غير متوقع أثناء معالجة المشهد التفاعلي. يمكنك إعادة المحاولة أو استئناف القصة."
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Artwork & Journey Timeline */}
            <div className="lg:col-span-5 space-y-6">
              <ImageScenes
                image={currentScene.sceneImage}
                onImageClick={(img) => setPreviewImage(img)}
                isGenerating={generatingScene}
                isDarkMode={isDarkMode}
              />

              <SceneNavigator
                sceneHistory={sceneHistory}
                currentScene={currentScene}
                handleGoToScene={handleGoToScene}
                isDarkMode={isDarkMode}
                sceneSelectorRef={sceneSelectorRef}
                type="desktop"
              />

              <StorylineProgress
                currentScene={currentScene}
                storyMetadata={storyMetadata}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Right Column: Narrative & Decision Nodes */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8 bg-white/5 rounded-3xl p-6 md:p-10 border border-white/5 backdrop-blur-xl">
              {/* Narrative Text */}
              <SceneText
                text={currentScene.sceneText}
                sceneNumber={currentScene.sceneNumber}
                isDarkMode={isDarkMode}
              />

              {/* Retry Banner on Failure */}
              {lastFailedChoice && !generatingScene && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold">تعذر توليد المشهد التالي بسبب انقطاع الاتصال.</span>
                  <button
                    onClick={handleRetryChoice}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black tracking-wider transition-all active:scale-95 whitespace-nowrap"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}

              {/* Decision Choices */}
              {generatingScene ? (
                <Loaders type="generating" isDarkMode={isDarkMode} />
              ) : (
                <NodeChoices
                  nodes={currentScene.nodes}
                  onNodeClick={handleSelectChoice}
                  disabled={!isCurrentActive || Boolean(currentScene.chosenNodeId)}
                  chosenNodeId={currentScene.chosenNodeId}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </div>
        </ErrorBoundary>
      </main>


      {/* Mobile Scene Navigator */}
      <SceneNavigator
        sceneHistory={sceneHistory}
        currentScene={currentScene}
        handleGoToScene={handleGoToScene}
        isDarkMode={isDarkMode}
        sceneSelectorRef={sceneSelectorRef}
        type="mobile"
      />

      {/* Image Zoom Preview Modal */}
      <ImagePreviewModal
        isOpen={Boolean(previewImage)}
        scenes={sceneHistory}
        initialIndex={sceneHistory.findIndex((s) => s.sceneImage === previewImage)}
        onClose={() => setPreviewImage(null)}
      />

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <ConfirmDialog
          title="الخروج من القصة"
          message="هل تريد الخروج؟ يمكنك استئناف مغامرتك لاحقاً."
          confirmText="تأكيد الخروج"
          onConfirm={handleExitSession}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}

      {/* Restart Confirmation Modal */}
      {showRestartConfirm && (
        <ConfirmDialog
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

function ConfirmDialog({ title, message, confirmText, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
        <h3 className="text-xl font-black text-white">{title}</h3>
        <p className="text-white/60 text-sm">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl btn-premium text-white text-xs font-black uppercase tracking-widest active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InteractivePlayView;
