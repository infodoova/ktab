/**
 * Detect if the current device is running iOS (iPhone, iPad, iPod)
 */
export function isIOSDevice() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return isIOS || isIPadOS;
}

export {
  isIPadDevice,
  isVerticalView,
  isIPadVertical,
  getTargetWordsPerPage,
} from "./readerPaginationUtils";

// 44-byte silent WAV data URI to unlock iOS audio session category to Playback (overrides hardware mute switch)
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
let iosUnlockAudioEl = null;

/**
 * Robust decodeAudioData wrapper for all platforms (iOS WebKit, Android, Desktop)
 */
export async function decodeAudioDataSafe(ctx, arrayBuffer) {
  if (!ctx) throw new Error("AudioContext required");

  // On iOS Safari, resume context if it was suspended before attempting decode
  if (ctx.state === "suspended" || ctx.state === "interrupted") {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn("AudioContext resume before decode warning:", e);
    }
  }

  // Clone arrayBuffer to protect against detachment
  const bufferCopy = arrayBuffer.slice ? arrayBuffer.slice(0) : arrayBuffer;

  // 1. Modern Promise-based decode (supported on all modern browsers: iOS Safari 14.5+, Chrome, Edge, Firefox)
  try {
    const res = ctx.decodeAudioData(bufferCopy);
    if (res && typeof res.then === "function") {
      return await res;
    }
  } catch (err) {
    console.warn("Promise decodeAudioData failed, falling back to callback:", err);
  }

  // 2. Fallback for older WebKit / browsers that require callback syntax
  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(
      arrayBuffer.slice ? arrayBuffer.slice(0) : arrayBuffer,
      (buffer) => resolve(buffer),
      (err) => reject(err || new Error("Audio decode failed"))
    );
  });
}

/**
 * Unlock iOS audio hardware and audio session:
 * 1. Resumes AudioContext
 * 2. Plays a silent Web Audio buffer
 * 3. Plays a silent HTML5 Audio element to switch iOS AVAudioSession to "Playback"
 *    (Ensures TTS audio plays through speakers even if the iPhone physical silent switch is ON!)
 */
export function unlockIOSAudio(ctx) {
  if (!ctx) return;

  if (ctx.state === "suspended" || ctx.state === "interrupted") {
    ctx.resume().catch((err) => console.warn("ctx.resume failed:", err));
  }

  if (!isIOSDevice()) return;

  // 1. Play silent HTML5 Audio element to promote audio session to Playback category
  try {
    if (!iosUnlockAudioEl && typeof Audio !== "undefined") {
      iosUnlockAudioEl = new Audio();
      iosUnlockAudioEl.src = SILENT_WAV_DATA_URI;
      iosUnlockAudioEl.setAttribute("playsinline", "true");
      iosUnlockAudioEl.setAttribute("webkit-playsinline", "true");
      iosUnlockAudioEl.volume = 0.01;
    }
    if (iosUnlockAudioEl) {
      const p = iosUnlockAudioEl.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
  } catch (err) {
    console.warn("iOS HTML5 audio unlock error:", err);
  }

  // 2. Play 1-sample silent Web Audio buffer
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (err) {
    console.warn("Failed to unlock iOS Web Audio buffer:", err);
  }
}

export function getWsUrl() {
  const envWs = import.meta.env.VITE_WS_URL;
  if (envWs) {
    return envWs;
  }

  // Derive WSS URL dynamically from VITE_API_URL if possible
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (apiUrl.startsWith("https://")) {
    const wsBase = apiUrl.replace(/^https:\/\//, "wss://");
    return `${wsBase}/ws/reader/tts?ngrok-skip-browser-warning=true`;
  } else if (apiUrl.startsWith("http://")) {
    const wsBase = apiUrl.replace(/^http:\/\//, "ws://");
    return `${wsBase}/ws/reader/tts?ngrok-skip-browser-warning=true`;
  }

  return `wss://api.ktab.app/Ktab-0.0.1-SNAPSHOT/ws/reader/tts?ngrok-skip-browser-warning=true`;
}


export function createAudioContextSafe() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    return new AudioContext();
  } catch (err) {
    console.warn("createAudioContextSafe error:", err);
    return null;
  }
}

export async function fetchAndDecode(ctx, url) {
  if (!ctx) return null;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("fetch failed: " + resp.status);
    const arrayBuffer = await resp.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn("fetchAndDecode error:", url, err);
    return null;
  }
}

export function createGainNode(ctx, initialValue = 1) {
  if (!ctx) return null;
  try {
    const gain = ctx.createGain();
    gain.gain.value = initialValue;
    gain.connect(ctx.destination);
    return gain;
  } catch (err) {
    console.warn("createGainNode error:", err);
    return null;
  }
}

export function base64ToArrayBuffer(base64) {
  try {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  } catch (err) {
    console.warn("base64ToArrayBuffer error:", err);
    return null;
  }
}

export function safeJsonParse(input) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}
