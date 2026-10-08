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

// Construct a complete PCM WAV. WebKit rejects inconsistent RIFF/data lengths.
function createSilentWavDataUri() {
  const sampleRate = 8000;
  const bytes = new Uint8Array(44 + sampleRate);
  const view = new DataView(bytes.buffer);
  const writeTag = (offset, tag) => {
    for (let i = 0; i < tag.length; i++) bytes[offset + i] = tag.charCodeAt(i);
  };
  writeTag(0, "RIFF");
  view.setUint32(4, bytes.length - 8, true);
  writeTag(8, "WAVE");
  writeTag(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeTag(36, "data");
  view.setUint32(40, sampleRate, true);
  bytes.fill(128, 44); // Unsigned 8-bit PCM silence.
  return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
}

export const SILENT_WAV_DATA_URI = createSilentWavDataUri();

let mobileKeepAliveAudioEl = null;

/**
 * Starts a silent, looping HTML5 audio element.
 * 1. Elevates iOS AVAudioSession category to "Playback" (ignores iPhone silent switch).
 * 2. Prevents the mobile OS from shutting down audio hardware / sleeping the Web Audio pipeline
 *    during network streaming latencies (waiting for TTS chunk synthesis).
 * 3. Bridges gap across automated page turns without requiring new user touches.
 */
export function startMobileAudioKeepAlive() {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;

  // 1. Declare AudioSession category as "playback" (iOS 15+ standard)
  if (typeof navigator !== "undefined" && navigator.audioSession) {
    try {
      navigator.audioSession.type = "playback";
    } catch {
      // Older browsers may expose an audio session without a writable type.
    }
  }

  // 2. Play silent looping audio element
  try {
    if (!mobileKeepAliveAudioEl) {
      mobileKeepAliveAudioEl = new Audio();
      mobileKeepAliveAudioEl.src = SILENT_WAV_DATA_URI;
      mobileKeepAliveAudioEl.loop = true;
      mobileKeepAliveAudioEl.setAttribute("playsinline", "true");
      mobileKeepAliveAudioEl.setAttribute("webkit-playsinline", "true");
      mobileKeepAliveAudioEl.setAttribute("x-webkit-airplay", "deny");
      mobileKeepAliveAudioEl.volume = 0.01;
    }
    if (mobileKeepAliveAudioEl.paused) {
      const p = mobileKeepAliveAudioEl.play();
      if (p !== undefined) {
        p.catch((err) => console.warn("Mobile audio keep-alive play warning:", err));
      }
    }
  } catch (err) {
    console.warn("startMobileAudioKeepAlive error:", err);
  }
}

/**
 * Pauses the silent audio loop when TTS narration is intentionally paused or stopped.
 */
export function stopMobileAudioKeepAlive() {
  if (mobileKeepAliveAudioEl && !mobileKeepAliveAudioEl.paused) {
    try {
      mobileKeepAliveAudioEl.pause();
      mobileKeepAliveAudioEl.currentTime = 0;
    } catch {
      // The media element may have been released by the browser.
    }
  }
}

/**
 * Robust decodeAudioData wrapper for all platforms (iOS WebKit, Android Chrome, Desktop).
 * Includes timeout protection and handles both modern Promise and legacy callback WebKit decoders.
 */
export async function decodeAudioDataSafe(ctx, arrayBuffer, timeoutMs = 12000) {
  if (!ctx) throw new Error("AudioContext required");

  // Decoding works while suspended. Awaiting resume here can hang forever on
  // iOS outside a user gesture and would bypass the decoder timeout below.
  // Clone arrayBuffer to protect against WebKit detachment
  const bufferCopy = arrayBuffer.slice ? arrayBuffer.slice(0) : arrayBuffer;

  const decodePromise = new Promise((resolve, reject) => {
    let resolved = false;

    try {
      const res = ctx.decodeAudioData(
        bufferCopy,
        (decoded) => {
          if (!resolved) {
            resolved = true;
            resolve(decoded);
          }
        },
        (err) => {
          if (!resolved) {
            resolved = true;
            reject(err || new Error("Audio decode failed"));
          }
        }
      );

      if (res && typeof res.then === "function") {
        res
          .then((decoded) => {
            if (!resolved) {
              resolved = true;
              resolve(decoded);
            }
          })
          .catch((err) => {
            if (!resolved) {
              resolved = true;
              reject(err || new Error("Audio decode failed"));
            }
          });
      }
    } catch (err) {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    }
  });

  let timer;
  const timerPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("decodeAudioData timeout")), timeoutMs);
  });
  try {
    return await Promise.race([decodePromise, timerPromise]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Merges multiple decoded AudioBuffer objects into a single continuous AudioBuffer.
 * This completely avoids MP3 multi-header concatenation bugs where iOS CoreAudio rejects
 * or truncates raw binary concatenated MP3 chunks.
 */
export function mergeAudioBuffers(ctx, buffers) {
  if (!buffers || buffers.length === 0) return null;
  const validBuffers = buffers.filter(Boolean);
  if (validBuffers.length === 0) return null;
  if (validBuffers.length === 1) return validBuffers[0];

  const totalLength = validBuffers.reduce((sum, b) => sum + b.length, 0);
  const numberOfChannels = validBuffers[0].numberOfChannels || 1;
  const sampleRate = validBuffers[0].sampleRate || ctx?.sampleRate || 44100;
  const merged = ctx.createBuffer(numberOfChannels, totalLength, sampleRate);

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = merged.getChannelData(channel);
    let offset = 0;
    for (const b of validBuffers) {
      if (channel < b.numberOfChannels) {
        channelData.set(b.getChannelData(channel), offset);
      }
      offset += b.length;
    }
  }

  return merged;
}

/** Resume with a deadline: WebKit can leave resume() pending when blocked. */
export async function resumeAudioContextSafe(ctx, timeoutMs = 5000) {
  if (ctx.state === "running") return;
  let timer;
  try {
    await Promise.race([
      ctx.resume(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Audio playback could not start")), timeoutMs);
      }),
    ]);
    if (ctx.state !== "running") throw new Error("Audio context is not running");
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Unlock mobile audio hardware and audio session on user gesture:
 * 1. Resumes Web Audio Context synchronously.
 * 2. Starts mobile keep-alive loop (elevates to Playback category, bypassing iOS silent switch).
 * 3. Plays a 1-sample silent Web Audio buffer to warm up the graph.
 */
export function unlockMobileAudio(ctx) {
  if (!ctx) return;

  // Direct AudioSession category set
  if (typeof navigator !== "undefined" && navigator.audioSession) {
    try {
      navigator.audioSession.type = "playback";
    } catch {
      // AudioSession support varies across Safari versions.
    }
  }

  // Call resume and HTMLAudio.play synchronously within the user's gesture.
  const resumed = resumeAudioContextSafe(ctx);
  // Other callers warm up audio without awaiting it; keep failures handled.
  resumed.catch((err) => console.warn("ctx.resume failed:", err));
  startMobileAudioKeepAlive();

  // Play 1-sample silent Web Audio buffer to warm up Web Audio output node
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (err) {
    console.warn("Failed to unlock Web Audio buffer:", err);
  }
  return resumed;
}

// Backwards compatibility alias
export const unlockIOSAudio = unlockMobileAudio;

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
