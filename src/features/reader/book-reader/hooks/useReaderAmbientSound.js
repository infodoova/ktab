import { useRef, useEffect } from "react";
import { useReaderPreferencesStore } from "@/core/store";
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
 * Manages Web Audio Context, volume gain nodes, and ambient background sounds (rain, wind, nature).
 *
 * @returns {Object} Ambient playback controls and current audio preferences
 */
export function useReaderAmbientSound() {
  const {
    ambientEffect: effect,
    setAmbientEffect: setEffect,
    volume,
    isMuted,
    cycleVolume,
  } = useReaderPreferencesStore();

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const currentSourceRef = useRef(null);
  const audioBuffersRef = useRef({});
  const loadingAudioRef = useRef({});

  // Initialize Web Audio Context and Master Gain Node
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

  return {
    effect,
    setEffect,
    isMuted,
    volume,
    cycleVolume,
  };
}

export default useReaderAmbientSound;
