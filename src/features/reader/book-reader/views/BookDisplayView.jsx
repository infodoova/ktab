import React from "react";
import { FlipBookViewer } from "../components/FlipBookViewer";
import { ReaderGlassHeader } from "../components/ReaderGlassHeader";
import { FastTravelModal } from "../components/FastTravelModal";
import { MobilePageNav } from "../components/MobilePageNav";
import { useBookReader } from "../hooks/useBookReader";
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
    >
      {/* Apple Liquid Glass Floating Dock Controls */}
      <ReaderGlassHeader
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
            isRTL={true}
            onPageChange={handlePageChange}
            onPagesGenerated={onPagesGenerated}
          />
        </ErrorBoundary>
      </main>

      {/* Fast Travel Modal (50-Page Chunked Direct Nodes) */}
      <FastTravelModal
        isOpen={activeModal === "fastTravel"}
        onClose={handleCloseModal}
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={handleGoToPage}
      />

      {/* Mobile Bottom Page Navigation Bar (Swipe Prev & Next + Center Page Indicator) */}
      <MobilePageNav
        currentPage={currentPage}
        totalPages={totalPages}
        isLocked={isLocked}
        theme={theme}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onOpenFastTravel={handleOpenFastTravel}
      />
    </div>
  );
}

export default BookDisplayView;
