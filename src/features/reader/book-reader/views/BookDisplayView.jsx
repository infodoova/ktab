import React from "react";
import { FlipBookViewer } from "../components/FlipBookViewer";
import { ReaderGlassHeader } from "../components/ReaderGlassHeader";
import { FastTravelModal } from "../components/FastTravelModal";
import { PageImageGenModal } from "../components/PageImageGenModal";
import { useBookReader } from "../hooks/useBookReader";
import { ALLOW_RIGHT_CLICK } from "../constants/readerConstants";
import { ErrorBoundary } from "@/components/common";
import { AlertToast } from "@/components/myui/AlertToast";
import "./BookDisplayView.css";

/**
 * Editorial Liquid Glass Full-Screen Reader View.
 * Displays a single-page book reading canvas occupying the viewport up to the top,
 * controlled by an Apple-inspired liquid glass floating dock and popovers.
 * Pure declarative markup driven entirely by useBookReader custom hook.
 */
export function BookDisplayView() {
  const {
    handleBack,
    handleRootClick,
    bookRef,
    bookTitle,
    bookAuthor,
    bookText,
    loadingText,
    wordsPerPage,
    voice,
    setVoice,
    effect,
    setEffect,
    fontSize,
    handleFontSizeChange,
    theme,
    handleSelectTheme,
    transitionMode,
    handleSelectTransitionMode,
    isPlaying,
    currentPage,
    totalPages,
    isLocked,
    handleToggleLock,
    isFullscreen,
    handleToggleFullscreen,
    isControlsVisible,
    activePopover,
    handleTogglePopover,
    activeModal,
    handleCloseModal,
    handleOpenFastTravel,
    handleOpenImageGen,
    isImageGenActive,
    imageGenPages,
    bookId,
    handleGoToPage,
    handlePageChange,
    handleTogglePlay,
    onPagesGenerated,
    handleCanvasClick,
  } = useBookReader();

  return (
    <div
      dir="rtl"
      className={`ktab-book-display-root ktab-book-display-root--${theme} ${
        isImageGenActive ? "ktab-book-display-root--image-gen-active" : ""
      }`}
      onClick={handleRootClick}
      onCopy={(e) => {
        e.preventDefault();
        AlertToast("تم إيقاف النسخ لحماية حقوق نشر الكتاب", "INFO");
      }}
      onCut={(e) => {
        e.preventDefault();
        AlertToast("تم إيقاف النسخ لحماية حقوق نشر الكتاب", "INFO");
      }}
      onContextMenu={(e) => {
        if (!ALLOW_RIGHT_CLICK) e.preventDefault();
      }}
    >
      {/* Hide floating dock and popovers completely during image generation to keep screen distraction-free */}
      {!isImageGenActive && (
        <ReaderGlassHeader
          bookTitle={bookTitle}
          onBack={handleBack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          voice={voice}
          onSelectVoice={setVoice}
          effect={effect}
          onSelectEffect={setEffect}
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
          theme={theme}
          onSelectTheme={handleSelectTheme}
          transitionMode={transitionMode}
          onSelectTransitionMode={handleSelectTransitionMode}
          activePopover={activePopover}
          onTogglePopover={handleTogglePopover}
          onOpenFastTravel={handleOpenFastTravel}
          onOpenImageGen={handleOpenImageGen}
          isLocked={isLocked}
          onToggleLock={handleToggleLock}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          isControlsVisible={isControlsVisible}
        />
      )}

      {/* Main Single-Page FlipBook Canvas */}
      <main
        className="ktab-book-display-canvas"
        onClick={handleCanvasClick}
      >
        <ErrorBoundary
          variant="card"
          title="تعذر عرض صفحات الكتاب"
          message="حدث خطأ غير متوقع أثناء معالجة صفحات الكتاب. يرجى المحاولة مرة أخرى."
          className="ktab-book-display-error-card"
        >
          {/* Keep FlipBookViewer mounted in memory so page text indices remain stable */}
          <div
            style={{
              display: isImageGenActive ? "none" : "block",
              width: "100%",
              height: "100%",
            }}
          >
            <FlipBookViewer
              bookRef={bookRef}
              text={bookText}
              loading={loadingText}
              fontSize={fontSize}
              wordsPerPage={wordsPerPage}
              theme={theme}
              transitionMode={transitionMode}
              isRTL={true}
              isLocked={isLocked}
              onPageChange={handlePageChange}
              onPagesGenerated={onPagesGenerated}
              bookTitle={bookTitle}
              bookAuthor={bookAuthor}
              onBack={handleBack}
            />
          </div>

          {/* Clean 3-Page Continuous Reading Sheet beside the AI Image Generation modal */}
          {isImageGenActive && (
            <div className="ktab-3page-preview-wrapper" dir="rtl">
              <div className={`ktab-3page-preview-sheet ktab-3page-preview-sheet--${theme}`}>
                <div
                  className="ktab-3page-preview-sheet__body"
                  onCopy={(e) => {
                    e.preventDefault();
                    AlertToast("النسخ غير متاح داخل القارئ", "WARNING");
                  }}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {imageGenPages.map((item) => (
                    <article key={item.pageNum} className="ktab-3page-section">
                      <div className="ktab-3page-section__divider" aria-hidden="true">
                        <span className="ktab-3page-section__pill" unselectable="on">
                          الصفحة {item.pageNum}
                        </span>
                      </div>
                      <p className="ktab-3page-section__text">{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Fast Travel Modal (50-Page Chunked Direct Nodes) */}
      <FastTravelModal
        isOpen={activeModal === "fastTravel"}
        onClose={handleCloseModal}
        currentPage={currentPage}
        totalPages={totalPages}
        theme={theme}
        onGoToPage={handleGoToPage}
      />

      {/* AI Page Illustration Generator Drawer */}
      <PageImageGenModal
        isOpen={activeModal === "imageGen"}
        onClose={handleCloseModal}
        bookId={bookId}
        bookTitle={bookTitle}
        currentPage={currentPage}
        totalPages={totalPages}
        bookRef={bookRef}
        theme={theme}
      />
    </div>
  );
}

export default BookDisplayView;
