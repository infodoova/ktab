import React, { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { DUMMY_TEXT } from "./dummy";

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */
function splitTextByWords(text, wordsPerPage = 300) {
  const words = text.trim().split(/\s+/);
  const pages = [];

  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }

  return pages;
}

/* -------------------------------------------------------
   PAGE COMPONENT
------------------------------------------------------- */
const Page = forwardRef(({ number, children }, ref) => (
  <div ref={ref} className="bg-white border-r border-gray-200 overflow-hidden">
    <div className="h-full p-6 flex flex-col bg-white/70 backdrop-blur-sm">
      <div className="flex-grow flex flex-col justify-center text-center">
        <div className="font-serif leading-8 text-[13px]">{children}</div>
      </div>

      {number && (
        <div className="mt-3 flex justify-center">
          <span className="text-xs text-gray-400 font-serif">{number}</span>
        </div>
      )}
    </div>
  </div>
));

/* -------------------------------------------------------
   SKELETON
------------------------------------------------------- */
const BookSkeleton = ({ width, height }) => (
  <div
    className="flex items-center justify-center w-full h-full absolute inset-0 z-40 pointer-events-none"
    style={{ direction: "rtl" }}
  >
    <div
      className="relative flex shadow-2xl rounded-xl overflow-hidden"
      style={{
        width: width || 550,
        height: height || 380,
        background: "linear-gradient(90deg,#f5f5f5 0%,#fafafa 50%,#f5f5f5 100%)",
      }}
    >
      <div className="w-1/2 h-full bg-gray-100 animate-pulse" />
      <div className="w-[4px] bg-gray-300" />
      <div className="w-1/2 h-full bg-gray-100 animate-pulse" />
    </div>
  </div>
);

/* -------------------------------------------------------
   MAIN VIEWER
------------------------------------------------------- */
export default function FlipBookViewer({ bookRef, isRTL = true }) {
  const containerRef = useRef(null);
  const internalRef = useRef(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowFlipbook(true);
      setShowSkeleton(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const wordsPerPage = 150;
  const paginatedText = splitTextByWords(DUMMY_TEXT, wordsPerPage);

  const totalPages = paginatedText.length + 1; 

  /* -------------------------------------------------------
     Expose goToPage + totalPages safely
  ------------------------------------------------------- */
  useEffect(() => {
    if (!bookRef) return;


    bookRef.current = bookRef.current || {};

    // expose a helper that returns the underlying PageFlip instance
    bookRef.current.pageFlip = () => internalRef.current?.pageFlip?.();
    bookRef.current.totalPages = totalPages;

    bookRef.current.goToPage = (pageNumber) => {
      try {
        const flip = internalRef.current?.pageFlip?.();
        if (!flip) return;

        let page = Number(pageNumber);
        if (!page || page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        flip.flip(page - 1);
      } catch (err) {
        console.warn("goToPage error:", err);
      }
    };
  }, [totalPages, bookRef]);

  /* -------------------------------------------------------
     Scroll to flip
  ------------------------------------------------------- */
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      try {
        const flip = internalRef.current?.pageFlip?.();
        if (!flip) return;

        if (e.deltaY > 0) {
          isRTL ? flip.flipPrev() : flip.flipNext();
        } else {
          isRTL ? flip.flipNext() : flip.flipPrev();
        }
      } catch {
        // ignore
      }
    };

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [bookRef, isRTL]);


const vh = window.innerHeight;
const vw = window.innerWidth;

// Responsive height logic
const bookHeight =
  vw < 600
    ? vh * 0.40       //  mobile 
    : vw < 1024
    ? vh * 0.55       // tablets
    : vh * 0.70;      // desktops 


  /* -------------------------------------------------------
     Render Flipbook
  ------------------------------------------------------- */
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ direction: "rtl" }}
    >
      {showSkeleton && !showFlipbook && (
        <BookSkeleton width={350} height={420} />
      )}
      

      {showFlipbook && (
      <HTMLFlipBook
  width={Math.min(window.innerWidth * 0.45, 800)}
  height={bookHeight}
  size="stretch"
  minWidth={250}
  minHeight={300}
  maxWidth={900}
  maxHeight={700}
  usePortrait
  flippingTime={500}
  flipDirection="rtl"
  maxShadowOpacity={0.1}
  showPageCorner={false}
  ref={internalRef}
  className="overflow-hidden rounded-xl"
>

          {/* COVER PAGE */}
          <Page number={1}>
            <h2 className="text-3xl font-serif mb-2">أسرار الواحة</h2>
            <p className="text-lg">د. إبراهيم الكوني</p>
          </Page>

          {/* CONTENT PAGES */}
          {paginatedText.map((txt, i) => (
            <Page key={i + 2} number={i + 2}>
              <p style={{ whiteSpace: "pre-line", textAlign: "justify" }}>
                {txt}
              </p>
            </Page>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
}
