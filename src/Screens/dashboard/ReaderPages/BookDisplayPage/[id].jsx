import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import rainFile from "../../../../assets/audio/rain.mp3";
import windFile from "../../../../assets/audio/wind.mp3";
import naturefile from "../../../../assets/audio/nature.mp3";
import ReaderHeader from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/HeaderBarComponent";
import ReaderFooter from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FooterBarComponent";
import FlipBookViewer from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FlipBookViewerComponent";
import { useReaderTTS } from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/useReaderTTS";

import {
  createAudioContextSafe,
  fetchAndDecode,
  createGainNode,
} from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/utils";

import { getHelper } from "../../../../../apis/apiHelpers";
import { AlertToast } from "../../../../components/myui/AlertToast";
import { token } from "../../../../../store/authToken";

export default function BookDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gettoken = token();

  const bookRef = useRef(null);

  const [bookText, setBookText] = useState("");
  const [loadingText, setLoadingText] = useState(true);
  const [wordsPerPage] = useState(100);

  const [voice, setVoice] = useState("IES4nrmZdUBHByLBde0P");
  const [effect, setEffect] = useState("none");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.2); // volume of effects
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? 16 : 18; // 89% for mobile, 100% for PC
    }
    return 18;
  });

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    const percent = Math.round((newSize / 18) * 100);
    AlertToast(`مستوى الخط: ${percent}%`, "INFO");
  };

  // cycle volume: 0.2  -> 0.8 -> muted -> 0.2 ...
  const cycleVolume = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(0.2);
      return;
    }

    setVolume((prev) => {
      if (prev < 0.3) return 0.8;
      // last step: mute without changing stored volume
      setIsMuted(true);
      return prev;
    });
  }, [isMuted]);

  // track current page for restart logic (1-indexed)
  const currentPageRef = useRef(1);
  // track if TTS was started (not just paused)
  const ttsStartedRef = useRef(false);

  /* ===============================
     AMBIENT AUDIO (same as your setup)
  ================================ */
  const audioRefs = useRef({
    audioContext: null,
    buffers: {},
    gainNodes: {},
    sources: {},
    urls: {
      rain: rainFile,
      wind: windFile,
      nature: naturefile,
    },
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoadingText(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/reader/books/${id}/text`;
        const resp = await getHelper({ url });
        if (!mounted) return;

        const text =
          typeof resp?.data === "string" ? resp.data : (resp?.data?.text ?? "");

        setBookText(text || "محتوى الكتاب غير متوفر حالياً.");
      } catch (err) {
        console.error("Error loading book text:", err);
        AlertToast("تعذر تحميل نص الكتاب.", "ERROR");
        setBookText("محتوى الكتاب غير متوفر حالياً.");
      } finally {
        setLoadingText(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [id]);

  // Ambient init & cleanup - once on mount
  useEffect(() => {
    let mounted = true;
    const refs = audioRefs.current;

    const init = async () => {
      try {
        if (!refs.audioContext) {
          const ctx = createAudioContextSafe();
          if (!ctx) {
            console.warn(
              "AudioContext creation failed. Ambient sounds disabled.",
            );
            return;
          }
          refs.audioContext = ctx;

          // Create gain nodes immediately for all possible effects
          // Note: we use values from when init() runs, the second useEffect will correct them
          Object.keys(refs.urls).forEach((k) => {
            refs.gainNodes[k] = createGainNode(ctx, isMuted ? 0 : volume);
          });
        }

        const ctx = refs.audioContext;
        // Load buffers in parallel
        await Promise.all(
          Object.entries(refs.urls).map(async ([k, url]) => {
            if (refs.buffers[k]) return;
            try {
              const buf = await fetchAndDecode(ctx, url);
              if (mounted && buf) {
                refs.buffers[k] = buf;
              }
            } catch (err) {
              console.error(`Failed to load/decode ambient sound: ${k}`, err);
            }
          }),
        );
      } catch (err) {
        console.error("Critical error in ambient audio init:", err);
      }
    };

    init();

    return () => {
      mounted = false;
      Object.values(refs.sources).forEach((s) => {
        try {
          s.stop?.();
        } catch (err) {
          // Source might already be stopped
          console.debug("Ambient source stop failed:", err.message);
        }
      });
      refs.sources = {};
      try {
        refs.audioContext?.close?.();
      } catch (err) {
        console.error("Failed to close AudioContext:", err);
      }
      refs.audioContext = null;
      refs.buffers = {};
      refs.gainNodes = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Update effect/volume/mute - reacts to state changes
  useEffect(() => {
    const ctx = audioRefs.current.audioContext;
    if (!ctx) return;

    // 1. Update gain values for ALL gain nodes
    Object.values(audioRefs.current.gainNodes).forEach((g) => {
      if (g) {
        try {
          // Use ramp for smoother volume changes if possible
          if (g.gain.setTargetAtTime) {
            g.gain.setTargetAtTime(isMuted ? 0 : volume, ctx.currentTime, 0.1);
          } else {
            g.gain.value = isMuted ? 0 : volume;
          }
        } catch {
          g.gain.value = isMuted ? 0 : volume;
        }
      }
    });

    // 2. If muted, stop all sources and exit
    if (isMuted) {
      Object.values(audioRefs.current.sources).forEach((s) => {
        try {
          s.stop?.();
        } catch {
          // ignore - likely already stopped
        }
      });
      audioRefs.current.sources = {};
      return;
    }

    // 3. Resume context if suspended (browser requirement)
    if (ctx.state === "suspended") {
      ctx.resume().catch((err) => {
        console.warn(
          "Failed to resume audio context (likely requires user interaction):",
          err,
        );
      });
    }

    // 4. Handle effect change
    if (effect === "none") {
      Object.values(audioRefs.current.sources).forEach((s) => {
        try {
          s.stop?.();
        } catch {
          // ignore
        }
      });
      audioRefs.current.sources = {};
      return;
    }

    // If the requested effect is already playing, do nothing
    if (audioRefs.current.sources[effect]) return;

    // Stop other sources
    Object.entries(audioRefs.current.sources).forEach(([k, s]) => {
      if (k !== effect) {
        try {
          s.stop?.();
        } catch {
          // ignore
        }
        delete audioRefs.current.sources[k];
      }
    });

    // Start new source for the effect
    const buffer = audioRefs.current.buffers[effect];
    const gain = audioRefs.current.gainNodes[effect];
    if (!buffer || !gain) {
      // If we unmuted and had an effect, it might not be loaded yet
      console.warn(`Ambient sound "${effect}" not ready or missing.`);
      return;
    }

    try {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gain);
      src.start();
      audioRefs.current.sources[effect] = src;
    } catch (err) {
      console.error("Error starting ambient source:", err);
    }
  }, [effect, isMuted, volume]);

  /* ===============================
     TTS (improved algo with prefetching)
  ================================ */
  const sendPageRef = useRef(null);
  const prefetchPageRef = useRef(null);

  const {
    isPlaying: ttsPlaying,
    isStreaming,
    isLoading,
    togglePlay,
    startPageStream,
    cancelStream,
    promotePrefetch,
    hasPrefetch,
  } = useReaderTTS({
    enabled: voice !== "none",
    bookRef,
    onPageEnded: () => {
      if (!ttsStartedRef.current) return;

      const next = (currentPageRef.current || 1) + 1;
      const ok = bookRef.current?.getWordRangeForPage?.(next);
      if (!ok) {
        console.log("Last page reached, stopping TTS");
        ttsStartedRef.current = false;
        return;
      }

      console.log("Auto-advancing to page:", next);
      bookRef.current?.goToPage?.(next);
      currentPageRef.current = next;

      // Try to use prefetched audio for instant playback
      if (hasPrefetch()) {
        console.log("Using prefetched audio for instant playback");
        promotePrefetch();
      } else {
        // Fallback: request new stream (shouldn't happen if prefetch worked)
        console.log("No prefetch available, requesting fresh stream");
        sendPageRef.current?.(next).catch(console.error);
      }
    },
    onPrefetchNextPage: () => {
      // Called at ~80% through current page - prefetch next page's audio
      const next = (currentPageRef.current || 1) + 1;
      const ok = bookRef.current?.getWordRangeForPage?.(next);
      if (!ok) {
        console.log("No next page to prefetch");
        return;
      }
      prefetchPageRef.current?.(next);
    },
  });

  // Prevent voice change while playing; if paused, clear current stream so next play restarts this page with the new voice.
  const handleVoiceSelect = useCallback(
    (newVoice) => {
      if (ttsPlaying || isLoading) {
        AlertToast("يرجى الانتظار حتى اكتمال التحميل.", "INFO");
        return;
      }

      if (isStreaming) {
        cancelStream();
      }

      ttsStartedRef.current = false;

      const current = bookRef.current?.getCurrentPageNumber?.();
      if (current && current > 0) {
        currentPageRef.current = current;
      }

      setVoice(newVoice);
    },
    [ttsPlaying, isLoading, isStreaming, cancelStream, setVoice],
  );

  const sendPage = useCallback(
    async (pageNumber) => {
      try {
        const range = bookRef.current?.getWordRangeForPage?.(pageNumber);
        if (!range) {
          console.warn("No word range for page:", pageNumber);
          return;
        }

        const totalPages = bookRef.current?.totalPages ?? 0;
        const isLastPage = pageNumber >= totalPages;

        console.log(
          "Sending page:",
          pageNumber,
          "word range:",
          range.startWord,
          "-",
          range.endWord,
          "isLastPage:",
          isLastPage,
        );
        currentPageRef.current = pageNumber;

        await startPageStream(
          {
            action: "stream",
            bookId: Number(id),
            voiceId: voice,
            start: range.startWord,
            end: range.endWord,
            token: gettoken,
            isLastPage,
          },
          range.startChar,
        );
      } catch (err) {
        console.error("Error in sendPage:", err);
        AlertToast("فشل إرسال طلب تحويل النص إلى صوت.", "ERROR");
      }
    },
    [id, voice, gettoken, startPageStream],
  );

  // Prefetch next page's audio while current page is still playing
  const prefetchPage = useCallback(
    async (pageNumber) => {
      try {
        const range = bookRef.current?.getWordRangeForPage?.(pageNumber);
        if (!range) {
          console.warn("No word range for prefetch page:", pageNumber);
          return;
        }

        const totalPages = bookRef.current?.totalPages ?? 0;
        const isLastPage = pageNumber >= totalPages;

        console.log(
          "Prefetching page:",
          pageNumber,
          "word range:",
          range.startWord,
          "-",
          range.endWord,
          "isLastPage:",
          isLastPage,
        );

        await startPageStream(
          {
            action: "stream",
            bookId: Number(id),
            voiceId: voice,
            start: range.startWord,
            end: range.endWord,
            token: gettoken,
            isLastPage,
          },
          range.startChar,
          { prefetch: true }, // Prefetch mode - don't cancel current stream
        );
      } catch (err) {
        console.error("Error in prefetchPage:", err);
        // We don't necessarily need to toast for prefetch failures
      }
    },
    [id, voice, gettoken, startPageStream],
  );

  sendPageRef.current = sendPage;
  prefetchPageRef.current = prefetchPage;

  // When user presses Play:
  // - If starting from paused → just resume
  // - If starting fresh → send current page then play
  const onTogglePlay = useCallback(async () => {
    try {
      if (!ttsPlaying) {
        // Starting playback
        if (!loadingText && bookRef.current) {
          // Get current visible page (1-indexed)
          const visiblePage = bookRef.current.getCurrentPageNumber?.() ?? 1;
          // If we've already started before, resume from tracked page; otherwise use visible page
          const startPage =
            ttsStartedRef.current && currentPageRef.current > 0
              ? currentPageRef.current
              : visiblePage < 1
                ? 1
                : visiblePage;

          // If we are already streaming (audio buffered/buffering) and on the same page,
          // we just RESUME. Else, we start fresh.
          const isSamePage = startPage === currentPageRef.current;

          if (isStreaming && isSamePage) {
            console.log("Resuming existing stream for page", startPage);
            // No need to sendPage.
          } else {
            console.log("Starting TTS from page:", startPage);
            // Mark TTS as started
            ttsStartedRef.current = true;
            // Send page data to backend
            await sendPage(startPage);
          }
        }
      } else {
        // Pausing - keep highlights so user knows where they stopped
        // bookRef.current?.clearAllHighlights?.();
      }

      await togglePlay();
    } catch (err) {
      console.error("Error in onTogglePlay:", err);
      AlertToast("حدث خطأ أثناء محاولة تشغيل الصوت.", "ERROR");
    }
  }, [ttsPlaying, loadingText, sendPage, togglePlay, isStreaming]);

  // If user flips page while playing → cancel current stream and start from new page
  const onPageChange = useCallback(
    (p) => {
      const previousPage = currentPageRef.current;
      console.log("Page changed to:", p, "(was:", previousPage, ")");

      if (previousPage !== p) {
        if (ttsPlaying) {
          // This should only happen via auto-advance since manual flipping is disabled
          // while ttsPlaying is true. We don't want to double-trigger if sendPage
          // was already called by onPageEnded.
          console.log("Auto-page change detected during playback.");
          // We don't necessarily need to restart here if it's auto-advance,
          // as onPageEnded handles it.
        } else {
          // Case 2: Flipped while paused - dispose the previous stream
          // so that onTogglePlay knows to start fresh
          if (isStreaming) {
            console.log("Flipped while paused, disposing previous stream.");
            cancelStream();
          }
          // Track the newly selected page and force next play to restart from it
          currentPageRef.current = p;
          ttsStartedRef.current = false;
        }
      }
    },
    [ttsPlaying, cancelStream, isStreaming],
  );

  // Lock body scroll when reader is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Reset when book changes
  useEffect(() => {
    currentPageRef.current = 1;
    ttsStartedRef.current = false;
  }, [id]);

  return (
    <div className="w-full bg-[#fcfcfc] flex flex-col h-screen overflow-hidden fixed inset-0">
      <ReaderHeader
        onBack={() => navigate(-1)}
        onGoToPage={(p) => bookRef.current?.goToPage?.(p)}
        effect={effect}
        setEffect={setEffect}
        voice={voice}
        onSelectVoice={handleVoiceSelect}
        volume={volume}
        isMuted={isMuted}
        onCycleVolume={cycleVolume}
        readOnly={ttsPlaying || isLoading}
        isLoading={isLoading}
      />

      <main className="flex-1 flex items-center justify-center overflow-hidden pt-24 pb-28 sm:pt-20 sm:pb-32">
        <FlipBookViewer
          bookRef={bookRef}
          text={bookText}
          loading={loadingText}
          fontSize={fontSize}
          wordsPerPage={wordsPerPage}
          onPageChange={onPageChange}
          readOnly={ttsPlaying || isLoading}
        />
      </main>

      <ReaderFooter
        onNext={() => bookRef.current?.pageFlip?.()?.flipNext?.()}
        onPrev={() => bookRef.current?.pageFlip?.()?.flipPrev?.()}
        isPlaying={ttsPlaying}
        isLoading={isLoading}
        onTogglePlay={onTogglePlay}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
    </div>
  );
}
