import { create } from "zustand";
import { FAKE_SOUND_SAMPLE } from "@/fakedataorassets/testData";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

let singletonAudio = null;

function getAudio() {
  if (typeof window === "undefined") return null;
  if (!singletonAudio) {
    singletonAudio = new Audio();
    singletonAudio.preload = "auto";
  }
  return singletonAudio;
}

/**
 * Global Voice Sample Audio & Modal Store
 * Guarantees STRICTLY ONE audio stream and ONE modal instance across the entire platform.
 */
export const useVoiceSampleStore = create((set, get) => {
  // Attach singleton audio listeners once
  if (typeof window !== "undefined") {
    const audio = getAudio();
    if (audio) {
      audio.addEventListener("timeupdate", () => {
        const cur = audio.currentTime || 0;
        const dur = audio.duration || 1;
        set({
          currentTime: cur,
          duration: dur,
          currentTimeFormatted: formatTime(cur),
          durationFormatted: formatTime(dur),
          progress: dur > 0 ? (cur / dur) * 100 : 0,
        });
      });

      audio.addEventListener("loadedmetadata", () => {
        const dur = audio.duration || 1;
        set({
          duration: dur,
          durationFormatted: formatTime(dur),
        });
      });

      audio.addEventListener("ended", () => {
        set({
          isPlaying: false,
          currentTime: 0,
          currentTimeFormatted: "0:00",
          progress: 0,
        });
      });

      audio.addEventListener("play", () => set({ isPlaying: true }));
      audio.addEventListener("pause", () => set({ isPlaying: false }));
    }
  }

  return {
    isOpen: false,
    activeBook: null,
    isPlaying: false,
    currentTime: 0,
    duration: 1,
    progress: 0,
    currentTimeFormatted: "0:00",
    durationFormatted: "0:00",
    playbackRate: 1.0,

    /**
     * Open voice sample for a book.
     * Automatically stops and tears down any currently playing audio on the page.
     */
    openSample: (book) => {
      if (!book) return;
      const audio = getAudio();
      if (!audio) return;

      // 1. Immediately pause and reset any previous playback
      audio.pause();
      audio.currentTime = 0;

      // 2. Mute any background videos on the page to enforce single audio source
      try {
        document.querySelectorAll("video").forEach((v) => {
          if (!v.muted) v.muted = true;
        });
      } catch (err) {
        // ignore DOM queries during SSR
      }

      // 3. Set new audio source
      const targetSrc = book.audioSrc || FAKE_SOUND_SAMPLE;
      if (audio.src !== targetSrc) {
        audio.src = targetSrc;
        audio.load();
      }

      // 4. Update store state
      set({
        isOpen: true,
        activeBook: book,
        isPlaying: true,
        currentTime: 0,
        currentTimeFormatted: "0:00",
        progress: 0,
      });

      // 5. Start playback
      audio
        .play()
        .then(() => set({ isPlaying: true }))
        .catch(() => set({ isPlaying: false }));
    },

    /**
     * Close the modal and stop all audio playback immediately.
     */
    closeSample: () => {
      const audio = getAudio();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      set({
        isOpen: false,
        isPlaying: false,
        currentTime: 0,
        currentTimeFormatted: "0:00",
        progress: 0,
      });
    },

    /**
     * Toggle play / pause on the active audio instance.
     */
    togglePlay: () => {
      const audio = getAudio();
      if (!audio) return;
      if (audio.paused) {
        // Enforce single active audio across the entire page
        try {
          document.querySelectorAll("video").forEach((v) => {
            if (!v.muted) v.muted = true;
          });
        } catch (err) {}

        audio
          .play()
          .then(() => set({ isPlaying: true }))
          .catch(() => {});
      } else {
        audio.pause();
        set({ isPlaying: false });
      }
    },

    /**
     * Skip forward or backward by delta seconds (-5s, +5s, etc.)
     */
    skipTime: (delta) => {
      const audio = getAudio();
      if (!audio) return;
      const dur = audio.duration || 1;
      const target = Math.max(0, Math.min(dur, (audio.currentTime || 0) + delta));
      audio.currentTime = target;
      set({
        currentTime: target,
        currentTimeFormatted: formatTime(target),
        progress: (target / dur) * 100,
      });
    },

    /**
     * Seek to a specific progress percentage (0 - 100).
     */
    seek: (progressPercent) => {
      const audio = getAudio();
      if (!audio) return;
      const dur = audio.duration || 1;
      const target = Math.max(0, Math.min(dur, (progressPercent / 100) * dur));
      audio.currentTime = target;
      set({
        currentTime: target,
        currentTimeFormatted: formatTime(target),
        progress: progressPercent,
      });
    },

    /**
     * Set audio playback rate (0.75x, 1x, 1.25x, 1.5x, 2x)
     */
    setPlaybackRate: (rate) => {
      const audio = getAudio();
      if (audio) {
        audio.playbackRate = rate;
      }
      set({ playbackRate: rate });
    },
  };
});

export default useVoiceSampleStore;
