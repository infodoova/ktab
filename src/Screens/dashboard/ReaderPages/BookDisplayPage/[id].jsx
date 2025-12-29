import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import rainFile from "../../../../assets/audio/rain.mp3";
import windFile from "../../../../assets/audio/wind.mp3";
import ReaderHeader from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/HeaderBarComponent";
import ReaderFooter from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FooterBarComponent";
import FlipBookViewer from "../../../../components/myui/Users/ReaderPages/BookDisplayComponent/FlipBookViewerComponent";

export default function BookDisplay() {
  const bookRef = useRef(null);
  const [effect, setEffect] = useState("none"); // 'running' | 'rain' | 'wind' | 'none'
  const [volume] = useState(0.8); // 0..1
  const [isMuted, setIsMuted] = useState(false);
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

  // Decode audio files into AudioBuffers and create GainNodes
  useEffect(() => {
    let mounted = true;
    const refsHolder = audioRefs.current;

    const init = async () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          console.warn("Web Audio API is not supported in this browser");
          return;
        }

        const ctx = new AudioContext();
        refsHolder.audioContext = ctx;

        const entries = Object.entries(refsHolder.urls);
        await Promise.all(
          entries.map(async ([key, url]) => {
            try {
              const resp = await fetch(url);
              const arrayBuffer = await resp.arrayBuffer();
              const decoded = await ctx.decodeAudioData(arrayBuffer);
              if (!mounted) return;
              refsHolder.buffers[key] = decoded;

              const gain = ctx.createGain();
              gain.gain.value = isMuted ? 0 : volume;
              gain.connect(ctx.destination);
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
        volume={volume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((s) => !s)}
      />

      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <FlipBookViewer bookRef={bookRef} />
        </div>
      </main>

      <ReaderFooter
        onNext={handleNext}
        onPrev={handlePrev}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((s) => !s)}
      />
    </div>
  );
}
