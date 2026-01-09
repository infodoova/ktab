import { useCallback, useEffect, useRef, useState } from "react";
import { getWsUrl, createAudioContextSafe, safeJsonParse } from "./utils";

export function useReaderTTS({ enabled, onPageEnded }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const audioCtxRef = useRef(null);
  const wsRef = useRef(null);
  const connectPromiseRef = useRef(null);

  const streamIdRef = useRef(0);

  // Buffer ALL audio chunks and alignments
  const allAudioChunksRef = useRef([]);
  const allAlignmentsRef = useRef([]);
  const totalChunksExpectedRef = useRef(0);
  const chunksReceivedRef = useRef(0);

  const playbackStartTimeRef = useRef(null);
  const scheduledSourceRef = useRef(null);
  const expectedDurationRef = useRef(0);

  const gotCompleteRef = useRef(false);
  const pageEndedFiredRef = useRef(false);
  const streamCancelledRef = useRef(false);

  const rafRef = useRef(null);
  const allWordsRef = useRef([]);
  const lastHighlightedRef = useRef(null);
  const totalDurationRef = useRef(0);

  const ensureCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioContextSafe();
    if (!audioCtxRef.current) throw new Error("Web Audio API not available");
    return audioCtxRef.current;
  }, []);

  const clearHighlight = useCallback(() => {
    document.querySelectorAll(".tts-active-word").forEach((el) => {
      el.classList.remove("tts-active-word");
    });
    lastHighlightedRef.current = null;
  }, []);

  const highlightWord = useCallback((startChar, endChar) => {
    const key = `${startChar}-${endChar}`;
    if (lastHighlightedRef.current === key) return;

    document.querySelectorAll(".tts-active-word").forEach((el) => {
      el.classList.remove("tts-active-word");
    });

    const el = document.querySelector(
      `[data-word-start="${startChar}"][data-word-end="${endChar}"]`
    );

    if (el) {
      el.classList.add("tts-active-word");
      lastHighlightedRef.current = key;
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;

    const tick = () => {
      const ctx = audioCtxRef.current;
      const startTime = playbackStartTimeRef.current;

      if (!ctx || startTime == null) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // t is actual elapsed time since playback started
      const elapsed = ctx.currentTime - startTime;

      // Find current word (word timings are in original expected scale)
      let currentWord = null;
      for (const w of allWordsRef.current) {
        if (elapsed >= w.startSec && elapsed <= w.endSec + 0.15) {
          currentWord = w;
          break;
        }
      }

      if (currentWord) {
        highlightWord(currentWord.startChar, currentWord.endChar);
      } else if (
        lastHighlightedRef.current &&
        elapsed > totalDurationRef.current + 0.5
      ) {
        clearHighlight();
      }

      // Check if page ended
      if (
        gotCompleteRef.current &&
        !pageEndedFiredRef.current &&
        !streamCancelledRef.current &&
        elapsed >= totalDurationRef.current - 0.2
      ) {
        pageEndedFiredRef.current = true;
        setIsStreaming(false);
        clearHighlight();
        console.log("Page ended after", elapsed.toFixed(2), "seconds");
        onPageEnded?.();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [clearHighlight, highlightWord, onPageEnded]);

  const tryPlayAll = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (!gotCompleteRef.current) return;
    if (allAudioChunksRef.current.length === 0) return;

    console.log(
      `Complete! Got ${allAudioChunksRef.current.length} audio chunks, ${allAlignmentsRef.current.length} alignments`
    );

    // Concatenate all audio chunks
    const totalLength = allAudioChunksRef.current.reduce(
      (sum, c) => sum + c.byteLength,
      0
    );
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of allAudioChunksRef.current) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    try {
      const decoded = await ctx.decodeAudioData(combined.buffer);
      const actualDuration = decoded.duration;

      if (streamCancelledRef.current) return;

      // Sort alignments and calculate expected total duration
      allAlignmentsRef.current.sort((a, b) => a.seq - b.seq);

      let cumulativeOffset = 0;
      const allWords = [];

      for (const alignment of allAlignmentsRef.current) {
        const lastWord = alignment.words[alignment.words.length - 1];
        const chunkDuration = lastWord ? lastWord.endSec : 0;

        for (const w of alignment.words) {
          allWords.push({
            word: w.word,
            startSec: cumulativeOffset + w.startSec,
            endSec: cumulativeOffset + w.endSec,
            startChar: w.startChar,
            endChar: w.endChar,
          });
        }

        cumulativeOffset += chunkDuration;
      }

      const expectedDuration = cumulativeOffset;
      expectedDurationRef.current = expectedDuration;

      console.log(
        `Decoded: ${actualDuration.toFixed(
          2
        )}s, Expected: ${expectedDuration.toFixed(2)}s`
      );

      // Calculate playback rate to stretch audio to match expected duration
      // playbackRate < 1 = slower, > 1 = faster
      let playbackRate = actualDuration / expectedDuration;

      console.log(
        `Raw Playback rate: ${playbackRate.toFixed(4)} (slowing down ${(
          1 / playbackRate
        ).toFixed(1)}x)`
      );

      // SAFETY CLAMP: Prevent extreme playback rates (demon voice / chipmunk)
      // If the backend sends mismatched audio/text duration, we prefer normal speed + silence
      // over completely broken audio.
      const MIN_RATE = 0.5;
      const MAX_RATE = 2.0;
      
      if (playbackRate < MIN_RATE || playbackRate > MAX_RATE) {
        console.warn(`Playback rate ${playbackRate.toFixed(3)} is extreme. Clamping to [${MIN_RATE}, ${MAX_RATE}].`);
        playbackRate = Math.max(MIN_RATE, Math.min(MAX_RATE, playbackRate));
      }

      // Word timings are already in correct scale (expected duration)
      // No need to scale them since we're adjusting playback rate
      allWordsRef.current = allWords;
      totalDurationRef.current = expectedDuration;

      // Schedule playback with adjusted rate
      const startAt = ctx.currentTime + 0.05;
      playbackStartTimeRef.current = startAt;

      const src = ctx.createBufferSource();
      src.buffer = decoded;
      src.playbackRate.value = playbackRate; // Slow down the audio
      src.connect(ctx.destination);
      src.start(startAt);

      scheduledSourceRef.current = src;

      console.log(
        `Playing ${allWords.length} words over ${expectedDuration.toFixed(
          2
        )}s (rate: ${playbackRate.toFixed(3)})`
      );
    } catch (err) {
      console.error("Audio decode failed:", err);
    }
  }, []);

  const cancelStream = useCallback(() => {
    console.log("Cancelling stream");

    streamIdRef.current += 1;
    streamCancelledRef.current = true;

    if (scheduledSourceRef.current) {
      try {
        scheduledSourceRef.current.stop();
      } catch {
        //
      }
      scheduledSourceRef.current = null;
    }

    allAudioChunksRef.current = [];
    allAlignmentsRef.current = [];
    allWordsRef.current = [];
    totalChunksExpectedRef.current = 0;
    chunksReceivedRef.current = 0;

    playbackStartTimeRef.current = null;
    totalDurationRef.current = 0;
    expectedDurationRef.current = 0;

    gotCompleteRef.current = false;
    pageEndedFiredRef.current = false;

    setIsStreaming(false);
    clearHighlight();
  }, [clearHighlight]);

  const connect = useCallback(async () => {
    if (connectPromiseRef.current) return connectPromiseRef.current;

    ensureCtx();

    connectPromiseRef.current = new Promise((resolve, reject) => {
      const ws = new WebSocket(getWsUrl());
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        resolve(ws);
      };
      ws.onerror = () => reject(new Error("WebSocket connection error"));
      ws.onclose = () => {
        wsRef.current = null;
        connectPromiseRef.current = null;
      };

      ws.onmessage = async (e) => {
        const streamId = streamIdRef.current;

        if (typeof e.data === "string") {
          const msg = safeJsonParse(e.data);

          if (msg?.type === "alignment") {
            if (streamId !== streamIdRef.current) return;

            const seq = Number(msg.seq);
            allAlignmentsRef.current.push({
              seq,
              words:
                msg.words?.map((w) => ({
                  word: w.word,
                  startSec: w.startSeconds,
                  endSec: w.endSeconds,
                  startChar: w.startChar,
                  endChar: w.endChar,
                })) || [],
            });
            return;
          }

          if (msg?.type === "complete") {
            if (streamId !== streamIdRef.current) return;
            console.log("Stream complete");
            gotCompleteRef.current = true;
            tryPlayAll();
            return;
          }

          if (msg?.type === "ack") {
            totalChunksExpectedRef.current = msg.totalChunks;
            console.log(`Expecting ${msg.totalChunks} chunks`);
          }
          return;
        }

        // Binary audio
        if (streamId !== streamIdRef.current) return;

        const audioData = e.data.slice(8);
        allAudioChunksRef.current.push(audioData);
        chunksReceivedRef.current += 1;
      };
    });

    return connectPromiseRef.current;
  }, [ensureCtx, tryPlayAll]);

  useEffect(() => {
    if (!enabled) return;
    connect().catch(console.error);
    return () => {
      stopLoop();
      clearHighlight();
    };
  }, [enabled, connect, stopLoop, clearHighlight]);

  const togglePlay = useCallback(async () => {
    await connect();
    const ctx = ensureCtx();

    if (!isPlaying) {
      await ctx.resume();
      startLoop();
      setIsPlaying(true);
    } else {
      await ctx.suspend();
      stopLoop();
      setIsPlaying(false);
    }
  }, [connect, ensureCtx, isPlaying, startLoop, stopLoop]);

  const startPageStream = useCallback(
    async (payload) => {
      await connect();
      ensureCtx();

      cancelStream();

      streamIdRef.current += 1;
      streamCancelledRef.current = false;

      allAudioChunksRef.current = [];
      allAlignmentsRef.current = [];
      allWordsRef.current = [];
      totalChunksExpectedRef.current = 0;
      chunksReceivedRef.current = 0;
      playbackStartTimeRef.current = null;
      totalDurationRef.current = 0;
      expectedDurationRef.current = 0;

      gotCompleteRef.current = false;
      pageEndedFiredRef.current = false;

      setIsStreaming(true);
      clearHighlight();

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        setIsStreaming(false);
        throw new Error("WebSocket not ready");
      }

      console.log("Sending:", payload);
      ws.send(JSON.stringify(payload));
    },
    [connect, ensureCtx, clearHighlight, cancelStream]
  );

  return {
    isPlaying,
    isStreaming,
    togglePlay,
    startPageStream,
    cancelStream,
  };
}
