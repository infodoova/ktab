import React, { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

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
   PROFESSIONAL LOADER
------------------------------------------------------- */
const BookLoader = ({ width, height }) => (
  <div
    className="absolute inset-0 z-50 flex items-center justify-center bg-black/30"
    style={{ direction: "rtl" }}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl overflow-hidden flex gap-6 p-6 items-center max-w-[90%]"
      style={{
        width: width || 600,
        height: height || 420,
      }}
    >
      {/* Cover placeholder */}
      <div className="w-40 h-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-inner animate-pulse" />

      {/* Content placeholder */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-6 animate-pulse" />

        <div className="flex items-center gap-4">
          <svg
            className="h-8 w-8 text-gray-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <div>
            <div className="text-sm text-gray-700">جاري تحميل الكتاب...</div>
            <div className="text-xs text-gray-500">يرجى الانتظار — يتم تجهيز النص والعرض</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------
  MAIN VIEWER
------------------------------------------------------- */
export default function FlipBookViewer({ bookRef, isRTL = true, text = "", loading = false }) {
  const containerRef = useRef(null);
  const internalRef = useRef(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (loading) {
      setShowFlipbook(false);
      setShowSkeleton(true);
      return;
    }

    const t = setTimeout(() => {
      setShowFlipbook(true);
      setShowSkeleton(false);
    }, 800);
    return () => clearTimeout(t);
  }, [loading]);

  const wordsPerPage = 100;
  const paginatedText = splitTextByWords((text || "").trim(), wordsPerPage);

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
    // compute character ranges per content page so external code can map charIndex -> page
    try {
      const pageRanges = [];
      let idx = 0;
      paginatedText.forEach((txt, i) => {
        const len = txt ? txt.length : 0;
        const start = idx;
        const end = Math.max(idx + len - 1, start);
        const pageNumber = i + 2; // cover is page 1
        pageRanges.push({ page: pageNumber, start, end });
        idx += len;
      });

      bookRef.current.getPageForChar = (charIndex) => {
        if (charIndex == null || Number.isNaN(Number(charIndex))) return null;
        const n = Number(charIndex);
        for (const r of pageRanges) {
          if (n >= r.start && n <= r.end) return r.page;
        }
        return null;
      };
      bookRef.current.totalChars = pageRanges.length ? pageRanges[pageRanges.length - 1].end + 1 : 0;
    } catch (err) {
      // non-fatal
      console.warn("pageRanges compute error:", err);
    }
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
      {/* Highlight styling for active characters (added here to keep component-scoped) */}
      <style>{`
        .active {
          background: rgba(255, 230, 128, 0.6);
          border-radius: 2px;
          transition: background-color 120ms ease-in-out;
        }
      `}</style>
      {showSkeleton && !showFlipbook && (
        <BookLoader width={350} height={420} />
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
          {(() => {
            // render pages but assign global continuous data-char indices
            let globalIndex = 0;
            return paginatedText.map((txt, i) => (
              <Page key={i + 2} number={i + 2}>
                <p>
                  {Array.from(txt).map((c) => {
                    const idx = globalIndex++;
                    return (
                      <span key={idx} data-char={idx}>
                        {c}
                      </span>
                    );
                  })}
                </p>
              </Page>
            ));
          })()}
        </HTMLFlipBook>
      )}
    </div>
  );
}
