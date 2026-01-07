import { useEffect, useRef, useState, useCallback } from "react";
import { getWsUrl, createAudioContextSafe, safeJsonParse } from "./utils";

export function useReaderTTS({ enabled, bookRef }) {
  const audioCtxRef = useRef(null);
  const wsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioBufferQueueRef = useRef(new Map());
  const nextSeqRef = useRef(1);
  const scheduledTimeRef = useRef(0);
  const alignmentBySeqRef = useRef(new Map());
  const rafRef = useRef(null);

  // Track the actual connection promise to prevent double-init
  const connectionPromiseRef = useRef(null);

  /* =========================
      CLEANUP & HIGHLIGHT UTILS
  ========================= */
  const stopHighlighting = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const cleanupHighlights = useCallback(() => {
    document
      .querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));
  }, []);

  const highlightRange = useCallback(
    (start, end) => {
      try {
        cleanupHighlights();
        for (let i = start; i <= end; i++) {
          const el = document.querySelector(`[data-char="${i}"]`);
          if (el) el.classList.add("active");
        }
        if (bookRef?.current?.getPageForChar) {
          const page = bookRef.current.getPageForChar(end);
          bookRef.current.goToPage?.(page);
        }
      } catch (e) {
        console.error("Highlight error", e);
      }
    },
    [bookRef, cleanupHighlights]
  );

  const scheduleHighlight = useCallback(
    (words, startTime, duration) => {
      if (!words.length) return;
      const startMs = startTime * 1000;

      const loop = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime * 1000;
        if (now > startMs + duration * 1000) return;

        for (const w of words) {
          if (now >= startMs + w.startMs && now <= startMs + w.endMs) {
            highlightRange(w.startChar, w.endChar);
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };

      stopHighlighting();
      rafRef.current = requestAnimationFrame(loop);
    },
    [highlightRange, stopHighlighting]
  );

  /* =========================
      AUDIO LOGIC
  ========================= */
  const tryPlayNext = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "closed") return;

    while (audioBufferQueueRef.current.has(nextSeqRef.current)) {
      const seq = nextSeqRef.current;
      const buffer = audioBufferQueueRef.current.get(seq);
      audioBufferQueueRef.current.delete(seq);

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);

      const startAt = Math.max(ctx.currentTime, scheduledTimeRef.current);
      src.start(startAt);

      const words = alignmentBySeqRef.current.get(seq) || [];
      scheduleHighlight(words, startAt, buffer.duration);

      scheduledTimeRef.current = startAt + buffer.duration;
      nextSeqRef.current++;
    }
  }, [scheduleHighlight]);

  const cleanup = useCallback(() => {
    stopHighlighting();
    cleanupHighlights();

    if (wsRef.current) {
      // Prevent zombie listeners from firing after cleanup
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;

      wsRef.current.close();
      wsRef.current = null;
    }

    // Reset connection promise so we can reconnect later
    connectionPromiseRef.current = null;

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    audioBufferQueueRef.current.clear();
    alignmentBySeqRef.current.clear();
    nextSeqRef.current = 1;
    scheduledTimeRef.current = 0;
    setIsPlaying(false);
  }, [stopHighlighting, cleanupHighlights]);

  // Init now returns a Promise that resolves when WebSocket is OPEN
  const init = useCallback(async () => {
    // If we already have a promise (connecting) or an open socket, return that
    if (connectionPromiseRef.current) return connectionPromiseRef.current;

    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContextSafe();
    }
    scheduledTimeRef.current = audioCtxRef.current.currentTime;

    connectionPromiseRef.current = new Promise((resolve, reject) => {
      const ws = new WebSocket(getWsUrl());
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        resolve(ws);
      };

      ws.onerror = (err) => {
        console.error("WS Error", err);
        // If it fails during init, clear the promise so we can try again
        connectionPromiseRef.current = null;
        reject(err);
      };

      ws.onmessage = async (e) => {
        if (typeof e.data === "string") {
          const msg = safeJsonParse(e.data);
          if (msg?.type === "alignment") {
            alignmentBySeqRef.current.set(msg.seq, msg.words || []);
          }
          return;
        }

        const buf = e.data;
        const view = new DataView(buf);
        const seq = Number(view.getBigInt64(0, false));
        const audioBytes = buf.slice(8);

        try {
          const audioBuffer = await audioCtxRef.current.decodeAudioData(
            audioBytes
          );
          audioBufferQueueRef.current.set(seq, audioBuffer);
          tryPlayNext();
        } catch (err) {
          console.warn("[TTS] decode failed", err);
        }
      };

      ws.onclose = () => {
        connectionPromiseRef.current = null;
      };
    });

    return connectionPromiseRef.current;
  }, [tryPlayNext]);

  /* =========================
      EFFECTS
  ========================= */
  useEffect(() => {
    if (!enabled) return;

    // We catch errors here to prevent unhandled promise rejections in the effect
    init().catch((e) => console.error("Auto-init failed", e));

    return () => {
      cleanup();
    };
  }, [enabled, init, cleanup]);

  return {
    togglePlay: async () => {
      if (!audioCtxRef.current) await init();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        await ctx.resume();
        setIsPlaying(true);
      } else {
        await ctx.suspend();
        setIsPlaying(false);
      }
    },

    sendStartPayload: async (payload) => {
      // 1. Ensure Audio Context is ready
      if (!audioCtxRef.current) {
        audioCtxRef.current = createAudioContextSafe();
        scheduledTimeRef.current = audioCtxRef.current.currentTime;
      }

      // 2. Ensure WebSocket is ready (Wait for OPEN)
      try {
        await init();
      } catch (e) {
        console.error("Cannot send payload, connection failed", e);
        return;
      }

      // 3. Reset state for new playback
      nextSeqRef.current = 1;
      audioBufferQueueRef.current.clear();
      alignmentBySeqRef.current.clear();
      scheduledTimeRef.current = audioCtxRef.current?.currentTime || 0;

      // 4. Send safely
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      } else {
        console.warn("WebSocket not open, cannot send start payload");
      }
    },

    stop() {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "stop" }));
      }
      cleanupHighlights();
      stopHighlighting();
    },
    isPlaying,
  };
}
