import { useCallback, useEffect, useRef, useState } from "react";
import { getWsUrl, safeJsonParse } from "../utils/readerUtils";
import { createNativeNarrationPlayer } from "../services/nativeNarrationPlayer";

/** iOS narration uses native media playback; it never creates an AudioContext. */
export function useNativeReaderTTS({ enabled, onPageEnded, onPrefetchNextPage, onError }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playingRef = useRef(false);
  const disposedRef = useRef(!enabled);
  const lifecycleRef = useRef(0);
  const playerRef = useRef(null);
  const socketRef = useRef(null);
  const connectionRef = useRef(null);
  const connectionTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const currentTaskRef = useRef(null);
  const prefetchTaskRef = useRef(null);
  const receivingTaskRef = useRef(null);
  const rafRef = useRef(null);
  const highlightedRef = useRef(null);
  const callbacksRef = useRef({ onPageEnded, onPrefetchNextPage, onError });

  useEffect(() => {
    callbacksRef.current = { onPageEnded, onPrefetchNextPage, onError };
  }, [onPageEnded, onPrefetchNextPage, onError]);

  const clearHighlight = useCallback(() => {
    document.querySelectorAll(".tts-active-word").forEach((el) => el.classList.remove("tts-active-word"));
    highlightedRef.current = null;
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const cancelStream = useCallback(() => {
    lifecycleRef.current += 1;
    currentTaskRef.current = null;
    prefetchTaskRef.current = null;
    receivingTaskRef.current = null;
    clearTimeout(loadingTimerRef.current);
    playerRef.current?.stop();
    setIsLoading(false);
    setIsStreaming(false);
    stopLoop();
    clearHighlight();
  }, [clearHighlight, stopLoop]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    socketRef.current = null;
    connectionRef.current = null;
    clearTimeout(connectionTimerRef.current);
    if (socket) {
      socket.onmessage = null;
      if (socket.readyState < WebSocket.CLOSING) socket.close();
    }
  }, []);

  const fail = useCallback((error) => {
    if (disposedRef.current) return;
    console.error("iOS reader narration failed:", error);
    playingRef.current = false;
    cancelStream();
    disconnect();
    setIsPlaying(false);
    callbacksRef.current.onError?.(error);
  }, [cancelStream, disconnect]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => fail(new Error("TTS synthesis timed out")), 60000);
  }, [fail]);

  const updateProgress = useCallback((elapsed) => {
    const task = currentTaskRef.current;
    if (!task || !task.started || task.ended || !playingRef.current) return;
    const word = task.words.find((item) => elapsed >= item.start && elapsed <= item.end + 0.15);
    if (word && highlightedRef.current !== word.index) {
      clearHighlight();
      const el = document.querySelector(`[data-word-index="${word.index}"]`);
      if (el) {
        el.classList.add("tts-active-word");
        highlightedRef.current = word.index;
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
    if (!task.payload.isLastPage && !task.prefetchTriggered && elapsed >= task.duration * 0.4) {
      task.prefetchTriggered = true;
      callbacksRef.current.onPrefetchNextPage?.();
    }
  }, [clearHighlight]);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      if (disposedRef.current || !playingRef.current) { rafRef.current = null; return; }
      const elapsed = playerRef.current?.getElapsed();
      if (elapsed != null) updateProgress(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [updateProgress]);

  const playTask = useCallback(async (task) => {
    if (task !== currentTaskRef.current || !playingRef.current || disposedRef.current || task.started) return;
    const lifecycle = lifecycleRef.current;
    task.started = true;
    task.alignments.sort((a, b) => a.seq - b.seq);
    const timings = task.alignments.flatMap((alignment) => alignment.words || []);
    // The server's duration counter continues across requests on one socket.
    // Timings within a request are already cumulative; never add them twice.
    const offset = timings[0]?.startSeconds > 1.5 ? timings[0].startSeconds : 0;
    task.words = timings.map((word, index) => ({
      index: (task.payload.startWord || 0) + index,
      start: word.startSeconds - offset,
      end: word.endSeconds - offset,
    }));
    task.duration = Math.max(0, ...task.words.map((word) => word.end));
    try {
      await playerRef.current.playChunks(task.chunks, {
        onProgress: updateProgress,
        onError: (error) => {
          if (lifecycle === lifecycleRef.current && task === currentTaskRef.current) fail(error);
        },
        onEnded: () => {
          if (lifecycle !== lifecycleRef.current || task !== currentTaskRef.current || task.ended) return;
          task.ended = true;
          setIsStreaming(false);
          clearHighlight();
          if (task.payload.isLastPage) {
            playingRef.current = false;
            setIsPlaying(false);
            playerRef.current.stop();
            stopLoop();
          } else {
            callbacksRef.current.onPageEnded?.();
          }
        },
      });
      if (lifecycle !== lifecycleRef.current || task !== currentTaskRef.current || !playingRef.current) return;
      clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
      setIsStreaming(true);
      startLoop();
      // With no alignment, begin prefetch immediately rather than waiting forever.
      updateProgress(0);
    } catch (error) {
      if (lifecycle === lifecycleRef.current && task === currentTaskRef.current) fail(error);
    }
  }, [clearHighlight, fail, startLoop, stopLoop, updateProgress]);

  const connect = useCallback(() => {
    if (disposedRef.current) return Promise.reject(new Error("Reader is closed"));
    if (connectionRef.current) return connectionRef.current;
    const socket = new WebSocket(getWsUrl());
    socket.binaryType = "arraybuffer";
    socketRef.current = socket;
    let messages = Promise.resolve();
    const connected = new Promise((resolve, reject) => {
      connectionTimerRef.current = setTimeout(() => {
        reject(new Error("TTS WebSocket connection timed out"));
        if (socketRef.current === socket) disconnect();
      }, 15000);
      socket.onopen = () => { clearTimeout(connectionTimerRef.current); resolve(socket); };
      socket.onerror = () => reject(new Error("TTS WebSocket connection failed"));
      socket.onclose = () => {
        reject(new Error("TTS WebSocket closed"));
        if (socketRef.current !== socket) return;
        socketRef.current = null;
        connectionRef.current = null;
        clearTimeout(connectionTimerRef.current);
        if (playingRef.current) fail(new Error("TTS WebSocket disconnected"));
      };
    });
    connectionRef.current = connected;
    // Serialize Blob conversion with subsequent complete/alignment messages.
    socket.onmessage = (event) => {
      messages = messages.then(async () => {
        if (disposedRef.current || socketRef.current !== socket) return;
        if (typeof event.data === "string") {
          const message = safeJsonParse(event.data);
          if (message?.type === "error") { fail(new Error(message.message || "TTS server error")); return; }
          const task = receivingTaskRef.current;
          if (!task) return;
          if (message?.type === "alignment") task.alignments.push(message);
          if (message?.type === "complete") {
            task.complete = true;
            receivingTaskRef.current = null;
            if (task === currentTaskRef.current) await playTask(task);
          }
          return;
        }
        const task = receivingTaskRef.current;
        const data = event.data instanceof Blob ? await event.data.arrayBuffer() : event.data;
        if (socketRef.current !== socket || task !== receivingTaskRef.current || !task) return;
        if (!(data instanceof ArrayBuffer) || data.byteLength <= 8) throw new Error("Invalid TTS audio frame");
        // The first 8 bytes are the server sequence, not MP3 audio.
        task.chunks.push(data.slice(8));
      }).catch(fail);
    };
    return connected;
  }, [disconnect, fail, playTask]);

  const stopReader = useCallback(() => {
    disposedRef.current = true;
    playingRef.current = false;
    cancelStream();
    disconnect();
    playerRef.current?.dispose();
    playerRef.current = null;
    setIsPlaying(false);
  }, [cancelStream, disconnect]);

  useEffect(() => {
    disposedRef.current = !enabled;
    const timer = enabled ? setTimeout(() => connect().catch(() => {}), 0) : null;
    return () => { clearTimeout(timer); stopReader(); };
  }, [enabled, connect, stopReader]);

  useEffect(() => {
    if (!enabled) return;
    const resume = () => {
      if (document.visibilityState === "visible" && playingRef.current) {
        playerRef.current?.resume().catch(fail);
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
    };
  }, [enabled, fail, startLoop]);

  const togglePlay = useCallback(async () => {
    if (disposedRef.current) return false;
    if (playingRef.current) {
      playingRef.current = false;
      cancelStream();
      disconnect();
      setIsPlaying(false);
      return false;
    }
    const lifecycle = lifecycleRef.current;
    playingRef.current = true;
    setIsPlaying(true);
    startLoading();
    try {
      playerRef.current ||= createNativeNarrationPlayer();
      // Prime THIS media element before any connection or synthesis await.
      playerRef.current.prime();
      await connect();
      return !disposedRef.current && playingRef.current && lifecycle === lifecycleRef.current;
    } catch (error) {
      if (lifecycle === lifecycleRef.current) fail(error);
      return false;
    }
  }, [cancelStream, connect, disconnect, fail, startLoading]);

  const startPageStream = useCallback(async (payload, charOffset = 0, { prefetch = false } = {}) => {
    if (disposedRef.current || !playingRef.current) return;
    const lifecycle = lifecycleRef.current;
    const key = JSON.stringify({
      bookId: payload.bookId, voiceId: payload.voiceId, page: payload.page,
      wordsPerPage: payload.wordsPerPage, startWord: payload.startWord,
      endWord: payload.endWord, isLastPage: payload.isLastPage,
    });
    if (!prefetch) startLoading();
    try {
      const socket = await connect();
      if (disposedRef.current || !playingRef.current || lifecycle !== lifecycleRef.current) return;
      if (!prefetch && prefetchTaskRef.current?.key === key) {
        currentTaskRef.current = prefetchTaskRef.current;
        prefetchTaskRef.current = null;
        clearHighlight();
        if (currentTaskRef.current.complete) await playTask(currentTaskRef.current);
        return;
      }
      if (prefetch && (prefetchTaskRef.current?.key === key || receivingTaskRef.current)) return;
      if (!prefetch && receivingTaskRef.current) {
        // A manual page turn interrupted an older request. Reconnect so late
        // frames cannot be mistaken for the new page's MP3 or alignment.
        disconnect();
        await connect();
        if (lifecycle !== lifecycleRef.current || disposedRef.current || !playingRef.current) return;
      }
      const task = { key, payload, charOffset, chunks: [], alignments: [], words: [], duration: 0, started: false, complete: false, ended: false, prefetchTriggered: false };
      if (prefetch) {
        prefetchTaskRef.current = task;
      } else {
        if (currentTaskRef.current?.started && !currentTaskRef.current.ended) playerRef.current?.stop();
        currentTaskRef.current = task;
        prefetchTaskRef.current = null;
        setIsStreaming(true);
        clearHighlight();
      }
      receivingTaskRef.current = task;
      const targetSocket = socketRef.current || socket;
      targetSocket.send(JSON.stringify(payload));
    } catch (error) {
      if (lifecycle === lifecycleRef.current) fail(error);
    }
  }, [clearHighlight, connect, disconnect, fail, playTask, startLoading]);

  const hasPrefetch = useCallback(() => Boolean(prefetchTaskRef.current?.complete), []);
  const promotePrefetch = useCallback(() => {
    const task = prefetchTaskRef.current;
    if (!task?.complete) return false;
    currentTaskRef.current = task;
    prefetchTaskRef.current = null;
    playTask(task);
    return true;
  }, [playTask]);

  return { isPlaying, isStreaming, isLoading, togglePlay, startPageStream, cancelStream, stopReader, hasPrefetch, promotePrefetch };
}
