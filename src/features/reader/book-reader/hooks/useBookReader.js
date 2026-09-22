import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBookContent, saveReadingProgress } from "../services/bookReaderService";
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
  } = useReaderPreferencesStore();


  const bookRef = useRef(null);
  const [bookText, setBookText] = useState("");
  const [loadingText, setLoadingText] = useState(true);
  const [wordsPerPage] = useState(60);

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
        const textContent =
          typeof data === "string"
            ? data
            : (data?.text || data?.content || (typeof res?.data === "string" ? res.data : ""));

        if (active) {
          setBookText(textContent || "");
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

  const EFFECT_FILES = {
    rain: rainFile,
    wind: windFile,
    nature: natureFile,
  };

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
  }, []);

  const handleNextPage = useCallback(() => {
    if (bookRef.current?.pageFlip) {
      bookRef.current.pageFlip().flipNext();
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    if (bookRef.current?.pageFlip) {
      bookRef.current.pageFlip().flipPrev();
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
        if (nextInfo) {
          startPageStream(
            {
              bookId: id,
              voiceId: voice,
              startWord: nextInfo.startWord,
              endWord: nextInfo.endWord,
              isLastPage: nextPage === pages.length,
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
          startPageStream(
            {
              bookId: id,
              voiceId: voice,
              startWord: info.startWord,
              endWord: info.endWord,
              isLastPage: newPage === pages.length,
            },
            info.startChar
          );
        }
      }
    },
    [isPlaying, id, voice, token, startPageStream]
  );


  const handleTogglePlay = useCallback(async () => {
    if (!isPlaying) {
      const pages = generatedPagesRef.current;
      const info = pages[currentPage - 1];
      if (info) {
        await togglePlay();
        startPageStream(
          {
            bookId: id,
            voiceId: voice,
            startWord: info.startWord,
            endWord: info.endWord,
            isLastPage: currentPage === pages.length,
          },
          info.startChar
        );
      }
    } else {
      togglePlay();
      cancelStream();
    }
  }, [isPlaying, currentPage, id, voice, togglePlay, startPageStream, cancelStream]);

  return {
    id,
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
    currentPage,
    isPlaying,
    isStreaming,
    isTTSLoading,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageChange,
    handleTogglePlay,
    onPagesGenerated,
  };
}
