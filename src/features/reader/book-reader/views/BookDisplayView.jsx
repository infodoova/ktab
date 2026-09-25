import React from "react";
import { FlipBookViewer } from "../components/FlipBookViewer";
import { ReaderGlassHeader } from "../components/ReaderGlassHeader";
import { FastTravelModal } from "../components/FastTravelModal";
import { useBookReader } from "../hooks/useBookReader";
import { ALLOW_RIGHT_CLICK } from "../constants/readerConstants";
import { ErrorBoundary } from "@/components/common";
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
    handleGoToPage,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
    handleTogglePlay,
    onPagesGenerated,
    handleCanvasClick,
  } = useBookReader();

  return (
    <div
      dir="rtl"
      className={`ktab-book-display-root ktab-book-display-root--${theme}`}
      onClick={handleRootClick}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => {
        if (!ALLOW_RIGHT_CLICK) e.preventDefault();
      }}
      onSelectStart={(e) => e.preventDefault()}
    >
      {/* Apple Liquid Glass Floating Dock Controls */}
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
        isLocked={isLocked}
        onToggleLock={handleToggleLock}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isControlsVisible={isControlsVisible}
      />

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
    </div>
  );
}

export default BookDisplayView;
