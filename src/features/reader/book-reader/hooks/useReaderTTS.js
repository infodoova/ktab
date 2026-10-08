import { useCallback, useEffect, useRef, useState } from "react";
import {
  getWsUrl,
  createAudioContextSafe,
  safeJsonParse,
  decodeAudioDataSafe,
  mergeAudioBuffers,
  unlockMobileAudio,
  startMobileAudioKeepAlive,
  stopMobileAudioKeepAlive,
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
  const disposedRef = useRef(false);
  const lifecycleIdRef = useRef(0);
  const loadingTimeoutRef = useRef(null);

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
  const activeSourcesRef = useRef(new Set());
  const expectedDurationRef = useRef(0);

  const gotCompleteRef = useRef(false);
  const pageEndedFiredRef = useRef(false);
  const streamCancelledRef = useRef(false);
  const prefetchTriggeredRef = useRef(false);

  const rafRef = useRef(null);
  const allWordsRef = useRef([]);
  const wordCursorRef = useRef(0);
  const totalDurationRef = useRef(0);
  const charOffsetRef = useRef(0);
  const startWordRef = useRef(0);
  const prefetchStartWordRef = useRef(0);

  const isPrefetchingRef = useRef(false);
  const lastHighlightedRef = useRef(null);

  const ensureCtx = useCallback(() => {
    if (disposedRef.current) throw new Error("Reader TTS has been disposed");
    let ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "closed") {
      ctx = createAudioContextSafe();
      audioCtxRef.current = ctx;
    }
    if (!ctx) throw new Error("Web Audio API not available");
    return ctx;
  }, []);

  const clearHighlight = useCallback(() => {
    document.querySelectorAll(".tts-active-word").forEach((el) => {
      el.classList.remove("tts-active-word");
    });
    lastHighlightedRef.current = null;
  }, []);

  const highlightWord = useCallback((startChar, endChar, wordIndex = null) => {
    const key = wordIndex != null ? `idx-${wordIndex}` : `${startChar}-${endChar}`;
    if (lastHighlightedRef.current === key) return;

    document.querySelectorAll(".tts-active-word").forEach((el) => {
      el.classList.remove("tts-active-word");
    });

    let el = null;

    // 1. Primary: Match by exact word index (100% resilient across paragraph containers)
    if (wordIndex != null) {
      el = document.querySelector(`[data-word-index="${wordIndex}"]`);
    }

    // 2. Secondary: Match by exact character boundary
    if (!el && startChar != null && endChar != null) {
      el = document.querySelector(`[data-word-start="${startChar}"][data-word-end="${endChar}"]`);
    }

    // 3. Fallback: Fuzzy boundary match
    if (!el && startChar != null && endChar != null) {
      const allWords = document.querySelectorAll("[data-word-start]");
      let bestMatch = null;
      let minDiff = 12;

      for (const wordEl of allWords) {
        const wordStart = parseInt(wordEl.getAttribute("data-word-start"), 10);
        const wordEnd = parseInt(wordEl.getAttribute("data-word-end"), 10);

        if (isNaN(wordStart) || isNaN(wordEnd)) continue;

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
        block: "nearest",
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
      if (disposedRef.current) return;
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
        highlightWord(currentWord.startChar, currentWord.endChar, currentWord.wordIndex);
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
    const lifecycleId = lifecycleIdRef.current;
    const streamId = streamIdRef.current;
    if (disposedRef.current || streamCancelledRef.current) return;
    if (!ctx) {
      setIsLoading(false);
      return;
    }

    if (!gotCompleteRef.current) return;

    if (allAudioChunksRef.current.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      if (ctx.state === "suspended" || ctx.state === "interrupted") {
        await ctx.resume().catch((e) => console.warn("TTS: Resume failed", e));
      }

      // Decode each chunk individually to prevent CoreAudio / WebKit MP3 multi-header decoding errors
      const decodedChunks = [];
      for (let i = 0; i < allAudioChunksRef.current.length; i++) {
        const chunk = allAudioChunksRef.current[i];
        try {
          const buf = await decodeAudioDataSafe(ctx, chunk);
          if (buf) decodedChunks.push(buf);
        } catch (chunkErr) {
          console.warn(`TTS: Chunk ${i} individual decode failed:`, chunkErr);
        }
      }

      let decoded = null;
      if (decodedChunks.length > 0) {
        decoded = mergeAudioBuffers(ctx, decodedChunks);
      } else {
        // Fallback: try decoding combined buffer if individual decoding returned nothing
        const totalLength = allAudioChunksRef.current.reduce((sum, c) => sum + c.byteLength, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of allAudioChunksRef.current) {
          combined.set(new Uint8Array(chunk), offset);
          offset += chunk.byteLength;
        }
        decoded = await decodeAudioDataSafe(ctx, combined.buffer.slice(0));
      }

      if (!decoded) {
        throw new Error("No decoded audio buffer available");
      }

      const actualDuration = decoded.duration;

      if (
        disposedRef.current || lifecycleId !== lifecycleIdRef.current ||
        streamId !== streamIdRef.current || streamCancelledRef.current ||
        ctx !== audioCtxRef.current
      ) return;

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
      let wordCounter = 0;
      const baseWordIndex = startWordRef.current ?? 0;

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
            wordIndex: baseWordIndex + wordCounter,
            startSec: baseTime + (w.startSec - timeOffset),
            endSec: baseTime + (w.endSec - timeOffset),
            startChar: finalStartChar,
            endChar: finalEndChar,
          });
          wordCounter++;
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

      const startAt = Math.max(ctx.currentTime + 0.05, ctx.currentTime);
      playbackStartTimeRef.current = startAt;

      const src = ctx.createBufferSource();
      src.buffer = decoded;
      src.playbackRate.value = playbackRate;
      src.connect(ctx.destination);
      activeSourcesRef.current.add(src);

      src.onended = () => {
        activeSourcesRef.current.delete(src);
        // Fallback for background / locked screen where requestAnimationFrame is paused by mobile OS
        if (
          gotCompleteRef.current &&
          !pageEndedFiredRef.current &&
          !streamCancelledRef.current
        ) {
          pageEndedFiredRef.current = true;
          setIsStreaming(false);
          clearHighlight();

          if (isLastPageRef.current) {
            setIsPlaying(false);
            stopMobileAudioKeepAlive();
            stopLoop();
          } else {
            onPageEnded?.();
          }
        }
      };

      src.start(startAt);

      scheduledSourceRef.current = src;
      setIsLoading(false);
    } catch (err) {
      console.error("Audio decode failed:", err);
      setIsLoading(false);
    }
  }, [clearHighlight, onPageEnded, stopLoop]);

  const cancelStream = useCallback(() => {
    streamIdRef.current += 1;
    prefetchStreamIdRef.current += 1;
    streamCancelledRef.current = true;

    for (const source of activeSourcesRef.current) {
      try {
        source.stop();
      } catch {
        // Ignored
      }
      try {
        source.disconnect();
      } catch {
        // The source may already have ended.
      }
    }
    activeSourcesRef.current.clear();
    scheduledSourceRef.current = null;
    clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = null;

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
    startWordRef.current = 0;
    prefetchStartWordRef.current = 0;

    gotCompleteRef.current = false;
    pageEndedFiredRef.current = false;

    isPrefetchingRef.current = false;
    prefetchAudioChunksRef.current = [];
    prefetchAlignmentsRef.current = [];
    prefetchDecodedBufferRef.current = null;
    prefetchWordsRef.current = [];
    prefetchGotCompleteRef.current = false;
    prefetchPayloadRef.current = null;
    isLastPageRef.current = false;
    prefetchIsLastPageRef.current = false;

    setIsStreaming(false);
    setIsLoading(false);
    clearHighlight();
  }, [clearHighlight]);

  const decodePrefetchedAudio = useCallback(async () => {
    const ctx = audioCtxRef.current;
    const lifecycleId = lifecycleIdRef.current;
    const streamId = prefetchStreamIdRef.current;
    if (disposedRef.current) return;
    if (!ctx || prefetchAudioChunksRef.current.length === 0) return;

    try {
      const decodedChunks = [];
      for (let i = 0; i < prefetchAudioChunksRef.current.length; i++) {
        const chunk = prefetchAudioChunksRef.current[i];
        try {
          const buf = await decodeAudioDataSafe(ctx, chunk);
          if (buf) decodedChunks.push(buf);
        } catch (chunkErr) {
          console.warn(`TTS prefetch: Chunk ${i} decode failed:`, chunkErr);
        }
      }

      let decoded = null;
      if (decodedChunks.length > 0) {
        decoded = mergeAudioBuffers(ctx, decodedChunks);
      } else {
        const totalLength = prefetchAudioChunksRef.current.reduce((sum, c) => sum + c.byteLength, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of prefetchAudioChunksRef.current) {
          combined.set(new Uint8Array(chunk), offset);
          offset += chunk.byteLength;
        }
        decoded = await decodeAudioDataSafe(ctx, combined.buffer.slice(0));
      }

      if (
        !decoded ||
        disposedRef.current || lifecycleId !== lifecycleIdRef.current ||
        streamId !== prefetchStreamIdRef.current || ctx !== audioCtxRef.current
      ) return;
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
      let prefetchWordCounter = 0;
      const basePrefetchWordIndex = prefetchStartWordRef.current ?? 0;

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
            wordIndex: basePrefetchWordIndex + prefetchWordCounter,
            startSec: baseTime + (w.startSec - timeOffset),
            endSec: baseTime + (w.endSec - timeOffset),
            startChar: finalStartChar,
            endChar: finalEndChar,
          });
          prefetchWordCounter++;
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
    if (disposedRef.current) return null;
    if (connectPromiseRef.current) return connectPromiseRef.current;

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
          if (wsRef.current === ws) {
            wsRef.current = null;
            connectPromiseRef.current = null;
          }
          reject(new Error("TTS WebSocket closed"));
        };

        ws.onmessage = async (e) => {
          if (disposedRef.current || wsRef.current !== ws) return;
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

            if (disposedRef.current || wsRef.current !== ws) return;

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

  const stopReader = useCallback(() => {
    // Invalidate work waiting for a connection or decode before releasing audio.
    disposedRef.current = true;
    lifecycleIdRef.current += 1;
    stopMobileAudioKeepAlive();
    cancelStream();
    stopLoop();
    setIsPlaying(false);
    const ws = wsRef.current;
    wsRef.current = null;
    connectPromiseRef.current = null;
    if (ws) {
      ws.onmessage = null;
      if (ws.readyState < WebSocket.CLOSING) ws.close();
    }

    const ctx = audioCtxRef.current;
    audioCtxRef.current = null;
    if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
  }, [cancelStream, stopLoop]);

  useEffect(() => {
    disposedRef.current = !enabled;
    // Strict Mode replays effects synchronously. Defer preconnection so its
    // first cleanup cancels the task before opening a socket.
    const connectionTimeout = enabled
      ? setTimeout(() => connect().catch(() => {}), 0)
      : null;
    return () => {
      clearTimeout(connectionTimeout);
      stopReader();
    };
  }, [enabled, connect, stopReader]);

  // Mobile: Pre-unlock audio on first touch/click anywhere on page
  useEffect(() => {
    const handleFirstGesture = () => {
      try {
        const ctx = ensureCtx();
        unlockMobileAudio(ctx);
      } catch (err) {
        // Ignored
      }
    };

    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
  }, [ensureCtx]);

  // Mobile: Handle visibility changes (tab sleeping / returning from background)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const ctx = audioCtxRef.current;
        if (ctx && (ctx.state === "suspended" || ctx.state === "interrupted")) {
          ctx.resume().catch((err) => {
            console.warn("Failed to resume audio context on visibility change:", err);
          });
        }
        if (isPlaying) {
          startMobileAudioKeepAlive();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isPlaying]);

  const togglePlay = useCallback(async () => {
    if (disposedRef.current) return;
    const lifecycleId = lifecycleIdRef.current;
    const ctx = ensureCtx();
    unlockMobileAudio(ctx);

    if (!isPlaying) {
      setIsPlaying(true);
      setIsLoading(true);
      startLoop();
      try {
        await connect();
      } catch (err) {
        if (disposedRef.current || lifecycleId !== lifecycleIdRef.current) return;
        console.error("Toggle play connection failed:", err);
        setIsLoading(false);
      }
    } else {
      stopMobileAudioKeepAlive();
      stopLoop();
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [connect, ensureCtx, isPlaying, startLoop, stopLoop]);

  const hasPrefetch = useCallback(() => {
    return prefetchGotCompleteRef.current && prefetchDecodedBufferRef.current !== null;
  }, []);

  const promotePrefetch = useCallback(() => {
    if (disposedRef.current) return false;
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
    startWordRef.current = prefetchStartWordRef.current;
    isLastPageRef.current = prefetchIsLastPageRef.current;

    prefetchPayloadRef.current = null;
    prefetchIsLastPageRef.current = false;

    gotCompleteRef.current = true;
    pageEndedFiredRef.current = false;
    streamCancelledRef.current = false;
    prefetchTriggeredRef.current = false;

    const startAt = Math.max(ctx.currentTime + 0.05, ctx.currentTime);
    playbackStartTimeRef.current = startAt;

    const src = ctx.createBufferSource();
    src.buffer = prefetchDecodedBufferRef.current;
    src.playbackRate.value = prefetchPlaybackRateRef.current;
    src.connect(ctx.destination);
    activeSourcesRef.current.add(src);

    src.onended = () => {
      activeSourcesRef.current.delete(src);
      // Fallback for background / locked screen where requestAnimationFrame is paused
      if (
        gotCompleteRef.current &&
        !pageEndedFiredRef.current &&
        !streamCancelledRef.current
      ) {
        pageEndedFiredRef.current = true;
        setIsStreaming(false);
        clearHighlight();

        if (isLastPageRef.current) {
          setIsPlaying(false);
          stopMobileAudioKeepAlive();
          stopLoop();
        } else {
          onPageEnded?.();
        }
      }
    };

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
      if (disposedRef.current) return;
      const lifecycleId = lifecycleIdRef.current;
      const { prefetch = false } = options;
      const payloadStr = JSON.stringify(payload);

      if (!prefetch) {
        setIsLoading(true);
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 15000);
      }

      try {
        await connect();
      } catch (err) {
        if (disposedRef.current || lifecycleId !== lifecycleIdRef.current) return;
        throw err;
      }
      const ctx = ensureCtx();
      unlockMobileAudio(ctx);

      if (prefetch) {
        isPrefetchingRef.current = true;
        prefetchStreamIdRef.current += 1;
        prefetchPayloadRef.current = payloadStr;
        prefetchIsLastPageRef.current = Boolean(payload.isLastPage);

        prefetchAudioChunksRef.current = [];
        prefetchAlignmentsRef.current = [];
        prefetchCharOffsetRef.current = charOffset;
        prefetchStartWordRef.current = typeof payload.startWord === "number" ? payload.startWord : 0;
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
        startWordRef.current = typeof payload.startWord === "number" ? payload.startWord : 0;

        gotCompleteRef.current = false;
        pageEndedFiredRef.current = false;
        prefetchTriggeredRef.current = false;

        setIsStreaming(true);
        setIsLoading(true);
        clearHighlight();
        loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 12000);
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
    stopReader,
    promotePrefetch,
    hasPrefetch,
  };
}

export default useReaderTTS;
