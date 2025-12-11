import React, { useRef } from "react";
import ReaderHeader from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/HeaderBarComponent";
import ReaderFooter from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FooterBarComponent";
import FlipBookViewer from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FlipBookViewerComponent";

export default function BookDisplay() {
  const bookRef = useRef(null);

  const handleNext = () => {
    try {
      bookRef.current?.pageFlip?.().flipPrev();
    } catch (e) {
      console.warn("Next page error:", e);
    }
  };

  const handlePrev = () => {
    try {
      bookRef.current?.pageFlip?.().flipNext();
    } catch (e) {
      console.warn("Prev page error:", e);
    }
  };

  // 🔁 NEW: connect header's goto-page to FlipBookViewer
  const handleGoToPage = (pageNumber) => {
    try {
      if (bookRef.current?.goToPage) {
        bookRef.current.goToPage(pageNumber);
      } else {
        console.warn("goToPage is not ready yet");
      }
    } catch (e) {
      console.warn("GoToPage error:", e);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <div
      className="
        w-full 
        bg-[#f2e8d5] 
        flex flex-col 
        h-screen 
        min-h-[100vh] 
        min-h-[100dvh]
      "
    >
      <ReaderHeader onBack={handleBack} onGoToPage={handleGoToPage} />

      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <FlipBookViewer bookRef={bookRef} />
        </div>
      </main>

      <ReaderFooter onNext={handleNext} onPrev={handlePrev} />
    </div>
  );
}
