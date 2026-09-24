import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Global Zustand Store for Reader Customization & Audio Settings.
 * Automatically persists user preferences (font size, audio effects, volume, and voice) to localStorage.
 */
export const useReaderPreferencesStore = create(
  persist(
    (set) => ({
      fontSize: 24,
      voice: "ar-male-1",
      ambientEffect: "none", // "none" | "rain" | "wind" | "nature"
      volume: 0.7,
      isMuted: false,
      theme: "pure-white", // "pure-white" | "warm-cream" | "paper-sepia" | "charcoal-dark"

      setFontSize: (fontSize) => set({ fontSize }),
      setVoice: (voice) => set({ voice }),
      setAmbientEffect: (ambientEffect) => set({ ambientEffect }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setTheme: (theme) => set({ theme }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      cycleVolume: () =>
        set((state) => {
          if (state.volume >= 0.7) return { volume: 0.3, isMuted: false };
          if (state.volume >= 0.3) return { volume: 1.0, isMuted: false };
          return { volume: 0.7, isMuted: false };
        }),

      resetPreferences: () =>
        set({
          fontSize: 24,
          voice: "ar-male-1",
          ambientEffect: "none",
          volume: 0.7,
          isMuted: false,
          theme: "pure-white",
        }),
    }),
    {
      name: "ktab-reader-preferences",
    }
  )
);

export default useReaderPreferencesStore;
