import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import rainFile from "../../../../assets/audio/rain.mp3";
import windFile from "../../../../assets/audio/wind.mp3";

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
  const [wordsPerPage] = useState(50);

  const [voice, setVoice] = useState("CwhRBWXzGAHq8TQ4Fs17");
  const [effect, setEffect] = useState("none");
  const [isMuted, setIsMuted] = useState(false);
  const [volume] = useState(0.8);

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
          typeof resp?.data === "string" ? resp.data : resp?.data?.text ?? "";

        setBookText(text || "محتوى الكتاب غير متوفر حالياً.");
      } catch {
        AlertToast("تعذر تحميل نص الكتاب.", "ERROR");
        setBookText("محتوى الكتاب غير متوفر حالياً.");
      } finally {
        setLoadingText(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [id]);

  // Ambient init
  useEffect(() => {
    let mounted = true;
    const refs = audioRefs.current;

    const init = async () => {
      const ctx = createAudioContextSafe();
      if (!ctx) return;
      refs.audioContext = ctx;

      await Promise.all(
        Object.entries(refs.urls).map(async ([k, url]) => {
          const buf = await fetchAndDecode(ctx, url);
          if (!mounted || !buf) return;
          refs.buffers[k] = buf;
          refs.gainNodes[k] = createGainNode(ctx, isMuted ? 0 : volume);
        })
      );
    };

    init();

    return () => {
      mounted = false;
      Object.values(refs.sources).forEach((s) => s.stop?.());
      refs.sources = {};
      refs.audioContext?.close?.();
      refs.audioContext = null;
    };
  }, [isMuted, volume]);

  useEffect(() => {
    const ctx = audioRefs.current.audioContext;
    if (!ctx) return;

    Object.values(audioRefs.current.gainNodes).forEach(
      (g) => (g.gain.value = isMuted ? 0 : volume)
    );

    if (isMuted || effect === "none") {
      Object.values(audioRefs.current.sources).forEach((s) => s.stop?.());
      audioRefs.current.sources = {};
      return;
    }

    if (ctx.state === "suspended") ctx.resume();

    if (audioRefs.current.sources[effect]) return;

    Object.values(audioRefs.current.sources).forEach((s) => s.stop?.());
    audioRefs.current.sources = {};

    const buffer = audioRefs.current.buffers[effect];
    const gain = audioRefs.current.gainNodes[effect];
    if (!buffer || !gain) return;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(gain);
    src.start();

    audioRefs.current.sources[effect] = src;
  }, [effect, isMuted, volume]);

  /* ===============================
     TTS (improved algo)
  ================================ */
  const sendPageRef = useRef(null);

  const {
    isPlaying: ttsPlaying,
    isStreaming,
    togglePlay,
    startPageStream,
    cancelStream,
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
      sendPageRef.current?.(next).catch(console.error);
    },
  });

  const sendPage = useCallback(
    async (pageNumber) => {
      const range = bookRef.current?.getWordRangeForPage?.(pageNumber);
      if (!range) {
        console.warn("No word range for page:", pageNumber);
        return;
      }

      console.log(
        "Sending page:",
        pageNumber,
        "word range:",
        range.startWord,
        "-",
        range.endWord
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
        },
        range.startChar
      );
    },
    [id, voice, gettoken, startPageStream]
  );

  sendPageRef.current = sendPage;

  // When user presses Play:
  // - If starting from paused → just resume
  // - If starting fresh → send current page then play
  const onTogglePlay = useCallback(async () => {
    if (!ttsPlaying) {
      // Starting playback
      if (!loadingText && bookRef.current) {
        // Get current visible page (1-indexed)
        const current = bookRef.current.getCurrentPageNumber?.() ?? 1;
        // Use page 1 if getCurrentPageNumber returns 0 or invalid
        const startPage = current < 1 ? 1 : current;

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
        }
      }
    },
    [ttsPlaying, cancelStream, isStreaming]
  );

  // Reset when book or voice changes
  useEffect(() => {
    currentPageRef.current = 1;
    ttsStartedRef.current = false;
  }, [id, voice]);

  return (
    <div className="w-full bg-[#f2e8d5] flex flex-col h-screen">
      <ReaderHeader
        onBack={() => navigate(-1)}
        onGoToPage={(p) => bookRef.current?.goToPage?.(p)}
        effect={effect}
        setEffect={setEffect}
        voice={voice}
        setVoice={setVoice}
        volume={volume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((s) => !s)}
        readOnly={ttsPlaying}
      />

      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <FlipBookViewer
          bookRef={bookRef}
          text={bookText}
          loading={loadingText}
          wordsPerPage={wordsPerPage}
          onPageChange={onPageChange}
          readOnly={ttsPlaying}
        />
      </main>

      <ReaderFooter
        onNext={() => bookRef.current?.pageFlip?.()?.flipNext?.()}
        onPrev={() => bookRef.current?.pageFlip?.()?.flipPrev?.()}
        isPlaying={ttsPlaying}
        onTogglePlay={onTogglePlay}
      />
    </div>
  );
}
