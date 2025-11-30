import React, { useRef } from "react";
import ReaderHeader from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/HeaderBarComponent";
import ReaderFooter from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FooterBarComponent";
import FlipBookViewer from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FlipBookViewerComponent";

export default function BookDisplay() {
  const bookRef = useRef(null);

  const handleNext = () => bookRef.current?.pageFlip().flipPrev();
  const handlePrev = () => bookRef.current?.pageFlip().flipNext();

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
      <ReaderHeader />

   
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <FlipBookViewer bookRef={bookRef} />
        </div>
      </main>

      <ReaderFooter onNext={handleNext} onPrev={handlePrev} />
    </div>
  );
}