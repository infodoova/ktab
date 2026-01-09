import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

/* ===============================
   TEXT NORMALIZATION
================================ */
function normalizeText(raw = "") {
  return String(raw)
    .normalize("NFC")
    .replace(/\u00A0/g, " ")
    .replace(/\r\n|\r/g, "\n");
}

/* ===============================
   TOKENIZATION (WORD-BASED)
================================ */
function tokenize(text) {
  const tokens = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    tokens.push({
      value: m[0],
      startChar: m.index,
      endChar: m.index + m[0].length - 1,
    });
  }
  return tokens;
}

/* ===============================
   PAGINATION (WORD COUNT)
================================ */
function paginate(tokens, wordsPerPage) {
  const pages = [];
  for (let i = 0; i < tokens.length; i += wordsPerPage) {
    pages.push({
      startWord: i,
      endWord: Math.min(i + wordsPerPage, tokens.length),
    });
  }
  return pages;
}

/* ===============================
   LOADER
================================ */
const BookLoader = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white rounded-xl shadow-xl p-6 text-gray-700">
      جاري تحميل الكتاب…
    </div>
  </div>
);

/* ===============================
   MAIN COMPONENT
================================ */
export default function FlipBookViewer({
  bookRef,
  text = "",
  loading = false,
  wordsPerPage = 100,
  isRTL = true,
  onPageChange,
}) {
  const containerRef = useRef(null);
  const flipRef = useRef(null);

  /* ---------- UI READY (ESLint-safe) ---------- */
  const [delayedReady, setDelayedReady] = useState(false);
  const delayRef = useRef(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Check if we are in a browser environment before adding listener
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Init
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    clearTimeout(delayRef.current);

    delayRef.current = setTimeout(() => {
      setDelayedReady(!loading);
    }, 0);

    return () => clearTimeout(delayRef.current);
  }, [loading]);

  const ready = !loading && delayedReady;

  /* ---------- DATA PIPELINE ---------- */
  const normalizedText = useMemo(() => normalizeText(text), [text]);
  const tokens = useMemo(() => tokenize(normalizedText), [normalizedText]);
  const pages = useMemo(
    () => paginate(tokens, wordsPerPage),
    [tokens, wordsPerPage]
  );
  const totalPages = pages.length;

  /* ---------- RESPONSIVE DIMENSIONS ---------- */
  const { width: vw, height: vh } = windowDimensions;
  const isMobile = vw < 768; // Tablet/Mobile breakpoint

  // Dimensions for a SINGLE page
  let pageWidth, pageHeight;

  if (isMobile) {
    // Single page view: Page takes most of the screen width
    pageWidth = Math.min(vw * 0.9, 600); 
    pageHeight = vh * 0.7; 
  } else {
    // Double page view: Page takes ~45% of screen width (so 2 pages fit)
    pageWidth = Math.min(vw * 0.45, 600);
    // Adjusted height logic for desktop
    pageHeight = vw < 1024 ? vh * 0.55 : vh * 0.7;
  }
  
  // Font size calculation to fit text
  const dynamicFontSize = isMobile ? "11px" : "15px";
  const dynamicLineHeight = isMobile ? "1.8" : "2.1";

  /* ---------- EXPOSE BOOK API ---------- */
  useEffect(() => {
    if (!bookRef) return;
    bookRef.current = bookRef.current || {};

    bookRef.current.pageFlip = () => flipRef.current?.pageFlip?.();
    bookRef.current.totalPages = totalPages;
    bookRef.current.totalWords = tokens.length;
    bookRef.current.totalChars = normalizedText.length;

    bookRef.current.getCurrentPageNumber = () => {
      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return 1;
      return (flip.getCurrentPageIndex?.() ?? 0) + 1;
    };

    bookRef.current.goToPage = (page) => {
      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return;
      const p = Math.min(Math.max(1, page), totalPages);
      flip.flip(p - 1);
    };

    bookRef.current.getWordRangeForPage = (page) => {
      const p = Math.min(Math.max(1, page), totalPages);
      const def = pages[p - 1];
      if (!def) return null;
      return {
        page: p,
        startWord: def.startWord,
        endWord: def.endWord,
      };
    };

    const pageCharRanges = pages.map((p, i) => {
      const first = tokens[p.startWord];
      const last = tokens[p.endWord - 1];
      return {
        page: i + 1,
        start: first?.startChar ?? 0,
        end: last?.endChar ?? 0,
      };
    });

    bookRef.current.getPageForChar = (charIndex) => {
      for (const r of pageCharRanges) {
        if (charIndex >= r.start && charIndex <= r.end) return r.page;
      }
      return null;
    };

    // Highlight a specific word by its index
    bookRef.current.highlightWordByIndex = (wordIndex) => {
      bookRef.current.clearAllHighlights?.();
      const el = document.querySelector(`[data-word-index="${wordIndex}"]`);
      if (el) {
        el.classList.add("tts-active-word");
      }
    };

    // Clear all word highlights
    bookRef.current.clearAllHighlights = () => {
      document.querySelectorAll(".tts-active-word").forEach((el) => {
        el.classList.remove("tts-active-word");
      });
    };

    // Get token info by word index
    bookRef.current.getTokenByIndex = (wordIndex) => {
      return tokens[wordIndex] || null;
    };
  }, [bookRef, pages, tokens, normalizedText, totalPages]);

  /* ---------- WHEEL NAV ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return;

      e.deltaY > 0
        ? isRTL
          ? flip.flipPrev()
          : flip.flipNext()
        : isRTL
        ? flip.flipNext()
        : flip.flipPrev();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isRTL]);


  /* ===============================
     RENDER
  ================================ */
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ direction: "rtl" }}
    >
      <style>{`
        .tts-active-word {
          background: linear-gradient(135deg, rgba(255,215,0,0.8) 0%, rgba(255,180,0,0.8) 100%);
          border-radius: 4px;
          padding: 2px 4px;
          margin: -2px -4px;
          box-shadow: 0 0 8px rgba(255,200,0,0.5);
          animation: highlight-pulse 0.3s ease-out;
        }
        @keyframes highlight-pulse {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>

      {loading && <BookLoader />}

      {ready && (
        <HTMLFlipBook
          ref={flipRef}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          usePortrait={isMobile}
          flipDirection={isRTL ? "rtl" : "ltr"}
          showPageCorner={false}
          maxShadowOpacity={0.1}
          className="rounded-xl shadow-2xl"
          onFlip={(e) => onPageChange?.((e?.data ?? 0) + 1)}
        >
          {pages.map((p, i) => (
            <Page 
              key={i} 
              number={i + 1}
              isMobile={isMobile}
              dynamicFontSize={dynamicFontSize}
              dynamicLineHeight={dynamicLineHeight}
            >
              {(() => {
                const out = [];
                for (let w = p.startWord; w < p.endWord; w++) {
                  const t = tokens[w];
                  if (!t) continue;
                  if (w !== p.startWord) out.push(" ");
                  out.push(
                    <span
                      key={w}
                      data-word-index={w}
                      data-word-start={t.startChar}
                      data-word-end={t.endChar}
                    >
                      {t.value}
                    </span>
                  );
                }
                return out;
              })()}
            </Page>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
}

/* ===============================
   PAGE COMPONENT
================================ */
const Page = forwardRef(({ number, children, isMobile, dynamicFontSize, dynamicLineHeight }, ref) => (
  <div ref={ref} className="bg-[#faf8f3] flex items-center justify-center overflow-hidden">
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "justify",
          lineHeight: dynamicLineHeight,
          fontSize: dynamicFontSize,
          fontFamily: "'Noto Naskh Arabic', serif",
          color: "#1f2937",
          userSelect: "none",
        }}
      >
        {children}
      </div>

      {number && (
        <div className="absolute bottom-4 text-xs text-gray-400 font-serif">
          {number}
        </div>
      )}
    </div>
  </div>
));
