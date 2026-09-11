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
   PAGINATION (DYNAMIC WORD COUNT)
================================ */
function paginate(tokens, wordsPerPageArray) {
  const pages = [];
  let currentIndex = 0;

  if (typeof wordsPerPageArray === "number") {
    while (currentIndex < tokens.length) {
      const endWord = Math.min(currentIndex + wordsPerPageArray, tokens.length);
      pages.push({
        startWord: currentIndex,
        endWord: endWord,
        wordCount: endWord - currentIndex,
      });
      currentIndex = endWord;
    }
  } else if (Array.isArray(wordsPerPageArray)) {
    for (let i = 0; i < wordsPerPageArray.length && currentIndex < tokens.length; i++) {
      const wordsInThisPage = wordsPerPageArray[i];
      const endWord = Math.min(currentIndex + wordsInThisPage, tokens.length);
      pages.push({
        startWord: currentIndex,
        endWord: endWord,
        wordCount: endWord - currentIndex,
      });
      currentIndex = endWord;
    }

    if (currentIndex < tokens.length && wordsPerPageArray.length > 0) {
      const lastWordsPerPage = wordsPerPageArray[wordsPerPageArray.length - 1];
      while (currentIndex < tokens.length) {
        const endWord = Math.min(currentIndex + lastWordsPerPage, tokens.length);
        pages.push({
          startWord: currentIndex,
          endWord: endWord,
          wordCount: endWord - currentIndex,
        });
        currentIndex = endWord;
      }
    }
  }

  return pages;
}

/* ===============================
   LOADER
================================ */
const BookLoader = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
    <div className="bg-white/95 backdrop-blur-[40px] rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] p-10 text-center border border-black/10">
      <div className="w-12 h-12 border-4 border-black/5 border-t-black rounded-full animate-spin mb-4 mx-auto" />
      <div className="text-xs font-black uppercase tracking-widest text-[var(--primary-text)]">
        جاري تحميل الكتاب…
      </div>
    </div>
  </div>
);

/* ===============================
   MAIN FLIPBOOK VIEWER COMPONENT
================================ */
export function FlipBookViewer({
  bookRef,
  text = "",
  loading = false,
  fontSize = 18,
  wordsPerPage = 100,
  isRTL = true,
  onPageChange,
  onPagesGenerated,
  readOnly = false,
}) {
  const containerRef = useRef(null);
  const flipRef = useRef(null);

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

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
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

  const { width: vw, height: vh } = windowDimensions;
  const isMobile = vw < 768;

  let pageWidth, pageHeight;
  if (isMobile) {
    pageWidth = Math.min(vw * 0.9, 550);
    pageHeight = vh * 0.7;
  } else {
    pageWidth = Math.min(vw * 0.42, 600);
    pageHeight = Math.min(vh - 260, vh * 0.65);
  }

  const dynamicFontSize = `${fontSize}px`;
  const dynamicLineHeight = isMobile ? "1.6" : "1.8";

  const calculatedWordsPerPage = useMemo(() => {
    const lineH = isMobile ? 1.6 : 1.8;
    const pixelsPerLine = fontSize * lineH;
    const paddingY = isMobile ? 100 : 140;
    const availableHeight = pageHeight - paddingY;
    const linesThatFit = Math.floor(availableHeight / pixelsPerLine);
    const paddingX = isMobile ? 40 : 80;
    const availableWidth = pageWidth - paddingX;
    const wordsPerLine = Math.floor(availableWidth / (fontSize * 0.9));
    // Conservative 75% safety limit to guarantee no vertical overflow for Arabic diacritics
    const safetyLimit = Math.floor(linesThatFit * wordsPerLine * 0.75);
    const finalWords = Math.min(wordsPerPage, safetyLimit);

    return Math.max(12, finalWords);
  }, [fontSize, isMobile, pageHeight, pageWidth, wordsPerPage]);

  const normalizedText = useMemo(() => normalizeText(text), [text]);
  const tokens = useMemo(() => tokenize(normalizedText), [normalizedText]);
  const pages = useMemo(
    () => paginate(tokens, calculatedWordsPerPage),
    [tokens, calculatedWordsPerPage]
  );
  const totalPages = pages.length;

  useEffect(() => {
    if (onPagesGenerated && pages.length > 0) {
      const pageInfo = pages.map((page, index) => ({
        pageNumber: index + 1,
        startWord: page.startWord,
        endWord: page.endWord,
        wordCount: page.wordCount,
        startChar: tokens[page.startWord]?.startChar ?? 0,
        endChar: tokens[page.endWord - 1]?.endChar ?? 0,
      }));
      onPagesGenerated(pageInfo);
    }
  }, [pages, tokens, onPagesGenerated]);

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
      const firstToken = tokens[def.startWord];
      return {
        page: p,
        startWord: def.startWord,
        endWord: def.endWord,
        wordCount: def.wordCount,
        startChar: firstToken ? firstToken.startChar : 0,
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

    bookRef.current.highlightWordByIndex = (wordIndex) => {
      bookRef.current.clearAllHighlights?.();
      const el = document.querySelector(`[data-word-index="${wordIndex}"]`);
      if (el) el.classList.add("tts-active-word");
    };

    bookRef.current.clearAllHighlights = () => {
      document.querySelectorAll(".tts-active-word").forEach((el) => {
        el.classList.remove("tts-active-word");
      });
    };

    bookRef.current.getTokenByIndex = (wordIndex) => tokens[wordIndex] || null;
  }, [bookRef, pages, tokens, normalizedText, totalPages]);

  const lastWheelTimeRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 350) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 20) return;

      const flip = flipRef.current?.pageFlip?.();
      if (!flip) return;

      e.preventDefault();
      lastWheelTimeRef.current = now;

      if (e.deltaY > 0) {
        if (isRTL) flip.flipPrev();
        else flip.flipNext();
      } else {
        if (isRTL) flip.flipNext();
        else flip.flipPrev();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isRTL]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center relative ${
        readOnly ? "pointer-events-none" : ""
      }`}
      style={{ direction: "rtl" }}
    >
      <style>{`
        .tts-active-word {
          background: #fff176 !important;
          color: #000 !important;
          border-radius: 2px;
          display: inline;
          position: relative;
          z-index: 1;
          box-shadow: 0 0 0 2px #fff176;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
        .stf__wrapper::before, .stf__wrapper::after {
          display: none;
        }
        .stf__item {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .stf__wrapper {
          position: relative;
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
          className="rounded-xl"
          onFlip={(e) => onPageChange?.((e?.data ?? 0) + 1)}
        >
          {pages.map((p, i) => (
            <Page
              key={i}
              number={i + 1}
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

const Page = forwardRef(({ number, children, dynamicFontSize, dynamicLineHeight }, ref) => (
  <div
    ref={ref}
    className="bg-white flex items-center justify-center overflow-hidden border border-black/5"
  >
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-6 sm:px-14">
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
          lineHeight: dynamicLineHeight,
          fontSize: dynamicFontSize,
          fontFamily: "'Tajawal', 'Cairo', sans-serif",
          color: "var(--primary-text)",
          userSelect: "text",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </div>
      {number && (
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center select-none pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-black/20 font-black tabular-nums">
            {number}
          </span>
        </div>
      )}
    </div>
  </div>
));

Page.displayName = "Page";

export default FlipBookViewer;
