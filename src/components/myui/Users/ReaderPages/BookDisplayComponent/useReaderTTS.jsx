import { useCallback, useEffect, useRef, useState } from "react";
import { getWsUrl, createAudioContextSafe, safeJsonParse } from "./utils";

// Prefetch threshold: start loading next page when 80% through current
const PREFETCH_RATIO = 0.4;

export function useReaderTTS({ enabled, onPageEnded, onPrefetchNextPage }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

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

  // Track which stream is currently being prefetched (if any)
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
      // FUZZY MATCH: If exact match fails, find the word that contains this range
      // or overlaps significantly.
      const allWords = document.querySelectorAll("[data-word-start]");
      let bestMatch = null;
      let minDiff = 10; // Max allowed character drift

      for (const wordEl of allWords) {
        const wordStart = parseInt(wordEl.getAttribute("data-word-start"));
        const wordEnd = parseInt(wordEl.getAttribute("data-word-end"));

        // Check if this element covers our word
        if (wordStart <= startChar && wordEnd >= endChar) {
          el = wordEl;
          break;
        }

        // Check for slight drift (off by 1 or 2 characters)
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

      // t is actual elapsed time since playback started
      const elapsed = ctx.currentTime - startTime;

      // Find current word (word timings are in original expected scale)
      let currentWord = null;
      // Find the word that's currently being spoken (starting from cursor)
      for (let i = wordCursorRef.current; i < allWordsRef.current.length; i++) {
        const w = allWordsRef.current[i];
        // Check if elapsed time is within this word's time range
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

      // 🔮 PREFETCH NEXT PAGE at 80% completion (while audio still playing)
      if (
        gotCompleteRef.current &&
        !prefetchTriggeredRef.current &&
        !streamCancelledRef.current &&
        !isLastPageRef.current &&
        totalDurationRef.current > 0 &&
        elapsed >= totalDurationRef.current * PREFETCH_RATIO
      ) {
        prefetchTriggeredRef.current = true;
        console.log(
          `Prefetch triggered at ${(
            (elapsed / totalDurationRef.current) *
            100
          ).toFixed(0)}% (${elapsed.toFixed(
            2
          )}s / ${totalDurationRef.current.toFixed(2)}s)`
        );
        onPrefetchNextPage?.();
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

        if (isLastPageRef.current) {
          console.log("Last page reached, stopping TTS playback");
          setIsPlaying(false);
          if (audioCtxRef.current) audioCtxRef.current.suspend();
          stopLoop();
          return; // Stop the animation loop
        } else {
          onPageEnded?.();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [
    clearHighlight,
    highlightWord,
    onPageEnded,
    onPrefetchNextPage,
    stopLoop,
  ]);

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
        if (!alignment.words || alignment.words.length === 0) continue;

        const lastWord = alignment.words[alignment.words.length - 1];
        const chunkDuration = lastWord ? lastWord.endSec : 0;

        for (const w of alignment.words) {
          allWords.push({
            word: w.word,
            startSec: cumulativeOffset + w.startSec,
            endSec: cumulativeOffset + w.endSec,
            startChar: charOffsetRef.current + w.startChar,
            endChar: charOffsetRef.current + w.endChar,
          });
        }

        cumulativeOffset += chunkDuration;
      }

      const expectedDuration = cumulativeOffset || decoded.duration;
      expectedDurationRef.current = expectedDuration;

      console.log(
        `Decoded: ${actualDuration.toFixed(
          2
        )}s, Expected: ${expectedDuration.toFixed(2)}s, Words: ${
          allWords.length
        }`
      );

      // Calculate playback rate to stretch audio to match expected duration
      // playbackRate < 1 = slower, > 1 = faster
      let playbackRate =
        expectedDuration > 0 ? actualDuration / expectedDuration : 1;

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
        console.warn(
          `Playback rate ${playbackRate.toFixed(
            3
          )} is extreme. Clamping to [${MIN_RATE}, ${MAX_RATE}].`
        );
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
        // Already stopped or not playing
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
    clearHighlight();
  }, [clearHighlight]);

  // Decode prefetched audio (called when prefetch stream completes)
  const decodePrefetchedAudio = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (prefetchAudioChunksRef.current.length === 0) return;

    console.log(
      `Decoding prefetched audio: ${prefetchAudioChunksRef.current.length} chunks`
    );

    // Concatenate all audio chunks
    const totalLength = prefetchAudioChunksRef.current.reduce(
      (sum, c) => sum + c.byteLength,
      0
    );
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of prefetchAudioChunksRef.current) {
      combined.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    try {
      const decoded = await ctx.decodeAudioData(combined.buffer.slice(0));
      const actualDuration = decoded.duration;

      // Sort alignments and calculate expected total duration
      prefetchAlignmentsRef.current.sort((a, b) => a.seq - b.seq);

      let cumulativeOffset = 0;
      const allWords = [];

      for (const alignment of prefetchAlignmentsRef.current) {
        if (!alignment.words || alignment.words.length === 0) continue;

        const lastWord = alignment.words[alignment.words.length - 1];
        const chunkDuration = lastWord ? lastWord.endSec : 0;

        for (const w of alignment.words) {
          allWords.push({
            word: w.word,
            startSec: cumulativeOffset + w.startSec,
            endSec: cumulativeOffset + w.endSec,
            startChar: prefetchCharOffsetRef.current + w.startChar,
            endChar: prefetchCharOffsetRef.current + w.endChar,
          });
        }

        cumulativeOffset += chunkDuration;
      }

      const expectedDuration = cumulativeOffset || decoded.duration;
      let playbackRate =
        expectedDuration > 0 ? actualDuration / expectedDuration : 1;

      // SAFETY CLAMP
      const MIN_RATE = 0.5;
      const MAX_RATE = 2.0;
      if (playbackRate < MIN_RATE || playbackRate > MAX_RATE) {
        console.warn(
          `Prefetch playback rate ${playbackRate.toFixed(3)} clamped`
        );
        playbackRate = Math.max(MIN_RATE, Math.min(MAX_RATE, playbackRate));
      }

      // Store decoded data for instant playback when page advances
      prefetchDecodedBufferRef.current = decoded;
      prefetchWordsRef.current = allWords;
      prefetchDurationRef.current = expectedDuration;
      prefetchPlaybackRateRef.current = playbackRate;

      console.log(
        `Prefetch ready: ${allWords.length} words, ${expectedDuration.toFixed(
          2
        )}s`
      );
    } catch (err) {
      console.error("Prefetch audio decode failed:", err);
    }
  }, []);

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
        if (typeof e.data === "string") {
          const msg = safeJsonParse(e.data);

          if (msg?.type === "alignment") {
            // Check prefetch status AT THE MOMENT of receiving
            const isPrefetch = isPrefetchingRef.current;
            const expectedId = isPrefetch
              ? prefetchStreamIdRef.current
              : streamIdRef.current;

            if (isPrefetch) {
              if (prefetchStreamIdRef.current !== expectedId) return;
              const seq = Number(msg.seq);
              prefetchAlignmentsRef.current.push({
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
            } else {
              if (streamIdRef.current !== expectedId) return;
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
            }
            return;
          }

          if (msg?.type === "complete") {
            const isPrefetch = isPrefetchingRef.current;
            const expectedId = isPrefetch
              ? prefetchStreamIdRef.current
              : streamIdRef.current;

            if (isPrefetch) {
              if (prefetchStreamIdRef.current !== expectedId) return;
              console.log("Prefetch stream complete");
              prefetchGotCompleteRef.current = true;
              isPrefetchingRef.current = false;
              decodePrefetchedAudio();
            } else {
              if (streamIdRef.current !== expectedId) return;
              console.log("Stream complete");
              gotCompleteRef.current = true;
              tryPlayAll();
            }
            return;
          }

          if (msg?.type === "ack") {
            if (!isPrefetchingRef.current) {
              totalChunksExpectedRef.current = msg.totalChunks;
              console.log(`Expecting ${msg.totalChunks} chunks`);
            } else {
              console.log(`Prefetch expecting ${msg.totalChunks} chunks`);
            }
          }
          return;
        }

        // Binary audio - route to appropriate buffer
        const isPrefetch = isPrefetchingRef.current;
        const expectedId = isPrefetch
          ? prefetchStreamIdRef.current
          : streamIdRef.current;

        if (isPrefetch) {
          if (prefetchStreamIdRef.current !== expectedId) return;
          const audioData = e.data.slice(8);
          prefetchAudioChunksRef.current.push(audioData);
        } else {
          if (streamIdRef.current !== expectedId) return;
          const audioData = e.data.slice(8);
          allAudioChunksRef.current.push(audioData);
          chunksReceivedRef.current += 1;
        }
      };
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

  // Check if prefetch is ready
  const hasPrefetch = useCallback(() => {
    return (
      prefetchGotCompleteRef.current &&
      prefetchDecodedBufferRef.current !== null
    );
  }, []);

  // Promote prefetched audio to current and start playback immediately
  // Returns true if prefetch was available and promoted, false otherwise
  const promotePrefetch = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return false;

    // Check if we have prefetched audio ready
    if (!prefetchDecodedBufferRef.current || !prefetchGotCompleteRef.current) {
      console.log("No prefetch available to promote");
      return false;
    }

    console.log("Promoting prefetch to current playback");

    // HARD RESET: Clear existing state before applying new one
    playbackStartTimeRef.current = null;
    lastHighlightedRef.current = null;
    wordCursorRef.current = 0;
    clearHighlight();

    // Stop current playback if any
    if (scheduledSourceRef.current) {
      try {
        scheduledSourceRef.current.stop();
      } catch {
        // Already stopped or not playing
      }
      scheduledSourceRef.current = null;
    }

    // Transfer prefetch data to current
    allWordsRef.current = prefetchWordsRef.current;
    totalDurationRef.current = prefetchDurationRef.current;
    charOffsetRef.current = prefetchCharOffsetRef.current;
    isLastPageRef.current = prefetchIsLastPageRef.current;

    // Clear prefetch metadata
    prefetchPayloadRef.current = null;
    prefetchIsLastPageRef.current = false;

    // Reset state for new playback
    gotCompleteRef.current = true;
    pageEndedFiredRef.current = false;
    streamCancelledRef.current = false;
    prefetchTriggeredRef.current = false;

    // Schedule immediate playback with a small safety gap
    const startAt = ctx.currentTime + 0.05;
    playbackStartTimeRef.current = startAt;

    const src = ctx.createBufferSource();
    src.buffer = prefetchDecodedBufferRef.current;
    src.playbackRate.value = prefetchPlaybackRateRef.current;
    src.connect(ctx.destination);
    src.start(startAt);

    scheduledSourceRef.current = src;
    setIsStreaming(true);

    console.log(
      `Playing prefetched: ${
        prefetchWordsRef.current.length
      } words, ${prefetchDurationRef.current.toFixed(2)}s`
    );

    // Clear prefetch buffers
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

      await connect();
      ensureCtx();

      if (prefetch) {
        // PREFETCH MODE: Don't cancel current stream, just prepare next page
        console.log("Starting prefetch stream");
        isPrefetchingRef.current = true;
        prefetchStreamIdRef.current += 1;
        prefetchPayloadRef.current = payloadStr;
        prefetchIsLastPageRef.current = !!payload.isLastPage;

        // Clear prefetch buffers
        prefetchAudioChunksRef.current = [];
        prefetchAlignmentsRef.current = [];
        prefetchCharOffsetRef.current = charOffset;
        prefetchGotCompleteRef.current = false;
        prefetchDecodedBufferRef.current = null;
        prefetchWordsRef.current = [];
        prefetchDurationRef.current = 0;
        prefetchPlaybackRateRef.current = 1;
      } else {
        // NORMAL MODE: Check if we are already prefetching this exact payload
        if (
          isPrefetchingRef.current &&
          prefetchPayloadRef.current === payloadStr
        ) {
          console.log(
            "Adopting in-progress prefetch stream for active playback"
          );

          // CRITICAL: Stop any previous playback immediately
          if (scheduledSourceRef.current) {
            try {
              scheduledSourceRef.current.stop();
            } catch {
              // Ignore already stopped
            }
            scheduledSourceRef.current = null;
          }

          // HARD RESET: Clear existing state so tick() loop goes idle
          playbackStartTimeRef.current = null;
          totalDurationRef.current = 0;
          allWordsRef.current = [];
          wordCursorRef.current = 0;
          lastHighlightedRef.current = null;
          clearHighlight();

          // Sync buffers from prefetch to active
          allAudioChunksRef.current = [...prefetchAudioChunksRef.current];
          allAlignmentsRef.current = [...prefetchAlignmentsRef.current];
          charOffsetRef.current = prefetchCharOffsetRef.current;
          isLastPageRef.current = prefetchIsLastPageRef.current;

          isPrefetchingRef.current = false;
          streamIdRef.current = prefetchStreamIdRef.current;

          setIsStreaming(true);
          gotCompleteRef.current = false;
          pageEndedFiredRef.current = false;
          prefetchTriggeredRef.current = false;
          streamCancelledRef.current = false;
          prefetchPayloadRef.current = null;
          return;
        }

        // If prefetch is ALREADY complete for this payload, just promote it
        if (
          prefetchPayloadRef.current === payloadStr &&
          prefetchGotCompleteRef.current
        ) {
          console.log("Using already completed prefetch for active playback");
          promotePrefetch();
          return;
        }

        // Otherwise, cancel any existing stream and start fresh
        cancelStream();

        streamIdRef.current += 1;
        streamCancelledRef.current = false;
        isPrefetchingRef.current = false;
        prefetchPayloadRef.current = null;
        isLastPageRef.current = !!payload.isLastPage;

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
        clearHighlight();
      }

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        if (!prefetch) setIsStreaming(false);
        throw new Error("WebSocket not ready");
      }

      console.log(prefetch ? "Prefetching:" : "Sending:", payload);
      ws.send(payloadStr);
    },
    [connect, ensureCtx, clearHighlight, cancelStream, promotePrefetch]
  );

  return {
    isPlaying,
    isStreaming,
    togglePlay,
    startPageStream,
    cancelStream,
    promotePrefetch,
    hasPrefetch,
  };
}
