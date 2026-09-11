import React, { useEffect } from "react";
import { ReaderHeaderBar } from "../components/ReaderHeaderBar";
import { ReaderFooterBar } from "../components/ReaderFooterBar";
import { FlipBookViewer } from "../components/FlipBookViewer";
import { useBookReader } from "../hooks/useBookReader";
import { ErrorBoundary } from "@/components/common";

/**
 * Pure presentation view for the full-screen FlipBook Reader experience.
 */
export function BookDisplayView() {
  const {
    navigate,
    bookRef,
    bookText,
    loadingText,
    wordsPerPage,
    voice,
    setVoice,
    effect,
    setEffect,
    isMuted,
    volume,
    fontSize,
    handleFontSizeChange,
    cycleVolume,
    isPlaying,
    isTTSLoading,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageChange,
    handleTogglePlay,
    onPagesGenerated,
  } = useBookReader();

  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
    };
  }, []);

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-white text-black flex flex-col overflow-hidden"
    >
      {/* Top Controls Toolbar */}
      <ReaderHeaderBar
        onBack={() => navigate(-1)}
        onGoToPage={handleGoToPage}
        effect={effect}
        setEffect={setEffect}
        volume={volume}
        voice={voice}
        onSelectVoice={setVoice}
        isMuted={isMuted}
        onCycleVolume={cycleVolume}
        isLoading={isTTSLoading}
      />

      {/* Main FlipBook Canvas */}
      <main className="flex-1 w-full h-full flex items-center justify-center pt-20 pb-28 px-2 sm:px-6">
        <ErrorBoundary
          variant="card"
          title="تعذر عرض صفحات الكتاب"
          message="حدث خطأ غير متوقع أثناء معالجة صفحات الكتاب أو الرسم التفاعلي. يرجى المحاولة مرة أخرى."
          className="w-full max-w-xl"
        >
          <FlipBookViewer
            bookRef={bookRef}
            text={bookText}
            loading={loadingText}
            fontSize={fontSize}
            wordsPerPage={wordsPerPage}
            isRTL={true}
            onPageChange={handlePageChange}
            onPagesGenerated={onPagesGenerated}
          />
        </ErrorBoundary>
      </main>


      {/* Bottom Controls Toolbar */}
      <ReaderFooterBar
        onNext={handleNextPage}
        onPrev={handlePrevPage}
        isPlaying={isPlaying}
        isLoading={isTTSLoading}
        onTogglePlay={handleTogglePlay}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
    </div>
  );
}

export default BookDisplayView;
