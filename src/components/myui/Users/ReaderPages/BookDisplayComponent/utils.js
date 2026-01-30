/**
 * Detect if the current device is running iOS (iPhone, iPad, iPod)
 * This is used to apply iOS-specific audio workarounds
 */
export function isIOSDevice() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  
  // Check for iOS devices using user agent
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Also check for iPad on iOS 13+ which reports as Mac
  const isIPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  
  return isIOS || isIPadOS;
}

/**
 * Safari-compatible decodeAudioData wrapper
 * Uses callback-style syntax and adds a timeout for older WebKit engines on iOS
 */
export function decodeAudioDataSafe(ctx, arrayBuffer) {
  if (isIOSDevice()) {
    return new Promise((resolve, reject) => {
      // Safari decodeAudioData can sometimes hang if the context is not ready
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
 * Unlock iOS audio hardware by playing silent audio
 * Must be called DIRECTLY from a user gesture (click/touch) event handler
 */
export function unlockIOSAudio(ctx) {
  if (!ctx) return;
  
  // iOS requirement: resume context immediately in same tick as click
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
    console.log("iOS audio context primed with oscillator");
  } catch (err) {
    console.warn("Failed to unlock iOS audio:", err);
  }
}

export function getWsUrl() {
  try {
    if (import.meta.env.VITE_API_URL) {

      return `wss://kristan-prickliest-ezekiel.ngrok-free.dev/ws/reader/tts?ngrok-skip-browser-warning=true`;
    }
  } catch (err) {
    void err;
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
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    return decoded;
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

/* ----------------------------
   NEW: backend streaming helpers
----------------------------- */
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
