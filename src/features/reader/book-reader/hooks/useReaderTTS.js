import { useCallback, useEffect, useRef, useState } from "react";
import {
  getWsUrl,
  createAudioContextSafe,
  safeJsonParse,
  decodeAudioDataSafe,
  unlockIOSAudio,
  isIOSDevice,
} from "../utils/readerUtils";

const PREFETCH_RATIO = 0.4;

/**
 * Hook for managing Reader real-time streaming TTS and word highlighting synchronization.
 */
export function useReaderTTS({ enabled, onPageEnded, onPrefetchNextPage }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioCtxRef = useRef(null);
  const wsRef = useRef(null);
  const connectPromiseRef = useRef(null);

  const streamIdRef = useRef(0);
  const prefetchStreamIdRef = useRef(0);
  const prefetchPayloadRef = useRef(null);
  const isLastPageRef = useRef(false);
  const prefetchIsLastPageRef = useRef(false);

  // Buffer ALL audio chunks and alignments (CURRENT page)
  const allAudioChunksRef = useRef([]);
  const allAlignmentsRef = useRef([]);
  const totalChunksExpectedRef = useRef(0);
  const chunksReceivedRef = useRef(0);

  // Buffer for PREFETCHED next page
  const prefetchAudioChunksRef = useRef([]);
  const prefetchAlignmentsRef = useRef([]);
  const prefetchCharOffsetRef = useRef(0);
  const prefetchGotCompleteRef = useRef(false);
  const prefetchDecodedBufferRef = useRef(null);
  const prefetchWordsRef = useRef([]);
  const prefetchDurationRef = useRef(0);
  const prefetchPlaybackRateRef = useRef(1);

  const playbackStartTimeRef = useRef(null);
  const scheduledSourceRef = useRef(null);
  const expectedDurationRef = useRef(0);

  const gotCompleteRef = useRef(false);
  const pageEndedFiredRef = useRef(false);
  const streamCancelledRef = useRef(false);
  const prefetchTriggeredRef = useRef(false);

  const rafRef = useRef(null);
  const allWordsRef = useRef([]);
  const wordCursorRef = useRef(0);
  const lastHighlightedRef = useRef(null);
  const totalDurationRef = useRef(0);
  const charOffsetRef = useRef(0);

  const isPrefetchingRef = useRef(false);

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

    const selector = `[data-word-start="${startChar}"][data-word-end="${endChar}"]`;
    let el = document.querySelector(selector);

    if (!el) {
      const allWords = document.querySelectorAll("[data-word-start]");
      let bestMatch = null;
      let minDiff = 10;

      for (const wordEl of allWords) {
        const wordStart = parseInt(wordEl.getAttribute("data-word-start"));
        const wordEnd = parseInt(wordEl.getAttribute("data-word-end"));

        if (wordStart <= startChar && wordEnd >= endChar) {
          el = wordEl;
          break;
        }

        const startDiff = Math.abs(wordStart - startChar);
        const endDiff = Math.abs(wordEnd - endChar);
        if (startDiff + endDiff < minDiff) {
          minDiff = startDiff + endDiff;
          bestMatch = wordEl;
        }
      }
      if (!el && bestMatch) el = bestMatch;
    }

    if (el) {
      el.classList.add("tts-active-word");
      lastHighlightedRef.current = key;
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
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

      const elapsed = ctx.currentTime - startTime;

      let currentWord = null;
      for (let i = wordCursorRef.current; i < allWordsRef.current.length; i++) {
        const w = allWordsRef.current[i];
        if (elapsed >= w.startSec && elapsed <= w.endSec + 0.15) {
          wordCursorRef.current = i;
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

      // Prefetch next page at threshold
      if (
        gotCompleteRef.current &&
        !prefetchTriggeredRef.current &&
        !streamCancelledRef.current &&
        !isLastPageRef.current &&
        totalDurationRef.current > 0 &&
        elapsed >= totalDurationRef.current * PREFETCH_RATIO
      ) {
        prefetchTriggeredRef.current = true;
        onPrefetchNextPage?.();
      }

      // Check if current page ended
      if (
        gotCompleteRef.current &&
        !pageEndedFiredRef.current &&
        !streamCancelledRef.current &&
        elapsed >= totalDurationRef.current - 0.2
      ) {
        pageEndedFiredRef.current = true;
        setIsStreaming(false);
        clearHighlight();

        if (isLastPageRef.current) {
          setIsPlaying(false);
          if (audioCtxRef.current) audioCtxRef.current.suspend();
          stopLoop();
          return;
        } else {
          onPageEnded?.();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [clearHighlight, highlightWord, onPageEnded, onPrefetchNextPage, stopLoop]);

  const tryPlayAll = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) {
      setIsLoading(false);
      return;
    }

    if (!gotCompleteRef.current) return;

    if (allAudioChunksRef.current.length === 0) {
      setIsLoading(false);
      return;
    }

    const totalLength = allAudioChunksRef.current.reduce((sum, c) => sum + c.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of allAudioChunksRef.current) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    try {
      if (isIOSDevice() && ctx.state !== "running") {
        await ctx.resume().catch((e) => console.warn("TTS: Resume failed", e));
      }

      const decoded = await decodeAudioDataSafe(ctx, combined.buffer.slice(0));
      const actualDuration = decoded.duration;

      if (streamCancelledRef.current) return;

      allAlignmentsRef.current.sort((a, b) => a.seq - b.seq);

      let timeOffset = 0;
      if (allAlignmentsRef.current.length > 0) {
        const firstAlign = allAlignmentsRef.current[0];
        if (firstAlign.words && firstAlign.words.length > 0) {
          if (firstAlign.words[0].startSec > 1.5) {
            timeOffset = firstAlign.words[0].startSec;
          }
        }
      }

      let backendUsesAbsoluteChars = false;
      if (allAlignmentsRef.current.length > 0) {
        const firstAlign = allAlignmentsRef.current[0];
        if (firstAlign.words && firstAlign.words.length > 0) {
          const firstWordStartChar = firstAlign.words[0].startChar;
          if (charOffsetRef.current > 0 && Math.abs(firstWordStartChar - charOffsetRef.current) < 50) {
            backendUsesAbsoluteChars = true;
          }
        }
      }

      let cumulativeOffset = 0;
      const allWords = [];

      for (const alignment of allAlignmentsRef.current) {
        if (!alignment.words || alignment.words.length === 0) continue;

        const baseTime = timeOffset > 0 ? 0 : cumulativeOffset;

        for (const w of alignment.words) {
          const finalStartChar = backendUsesAbsoluteChars
            ? w.startChar
            : charOffsetRef.current + w.startChar;
          const finalEndChar = backendUsesAbsoluteChars
            ? w.endChar
            : charOffsetRef.current + w.endChar;

          allWords.push({
            word: w.word,
            startSec: baseTime + (w.startSec - timeOffset),
            endSec: baseTime + (w.endSec - timeOffset),
            startChar: finalStartChar,
            endChar: finalEndChar,
          });
        }

        if (timeOffset > 0) {
          const lastWord = alignment.words[alignment.words.length - 1];
          cumulativeOffset = lastWord.endSec - timeOffset;
        } else {
          const lastWord = alignment.words[alignment.words.length - 1];
          const chunkDuration = lastWord ? lastWord.endSec : 0;
          cumulativeOffset += chunkDuration;
        }
      }

      const expectedDuration = cumulativeOffset || decoded.duration;
      expectedDurationRef.current = expectedDuration;

      let playbackRate = expectedDuration > 0 ? actualDuration / expectedDuration : 1;

      const MIN_RATE = 0.5;
      const MAX_RATE = 2.0;
      if (playbackRate < MIN_RATE || playbackRate > MAX_RATE) {
        playbackRate = Math.max(MIN_RATE, Math.min(MAX_RATE, playbackRate));
      }

      allWordsRef.current = allWords;
      totalDurationRef.current = expectedDuration;

      const startAt = ctx.currentTime + 0.05;
      playbackStartTimeRef.current = startAt;

      const src = ctx.createBufferSource();
      src.buffer = decoded;
      src.playbackRate.value = playbackRate;
      src.connect(ctx.destination);
      src.start(startAt);

      scheduledSourceRef.current = src;
      setIsLoading(false);
    } catch (err) {
      console.error("Audio decode failed:", err);
      setIsLoading(false);
    }
  }, []);

  const cancelStream = useCallback(() => {
    streamIdRef.current += 1;
    streamCancelledRef.current = true;

    if (scheduledSourceRef.current) {
      try {
        scheduledSourceRef.current.stop();
      } catch {
        // Ignored
      }
      scheduledSourceRef.current = null;
    }

    allAudioChunksRef.current = [];
    allAlignmentsRef.current = [];
    allWordsRef.current = [];
    wordCursorRef.current = 0;
    totalChunksExpectedRef.current = 0;
    chunksReceivedRef.current = 0;

    playbackStartTimeRef.current = null;
    totalDurationRef.current = 0;
    expectedDurationRef.current = 0;
    charOffsetRef.current = 0;

    gotCompleteRef.current = false;
    pageEndedFiredRef.current = false;

    isPrefetchingRef.current = false;
    prefetchPayloadRef.current = null;
    isLastPageRef.current = false;
    prefetchIsLastPageRef.current = false;

    setIsStreaming(false);
    setIsLoading(false);
    clearHighlight();
  }, [clearHighlight]);

  const decodePrefetchedAudio = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx || prefetchAudioChunksRef.current.length === 0) return;

    const totalLength = prefetchAudioChunksRef.current.reduce((sum, c) => sum + c.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of prefetchAudioChunksRef.current) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    try {
      const decoded = await decodeAudioDataSafe(ctx, combined.buffer.slice(0));
      const actualDuration = decoded.duration;

      prefetchAlignmentsRef.current.sort((a, b) => a.seq - b.seq);

      let timeOffset = 0;
      if (prefetchAlignmentsRef.current.length > 0) {
        const firstAlign = prefetchAlignmentsRef.current[0];
        if (firstAlign.words && firstAlign.words.length > 0) {
          if (firstAlign.words[0].startSec > 1.5) {
            timeOffset = firstAlign.words[0].startSec;
          }
        }
      }

      let backendUsesAbsoluteChars = false;
      if (prefetchAlignmentsRef.current.length > 0) {
        const firstAlign = prefetchAlignmentsRef.current[0];
        if (firstAlign.words && firstAlign.words.length > 0) {
          const firstWordStartChar = firstAlign.words[0].startChar;
          if (prefetchCharOffsetRef.current > 0 && Math.abs(firstWordStartChar - prefetchCharOffsetRef.current) < 50) {
            backendUsesAbsoluteChars = true;
          }
        }
      }

      let cumulativeOffset = 0;
      const allWords = [];

      for (const alignment of prefetchAlignmentsRef.current) {
        if (!alignment.words || alignment.words.length === 0) continue;

        const baseTime = timeOffset > 0 ? 0 : cumulativeOffset;

        for (const w of alignment.words) {
          const finalStartChar = backendUsesAbsoluteChars
            ? w.startChar
            : prefetchCharOffsetRef.current + w.startChar;
          const finalEndChar = backendUsesAbsoluteChars
            ? w.endChar
            : prefetchCharOffsetRef.current + w.endChar;

          allWords.push({
            word: w.word,
            startSec: baseTime + (w.startSec - timeOffset),
            endSec: baseTime + (w.endSec - timeOffset),
            startChar: finalStartChar,
            endChar: finalEndChar,
          });
        }

        if (timeOffset > 0) {
          const lastWord = alignment.words[alignment.words.length - 1];
          cumulativeOffset = lastWord.endSec - timeOffset;
        } else {
          const lastWord = alignment.words[alignment.words.length - 1];
          const chunkDuration = lastWord ? lastWord.endSec : 0;
          cumulativeOffset += chunkDuration;
        }
      }

      const expectedDuration = cumulativeOffset || decoded.duration;
      let playbackRate = expectedDuration > 0 ? actualDuration / expectedDuration : 1;

      const MIN_RATE = 0.5;
      const MAX_RATE = 2.0;
      if (playbackRate < MIN_RATE || playbackRate > MAX_RATE) {
        playbackRate = Math.max(MIN_RATE, Math.min(MAX_RATE, playbackRate));
      }

      prefetchDecodedBufferRef.current = decoded;
      prefetchWordsRef.current = allWords;
      prefetchDurationRef.current = expectedDuration;
      prefetchPlaybackRateRef.current = playbackRate;
    } catch (err) {
      console.error("Prefetch audio decode failed:", err);
    }
  }, []);

  const connect = useCallback(async () => {
    if (connectPromiseRef.current) return connectPromiseRef.current;

    ensureCtx();

    connectPromiseRef.current = new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(getWsUrl());
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        const connTimeout = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close();
            reject(new Error("WebSocket timeout"));
          }
        }, 15000);

        ws.onopen = () => {
          clearTimeout(connTimeout);
          resolve(ws);
        };

        ws.onerror = (err) => {
          clearTimeout(connTimeout);
          reject(err);
        };

        ws.onclose = () => {
          clearTimeout(connTimeout);
          wsRef.current = null;
          connectPromiseRef.current = null;
        };

        ws.onmessage = async (e) => {
          try {
            if (typeof e.data === "string") {
              const msg = safeJsonParse(e.data);
              if (!msg) return;

              if (msg.type === "alignment") {
                const isPrefetch = isPrefetchingRef.current;
                const arr = isPrefetch ? prefetchAlignmentsRef.current : allAlignmentsRef.current;
                const expectedId = isPrefetch ? prefetchStreamIdRef.current : streamIdRef.current;

                if (isPrefetch) {
                  if (prefetchStreamIdRef.current !== expectedId) return;
                } else {
                  if (streamIdRef.current !== expectedId) return;
                }

                arr.push({
                  seq: Number(msg.seq),
                  words:
                    msg.words?.map((w) => ({
                      word: w.word,
                      startSec: w.startSeconds,
                      endSec: w.endSeconds,
                      startChar: w.startChar,
                      endChar: w.endChar,
                    })) || [],
                });
              } else if (msg.type === "complete") {
                const isPrefetch = isPrefetchingRef.current;
                if (isPrefetch) {
                  prefetchGotCompleteRef.current = true;
                  isPrefetchingRef.current = false;
                  decodePrefetchedAudio();
                } else {
                  gotCompleteRef.current = true;
                  tryPlayAll();
                }
              } else if (msg.type === "ack") {
                if (!isPrefetchingRef.current) {
                  totalChunksExpectedRef.current = msg.totalChunks;
                }
              }
              return;
            }

            let rawData = e.data;
            if (rawData instanceof Blob) {
              rawData = await rawData.arrayBuffer();
            }

            if (!(rawData instanceof ArrayBuffer)) return;

            const isPrefetch = isPrefetchingRef.current;
            const targetChunks = isPrefetch ? prefetchAudioChunksRef.current : allAudioChunksRef.current;
            const targetId = isPrefetch ? prefetchStreamIdRef.current : streamIdRef.current;

            if (targetId === (isPrefetch ? prefetchStreamIdRef.current : streamIdRef.current)) {
              const audioData = rawData.slice(8);
              targetChunks.push(audioData);
              if (!isPrefetch) chunksReceivedRef.current++;
            }
          } catch (err) {
            console.error("TTS: message processing error", err);
          }
        };
      } catch (err) {
        console.error("TTS: WebSocket setup failed", err);
        reject(err);
      }
    });

    return connectPromiseRef.current;
  }, [ensureCtx, tryPlayAll, decodePrefetchedAudio]);

  useEffect(() => {
    if (!enabled) return;
    connect().catch(console.error);
    return () => {
      stopLoop();
      clearHighlight();
    };
  }, [enabled, connect, stopLoop, clearHighlight]);

  const togglePlay = useCallback(async () => {
    const ctx = ensureCtx();
    unlockIOSAudio(ctx);

    if (!isPlaying) {
      setIsPlaying(true);
      startLoop();
      try {
        await connect();
      } catch (err) {
        console.error("Toggle play connection failed:", err);
      }
    } else {
      if (!isIOSDevice()) {
        try {
          await ctx.suspend();
        } catch (e) {
          console.warn("ctx.suspend failed:", e);
        }
      }
      stopLoop();
      setIsPlaying(false);
    }
  }, [connect, ensureCtx, isPlaying, startLoop, stopLoop]);

  const hasPrefetch = useCallback(() => {
    return prefetchGotCompleteRef.current && prefetchDecodedBufferRef.current !== null;
  }, []);

  const promotePrefetch = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !prefetchDecodedBufferRef.current || !prefetchGotCompleteRef.current) return false;

    playbackStartTimeRef.current = null;
    lastHighlightedRef.current = null;
    wordCursorRef.current = 0;
    clearHighlight();

    if (scheduledSourceRef.current) {
      try {
        scheduledSourceRef.current.stop();
      } catch {
        // Ignore
      }
      scheduledSourceRef.current = null;
    }

    allWordsRef.current = prefetchWordsRef.current;
    totalDurationRef.current = prefetchDurationRef.current;
    charOffsetRef.current = prefetchCharOffsetRef.current;
    isLastPageRef.current = prefetchIsLastPageRef.current;

    prefetchPayloadRef.current = null;
    prefetchIsLastPageRef.current = false;

    gotCompleteRef.current = true;
    pageEndedFiredRef.current = false;
    streamCancelledRef.current = false;
    prefetchTriggeredRef.current = false;

    const startAt = ctx.currentTime + 0.05;
    playbackStartTimeRef.current = startAt;

    const src = ctx.createBufferSource();
    src.buffer = prefetchDecodedBufferRef.current;
    src.playbackRate.value = prefetchPlaybackRateRef.current;
    src.connect(ctx.destination);
    src.start(startAt);

    scheduledSourceRef.current = src;
    setIsStreaming(true);
    setIsLoading(false);

    prefetchDecodedBufferRef.current = null;
    prefetchAudioChunksRef.current = [];
    prefetchAlignmentsRef.current = [];
    prefetchWordsRef.current = [];
    prefetchGotCompleteRef.current = false;

    return true;
  }, [clearHighlight]);

  const startPageStream = useCallback(
    async (payload, charOffset = 0, options = {}) => {
      const { prefetch = false } = options;
      const payloadStr = JSON.stringify(payload);

      if (!prefetch) {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 12000);
      }

      await connect();
      if (isIOSDevice()) await new Promise((r) => setTimeout(r, 150));
      ensureCtx();

      if (prefetch) {
        isPrefetchingRef.current = true;
        prefetchStreamIdRef.current += 1;
        prefetchPayloadRef.current = payloadStr;
        prefetchIsLastPageRef.current = Boolean(payload.isLastPage);

        prefetchAudioChunksRef.current = [];
        prefetchAlignmentsRef.current = [];
        prefetchCharOffsetRef.current = charOffset;
        prefetchGotCompleteRef.current = false;
        prefetchDecodedBufferRef.current = null;
        prefetchWordsRef.current = [];
        prefetchDurationRef.current = 0;
        prefetchPlaybackRateRef.current = 1;
      } else {
        if (isPrefetchingRef.current && prefetchPayloadRef.current === payloadStr) {
          if (scheduledSourceRef.current) {
            try {
              scheduledSourceRef.current.stop();
            } catch {
              // Ignore
            }
            scheduledSourceRef.current = null;
          }

          playbackStartTimeRef.current = null;
          totalDurationRef.current = 0;
          allWordsRef.current = [];
          wordCursorRef.current = 0;
          lastHighlightedRef.current = null;
          clearHighlight();

          allAudioChunksRef.current = [...prefetchAudioChunksRef.current];
          allAlignmentsRef.current = [...prefetchAlignmentsRef.current];
          charOffsetRef.current = prefetchCharOffsetRef.current;
          isLastPageRef.current = prefetchIsLastPageRef.current;

          isPrefetchingRef.current = false;
          streamIdRef.current = prefetchStreamIdRef.current;

          setIsStreaming(true);
          setIsLoading(true);
          gotCompleteRef.current = false;
          pageEndedFiredRef.current = false;
          prefetchTriggeredRef.current = false;
          streamCancelledRef.current = false;
          prefetchPayloadRef.current = null;
          return;
        }

        if (prefetchPayloadRef.current === payloadStr && prefetchGotCompleteRef.current) {
          promotePrefetch();
          return;
        }

        cancelStream();

        streamIdRef.current += 1;
        streamCancelledRef.current = false;
        isPrefetchingRef.current = false;
        prefetchPayloadRef.current = null;
        isLastPageRef.current = Boolean(payload.isLastPage);

        allAudioChunksRef.current = [];
        allAlignmentsRef.current = [];
        allWordsRef.current = [];
        wordCursorRef.current = 0;
        totalChunksExpectedRef.current = 0;
        chunksReceivedRef.current = 0;
        playbackStartTimeRef.current = null;
        totalDurationRef.current = 0;
        expectedDurationRef.current = 0;
        charOffsetRef.current = charOffset;

        gotCompleteRef.current = false;
        pageEndedFiredRef.current = false;
        prefetchTriggeredRef.current = false;

        setIsStreaming(true);
        setIsLoading(true);
        clearHighlight();
      }

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        if (!prefetch) {
          setIsStreaming(false);
          setIsLoading(false);
        }
        throw new Error("WebSocket not ready");
      }

      ws.send(payloadStr);
    },
    [connect, ensureCtx, clearHighlight, cancelStream, promotePrefetch]
  );

  return {
    isPlaying,
    isStreaming,
    isLoading,
    togglePlay,
    startPageStream,
    cancelStream,
    promotePrefetch,
    hasPrefetch,
  };
}

export default useReaderTTS;
