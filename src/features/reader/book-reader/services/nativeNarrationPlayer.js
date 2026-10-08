import silentPrimeMp3 from "../assets/silent-prime.mp3";

function playWithTimeout(audio, timeoutMs = 15000) {
  let timer;
  // Invoke play before yielding: priming must retain the Play button gesture.
  const playing = audio.play();
  return Promise.race([
    playing,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Narration playback timed out")), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timer));
}

/**
 * Play the server's complete MP3 chunks through one HTMLAudioElement on iOS.
 * Web Audio can remain silent while its context reports running. Safari grants
 * media activation per element, so this element survives every chunk/page turn.
 */
export function createNativeNarrationPlayer() {
  const audio = document.createElement("audio");
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "");
  audio.hidden = true;
  document.body.appendChild(audio);

  let generation = 0;
  let currentUrl = null;
  let elapsed = 0;
  let narrating = false;

  const releaseUrl = () => {
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  };

  const stop = () => {
    generation += 1;
    narrating = false;
    audio.onended = null;
    audio.onerror = null;
    audio.ontimeupdate = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    releaseUrl();
    elapsed = 0;
  };

  return {
    // This method is called synchronously from the user's Play action.
    prime() {
      stop();
      audio.loop = true;
      // Safari can leave play() pending for a WAV data URI even though the
      // element will later play MP3. Use the same codec as narration and let
      // the WebSocket request proceed while media activation settles.
      audio.src = silentPrimeMp3;
      const activation = audio.play();
      activation?.catch((error) => {
        if (error.name !== "AbortError") console.warn("Narration audio activation failed:", error);
      });
    },
    async playChunks(chunks, { onProgress, onEnded, onError }) {
      if (!chunks.length) throw new Error("TTS returned no audio");
      // Replace the primed source directly. Do not unload the activated
      // element between the user gesture and the asynchronously received MP3.
      generation += 1;
      audio.pause();
      elapsed = 0;
      narrating = false;
      const id = generation;
      let index = 0;
      let failed = false;
      audio.loop = false;

      const fail = (error) => {
        if (id !== generation || failed) return;
        failed = true;
        narrating = false;
        onError(error);
      };

      const playChunk = async () => {
        if (id !== generation) return;
        const nextUrl = URL.createObjectURL(new Blob([chunks[index]], { type: "audio/mpeg" }));
        audio.src = nextUrl;
        releaseUrl();
        currentUrl = nextUrl;
        await playWithTimeout(audio);
        if (id === generation && !failed) narrating = true;
      };

      audio.onerror = () => fail(new Error(`Native narration media error ${audio.error?.code || "unknown"}`));
      audio.ontimeupdate = () => {
        if (id === generation && narrating) onProgress(elapsed + audio.currentTime);
      };
      audio.onended = () => {
        if (id !== generation || failed) return;
        elapsed += Number.isFinite(audio.duration) ? audio.duration : audio.currentTime;
        narrating = false;
        index += 1;
        if (index < chunks.length) {
          playChunk().catch(fail);
        } else {
          narrating = false;
          onEnded();
        }
      };
      await playChunk();
    },
    getElapsed() {
      return narrating ? elapsed + audio.currentTime : null;
    },
    resume() {
      if (narrating && audio.paused && !audio.ended) return playWithTimeout(audio);
      return Promise.resolve();
    },
    stop,
    dispose() {
      stop();
      audio.remove();
    },
  };
}
