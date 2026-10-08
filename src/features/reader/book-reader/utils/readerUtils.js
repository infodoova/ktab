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

/**
 * Safari-compatible decodeAudioData wrapper
 */
export function decodeAudioDataSafe(ctx, arrayBuffer) {
  if (isIOSDevice()) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Audio decode timeout on iOS"));
      }, 10000);

      ctx.decodeAudioData(
        arrayBuffer,
        (buffer) => {
          clearTimeout(timeout);
          resolve(buffer);
        },
        (err) => {
          clearTimeout(timeout);
          reject(err || new Error("Audio decode failed"));
        }
      );
    });
  }
  return ctx.decodeAudioData(arrayBuffer);
}

/**
 * Unlock iOS audio hardware by playing silent audio directly from user gesture
 */
export function unlockIOSAudio(ctx) {
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch((err) => console.warn("ctx.resume failed:", err));
  }

  if (!isIOSDevice()) return;

  try {
    const oscillator = ctx.createOscillator();
    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;
    oscillator.connect(silentGain);
    silentGain.connect(ctx.destination);
    oscillator.start(0);
    oscillator.stop(0.001);
  } catch (err) {
    console.warn("Failed to unlock iOS audio:", err);
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
