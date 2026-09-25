import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchBookContent, saveReadingProgress } from "../services/bookReaderService";
import { fetchBookDetailsById } from "@/features/reader/book-details/services/bookDetailsService";
import { AlertToast } from "@/components/myui/AlertToast";
import { useAuthStore, useReaderPreferencesStore } from "@/core/store";
import { useReaderTTS } from "./useReaderTTS";
import {
  createAudioContextSafe,
  fetchAndDecode,
  createGainNode,
} from "../utils/readerUtils";

import rainFile from "@/assets/audio/rain.mp3";
import windFile from "@/assets/audio/wind.mp3";
import natureFile from "@/assets/audio/nature.mp3";

const EFFECT_FILES = {
  rain: rainFile,
  wind: windFile,
  nature: natureFile,
};

/**
 * Master hook for FlipBook reading, background ambient sound effects, and TTS integration.
 */
export function useBookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  // Persistent Reader Preferences from Zustand
  const {
    fontSize,
    setFontSize,
    voice,
    setVoice,
    ambientEffect: effect,
    setAmbientEffect: setEffect,
    volume,
    isMuted,
    cycleVolume,
    theme = "pure-white",
    setTheme,
    transitionMode = "curl",
    setTransitionMode,
  } = useReaderPreferencesStore();

  const [isLocked, setIsLocked] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [activePopover, setActivePopover] = useState(null); // "theme" | "font" | "ambient" | "voices" | null
  const [activeModal, setActiveModal] = useState(null); // "fastTravel" | null
  const location = useLocation();
  const [bookTitle, setBookTitle] = useState(() => {
    return (
      location?.state?.bookTitle ||
      location?.state?.title ||
      location?.state?.book?.title ||
      ""
    );
  });
  const [bookAuthor, setBookAuthor] = useState(() => {
    return (
      location?.state?.bookAuthor ||
      location?.state?.author ||
      location?.state?.book?.author ||
      location?.state?.authorName ||
      location?.state?.book?.authorName ||
      ""
    );
  });
  const [totalPages, setTotalPages] = useState(1);

  const bookRef = useRef(null);
  const [bookText, setBookText] = useState("");
  const [loadingText, setLoadingText] = useState(true);
  const [wordsPerPage] = useState(80);

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    const percent = Math.round((newSize / 18) * 100);
    AlertToast(`مستوى الخط: ${percent}%`, "INFO");
  };


  // Load Book Text
  useEffect(() => {
    let active = true;

    async function loadBookData() {
      setLoadingText(true);
      try {
        const res = await fetchBookContent(id);

        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message || "فشل تحميل الكتاب", res?.messageStatus || "ERROR");
          setLoadingText(false);
          return;
        }

        const data = res.data;
        let rawContent = "";
        if (typeof data === "string") {
          rawContent = data;
        } else if (Array.isArray(data)) {
          rawContent = data
            .map((item) => (typeof item === "string" ? item : item?.text || item?.content || ""))
            .filter(Boolean)
            .join("\n\n");
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.pages)) {
            rawContent = data.pages
              .map((p) => (typeof p === "string" ? p : p?.text || p?.content || ""))
              .filter(Boolean)
              .join("\n\n");
          } else if (Array.isArray(data.chapters)) {
            rawContent = data.chapters
              .map((c) => (typeof c === "string" ? c : c?.text || c?.content || ""))
              .filter(Boolean)
              .join("\n\n");
          } else {
            rawContent = data.text || data.content || data.bookText || "";
          }
        }

        // Clean out literal stringified null/undefined artifacts
        const cleaned = String(rawContent || "")
          .replace(/\b(null|undefined)\b/gi, "")
          .trim();

        // Use authentic backend text directly
        const finalContent = cleaned;

        if (active) {
          if (data?.title || data?.bookTitle || data?.name) {
            setBookTitle(data.title || data.bookTitle || data.name);
          }
          if (data?.author || data?.authorName || data?.authors) {
            const rawAuth = data?.author || data?.authorName || data?.authors;
            const authStr = Array.isArray(rawAuth)
              ? rawAuth.map((a) => (typeof a === "string" ? a : a?.name || a?.authorName)).filter(Boolean).join("، ")
              : (typeof rawAuth === "string" ? rawAuth : "");
            if (authStr) setBookAuthor(authStr);
          }

          if (!bookTitle || !bookAuthor) {
            fetchBookDetailsById(id)
              .then((metaRes) => {
                if (!active) return;
                if (metaRes?.data?.title || metaRes?.data?.name) {
                  setBookTitle(metaRes.data.title || metaRes.data.name);
                }
                const rawAuth = metaRes?.data?.author || metaRes?.data?.authorName || metaRes?.data?.authors;
                if (rawAuth) {
                  const authStr = Array.isArray(rawAuth)
                    ? rawAuth.map((a) => (typeof a === "string" ? a : a?.name || a?.authorName)).filter(Boolean).join("، ")
                    : (typeof rawAuth === "string" ? rawAuth : "");
                  if (authStr) setBookAuthor(authStr);
                }
              })
              .catch(() => {});
          }

          setBookText(finalContent);
          const wordEstimate = finalContent.trim().split(/\s+/).filter(Boolean).length;
          const pageEstimate = Math.max(1, Math.ceil(wordEstimate / 110));
          setTotalPages(pageEstimate);
          setLoadingText(false);
        }
      } catch (err) {
        console.error("Book text load error:", err);
        AlertToast("فشل الاتصال بالخادم لتحميل نص الكتاب", "ERROR");
        if (active) setLoadingText(false);
      }
    }

    if (id) loadBookData();

    return () => {
      active = false;
    };
  }, [id]);

  // Web Audio Context for Ambient Background Sound
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const currentSourceRef = useRef(null);
  const audioBuffersRef = useRef({});
  const loadingAudioRef = useRef({});

  useEffect(() => {
    const ctx = createAudioContextSafe();
    if (!ctx) return;
    audioCtxRef.current = ctx;

    const gain = createGainNode(ctx, isMuted ? 0 : volume);
    gainNodeRef.current = gain;

    return () => {
      if (currentSourceRef.current) {
        try {
          currentSourceRef.current.stop();
          currentSourceRef.current.disconnect();
        } catch {
          // Ignored
        }
        currentSourceRef.current = null;
      }
      try {
        ctx.close();
      } catch {
        // Ignored
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ambient Gain Volume Update
  useEffect(() => {
    const gain = gainNodeRef.current;
    const ctx = audioCtxRef.current;
    if (!gain || !ctx) return;

    const targetVal = isMuted ? 0 : volume;
    try {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(targetVal, ctx.currentTime + 0.1);
    } catch {
      gain.gain.value = targetVal;
    }
  }, [volume, isMuted]);

  // Ambient Effect Switch (Lazy-loaded on demand)
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) return;

    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
      } catch {
        // Ignored
      }
      currentSourceRef.current = null;
    }

    if (effect === "none" || !EFFECT_FILES[effect]) return;

    let isMounted = true;

    async function playAmbient() {
      try {
        let buffer = audioBuffersRef.current[effect];
        if (!buffer) {
          if (loadingAudioRef.current[effect]) {
            buffer = await loadingAudioRef.current[effect];
          } else {
            const loadPromise = fetchAndDecode(ctx, EFFECT_FILES[effect]);
            loadingAudioRef.current[effect] = loadPromise;
            buffer = await loadPromise;
            audioBuffersRef.current[effect] = buffer;
          }
        }

        if (!isMounted || !buffer) return;

        if (ctx.state === "suspended") {
          await ctx.resume().catch((err) => console.warn("ctx.resume failed:", err));
        }

        if (currentSourceRef.current) {
          try {
            currentSourceRef.current.stop();
            currentSourceRef.current.disconnect();
          } catch {
            // Ignored
          }
        }

        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        src.connect(gain);
        src.start(0);
        currentSourceRef.current = src;
      } catch (err) {
        console.warn("Ambient sound load error:", err);
      }
    }

    playAmbient();

    return () => {
      isMounted = false;
    };
  }, [effect]);

  // Current page tracking for TTS
  const [currentPage, setCurrentPage] = useState(1);
  const generatedPagesRef = useRef([]);

  const onPagesGenerated = useCallback((pageInfo) => {
    generatedPagesRef.current = pageInfo;
    if (pageInfo?.length) {
      setTotalPages(pageInfo.length);
    }
  }, []);

  const handleToggleLock = useCallback(() => {
    setIsLocked((prev) => {
      const next = !prev;
      if (next) {
        setActiveModal(null);
      }
      return next;
    });
  }, []);

  const toggleControls = useCallback(() => {
    if (isLocked) return;
    setIsControlsVisible((prev) => !prev);
  }, [isLocked]);

  const handleTogglePopover = useCallback(
    (popoverName) => {
      if (isLocked) return;
      setActivePopover((prev) => (prev === popoverName ? null : popoverName));
    },
    [isLocked]
  );

  const handleClosePopover = useCallback(() => {
    setActivePopover(null);
  }, []);

  const handleOpenModal = useCallback(
    (modalName) => {
      if (isLocked) return;
      setActiveModal(modalName);
      setActivePopover(null);
    },
    [isLocked]
  );

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleSelectTheme = useCallback(
    (newTheme) => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  const handleCycleTheme = useCallback(() => {
    const sequence = ["pure-white", "warm-cream", "paper-sepia", "charcoal-dark"];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
    const names = {
      "pure-white": "أبيض نقي",
      "warm-cream": "كريمي دافئ",
      "paper-sepia": "ورق عتيق",
      "charcoal-dark": "ليلي داكن",
    };
    AlertToast(`السمة: ${names[nextTheme] || nextTheme}`, "INFO");
  }, [theme, setTheme]);

  const handleOpenFastTravel = useCallback(() => {
    if (isLocked) return;
    setActiveModal((prev) => (prev === "fastTravel" ? null : "fastTravel"));
  }, [isLocked]);

  const handleNextPage = useCallback(() => {
    try {
      if (bookRef.current?.nextPage) {
        bookRef.current.nextPage();
      } else if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipNext();
      }
    } catch {
      // Ignored if rapid flip animation is in progress
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    try {
      if (bookRef.current?.prevPage) {
        bookRef.current.prevPage();
      } else if (bookRef.current?.pageFlip) {
        bookRef.current.pageFlip().flipPrev();
      }
    } catch {
      // Ignored if rapid flip animation is in progress
    }
  }, []);

  const handleGoToPage = useCallback((pageNum) => {
    if (bookRef.current?.goToPage) {
      bookRef.current.goToPage(pageNum);
      setCurrentPage(pageNum);
    }
  }, []);

  // TTS Hook
  const {
    isPlaying,
    isStreaming,
    isLoading: isTTSLoading,
    togglePlay,
    startPageStream,
    cancelStream,
  } = useReaderTTS({
    enabled: Boolean(token),
    onPageEnded: handleNextPage,
    onPrefetchNextPage: () => {
      const nextPage = currentPage + 1;
      const pages = generatedPagesRef.current;
      if (nextPage <= pages.length) {
        const nextInfo = pages[nextPage - 1];
        if (nextInfo && !nextInfo.isEndPage) {
          startPageStream(
            {
              bookId: id,
              voiceId: voice,
              startWord: nextInfo.startWord,
              endWord: nextInfo.endWord,
              isLastPage: nextPage === pages.length - 1,
            },
            nextInfo.startChar,
            { prefetch: true }
          );
        }
      }
    },
  });

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      if (token && id && newPage) {
        const total = generatedPagesRef.current.length || 1;
        saveReadingProgress(id, { page: newPage, totalPages: total }).catch(() => {});
      }
      if (isPlaying) {
        const pages = generatedPagesRef.current;
        const info = pages[newPage - 1];
        if (info) {
          if (info.isEndPage) {
            cancelStream();
            togglePlay();
            return;
          }
          startPageStream(
            {
              bookId: id,
              voiceId: voice,
              startWord: info.startWord,
              endWord: info.endWord,
              isLastPage: newPage === pages.length - 1,
            },
            info.startChar
          );
        }
      }
    },
    [isPlaying, id, voice, token, startPageStream, cancelStream, togglePlay]
  );


  const handleTogglePlay = useCallback(async () => {
    if (!isPlaying) {
      const pages = generatedPagesRef.current;
      const info = pages[currentPage - 1];
      if (info && !info.isEndPage) {
        await togglePlay();
        startPageStream(
          {
            bookId: id,
            voiceId: voice,
            startWord: info.startWord,
            endWord: info.endWord,
            isLastPage: currentPage === pages.length - 1,
          },
          info.startChar
        );
      }
    } else {
      togglePlay();
      cancelStream();
    }
  }, [isPlaying, currentPage, id, voice, togglePlay, startPageStream, cancelStream]);

  // Synchronize document body styles, theme backgrounds, and lock scroll leakage during reading session
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const originalBodyTouch = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const themeBgMap = {
      "pure-white": "#f8fafc",
      "warm-cream": "#f5eedc",
      "paper-sepia": "#ebe1c5",
      "charcoal-dark": "#0a0c10",
    };
    document.body.style.backgroundColor = themeBgMap[theme] || "#f8fafc";

    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      document.body.style.touchAction = originalBodyTouch;
    };
  }, [theme]);

  const handleCanvasClick = useCallback(
    (e) => {
      if (activePopover) {
        handleClosePopover();
        return;
      }
    },
    [activePopover, handleClosePopover]
  );

  const handleBack = useCallback(() => {
    const doc = document;
    if (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    ) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
    navigate(-1);
  }, [navigate]);

  const handleRootClick = useCallback(() => {
    if (activePopover) {
      handleClosePopover();
    }
  }, [activePopover, handleClosePopover]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);

      // Ensures HTML5 Fullscreen mode remains scoped exclusively to the reader view and is automatically dismissed upon route transitions or component unmount
      const doc = document;
      if (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ) {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      const doc = document;
      const docEl = document.documentElement;

      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFs) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch {
      // Ignored if user dismissed or permission denied
    }
  }, []);

  return {
    id,
    navigate,
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
    isMuted,
    volume,
    cycleVolume,
    fontSize,
    handleFontSizeChange,
    theme,
    handleSelectTheme,
    handleCycleTheme,
    transitionMode,
    handleSelectTransitionMode: setTransitionMode,
    isLocked,
    handleToggleLock,
    isFullscreen,
    handleToggleFullscreen,
    isControlsVisible,
    toggleControls,
    activePopover,
    handleTogglePopover,
    handleClosePopover,
    activeModal,
    handleOpenModal,
    handleCloseModal,
    handleOpenFastTravel,
    currentPage,
    totalPages,
    isPlaying,
    isStreaming,
    isTTSLoading,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageChange,
    handleTogglePlay,
    onPagesGenerated,
    handleCanvasClick,
  };
}
