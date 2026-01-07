import React, { useRef, useState, useEffect } from "react";
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
  const gettoken = token();

  const bookRef = useRef(null);
  const ttsStartedRef = useRef(false);

  const [effect, setEffect] = useState("none"); // 'running' | 'rain' | 'wind' | 'none'
  const [volume] = useState(0.8); // 0..1
  const [isMuted, setIsMuted] = useState(false);
  // isPlaying used to control ambient effect playback (kept in sync with TTS play)
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef({
    audioContext: null,
    buffers: {}, // decoded AudioBuffer per effect
    gainNodes: {}, // GainNode per effect
    sources: {}, // active BufferSource per effect
    urls: {
      running: rainFile,
      rain: rainFile,
      wind: windFile,
    },
  });
  const [voice, setVoice] = useState("CwhRBWXzGAHq8TQ4Fs17");

  // Decode audio files into AudioBuffers and create GainNodes (uses shared helpers)
  useEffect(() => {
    let mounted = true;
    const refsHolder = audioRefs.current;

    const init = async () => {
      try {
        const ctx = createAudioContextSafe();
        if (!ctx) {
          console.warn("Web Audio API is not supported in this browser");
          return;
        }
        refsHolder.audioContext = ctx;

        const entries = Object.entries(refsHolder.urls);
        await Promise.all(
          entries.map(async ([key, url]) => {
            try {
              const decoded = await fetchAndDecode(ctx, url);
              if (!mounted || !decoded) return;
              refsHolder.buffers[key] = decoded;

              const gain = createGainNode(ctx, isMuted ? 0 : volume);
              refsHolder.gainNodes[key] = gain;
            } catch (err) {
              console.warn("Failed to load/decode audio", key, url, err);
            }
          })
        );
      } catch (err) {
        console.warn("Audio init error:", err);
      }
    };

    init();

    return () => {
      mounted = false;
      // stop any playing sources and close context
      Object.values(refsHolder.sources || {}).forEach((s) => {
        try {
          s.stop?.();
        } catch (err) {
          console.warn("Audio stop error:", err);
        }
      });
      refsHolder.sources = {};
      if (refsHolder.audioContext) {
        try {
          refsHolder.audioContext.close();
        } catch (err) {
          console.warn("Audio context close error:", err);
        }
        refsHolder.audioContext = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // react to effect / play / mute / volume changes using WebAudio (gapless loops)
  useEffect(() => {
    const ctx = audioRefs.current.audioContext;
    if (!ctx) return;

    // helper to stop all sources
    const stopAll = () => {
      Object.entries(audioRefs.current.sources || {}).forEach(([k, src]) => {
        try {
          src.stop(0);
        } catch (err) {
          console.warn("Source stop error:", err);
        }
        delete audioRefs.current.sources[k];
      });
    };

    // update gains based on volume/mute
    Object.values(audioRefs.current.gainNodes || {}).forEach((gain) => {
      try {
        gain.gain.value = isMuted ? 0 : volume;
      } catch (err) {
        console.warn("Gain update error:", err);
      }
    });

    if (!isPlaying || isMuted || effect === "none") {
      stopAll();
      return;
    }

    // resume context on interaction if needed
    if (ctx.state === "suspended") {
      ctx.resume().catch((err) => {
        console.warn("Audio resume error:", err);
      });
    }

    // if the desired effect is already playing, nothing to do
    if (audioRefs.current.sources[effect]) {
      return;
    }

    // stop other sources
    Object.keys(audioRefs.current.sources || {}).forEach((k) => {
      try {
        audioRefs.current.sources[k]?.stop(0);
      } catch (err) {
        console.warn("Source stop error:", err);
      }
      delete audioRefs.current.sources[k];
    });

    const buffer = audioRefs.current.buffers[effect];
    const gainNode = audioRefs.current.gainNodes[effect];
    if (!buffer || !gainNode) {
      // buffer not ready yet
      return;
    }

    try {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gainNode);
      src.start(0);
      audioRefs.current.sources[effect] = src;
    } catch (err) {
      console.warn("Failed to start buffer source:", err);
    }
  }, [effect, isPlaying, isMuted, volume]);

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

  const navigate = useNavigate();
  const handleBack = () => {
    try {
      navigate(-1);
    } catch {
      if (window.history.length > 1) window.history.back();
    }
  };
  const { id } = useParams();
  // book text (fetched by id)
  const [bookText, setBookText] = useState("");
  const [loadingText, setLoadingText] = useState(true);
  const [textStartChar, setTextStartChar] = useState(0);
  const [textEndChar, setTextEndChar] = useState(0);

  // gettign book text
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingText(true);
      try {
        // try fetching book text by character range using centralized helper
        const url = `${import.meta.env.VITE_API_URL}/reader/books/${id}/text`;
        const resp = await getHelper({ url });
        if (!mounted) return;

        const payload = resp?.data ?? resp;
        if (!payload) {
          setBookText("محتوى الكتاب غير متوفر حالياً.");
          return;
        }

        if (resp?.messageStatus && resp?.messageStatus !== "SUCCESS") {
          AlertToast(
            resp?.message || "تعذر تحميل نص الكتاب.",
            resp?.messageStatus || "ERROR"
          );
          // try best-effort text extraction
          const fallbackText =
            typeof payload === "string"
              ? payload
              : payload?.text ?? payload?.data ?? "";
          setBookText(fallbackText || "محتوى الكتاب غير متوفر حالياً.");
          setTextStartChar(Number(payload?.startChar ?? 0));
          setTextEndChar(
            Number(
              payload?.endChar ?? (fallbackText ? fallbackText.length - 1 : 0)
            )
          );
          return;
        }

        // success: payload may be a raw string or an object with `.text`
        if (typeof payload === "string") {
          setBookText(payload);
          setTextStartChar(0);
          setTextEndChar(payload ? payload.length - 1 : 0);
        } else {
          const textStr = payload?.text ?? payload?.data ?? "";
          setBookText(textStr);
          setTextStartChar(Number(payload?.startChar ?? 0));
          setTextEndChar(
            Number(payload?.endChar ?? (textStr ? textStr.length - 1 : 0))
          );
        }
      } catch (err) {
        console.warn("Failed to load book content:", err);
        AlertToast("تعذر تحميل نص الكتاب.", "ERROR");
        setBookText("محتوى الكتاب غير متوفر حالياً.");
      } finally {
        setLoadingText(false);
        // no loading state to update here
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // ---- WebSocket TTS integration (enabled only when effect !== 'none') ----
  const ttsEnabled = voice !== "none";

  const {
    isPlaying: ttsPlaying,
    togglePlay: toggleTTSPlay,
    sendStartPayload,
  } = useReaderTTS({
    enabled: ttsEnabled,
    bookRef,
  });

  // keep ambient player in sync with TTS play state
  useEffect(() => {
    setIsPlaying(Boolean(ttsPlaying));
  }, [ttsPlaying]);

  // when TTS starts, send a start payload (book id + effect) if ws is available
  useEffect(() => {
    if (!ttsPlaying || voice === "none")
      return console.log("cant run voice is none");

    if (ttsPlaying && !ttsStartedRef.current) {
      ttsStartedRef.current = true;

      try {
        sendStartPayload({
          action: "stream",
          bookId: Number(id),
          voiceId: voice,
          start: textStartChar,
          end: 1500,
          token: gettoken,
        });
      } catch (err) {
        console.warn("sendStartPayload error:", err);
      }
    }

    if (!ttsPlaying) {
      // pause only — do NOT reset ttsStartedRef here
    }
  }, [
    ttsPlaying,
    id,
    sendStartPayload,
    textStartChar,
    textEndChar,
    gettoken,
    voice,
  ]);
  useEffect(() => {
    ttsStartedRef.current = false;
  }, [effect, id]);

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
      <ReaderHeader
        onBack={handleBack}
        onGoToPage={handleGoToPage}
        effect={effect}
        setEffect={setEffect}
        voice={voice}
        setVoice={setVoice}
        volume={volume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((s) => !s)}
      />

      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <FlipBookViewer
            bookRef={bookRef}
            text={bookText}
            loading={loadingText}
          />
        </div>
      </main>

      <ReaderFooter
        onNext={handleNext}
        onPrev={handlePrev}
        isPlaying={ttsPlaying}
        onTogglePlay={toggleTTSPlay}
      />
    </div>
  );
}
