import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  FAKE_CATALOG_BOOKS,
  FAKE_SOUND_SAMPLE,
} from "@/fakedataorassets/testData";

/**
 * Ultra-High Performance Custom Hook for Apple Books Showcase:
 * 1. Zero Layout Thrashing: Caches track metrics outside the RAF loop.
 * 2. Hardware-Accelerated 60-120 FPS continuous marquee with buttery-smooth physics slowdown.
 * 3. Audio preview modal integration.
 * 4. Zero business logic inside JSX/view components.
 */
export function useBooksMasonry() {
  // 3 sets per row (36 cards per track = approx 7,350px total track width)
  // Perfectly covers even ultra-wide 4K displays while minimizing memory footprint
  const { row1, row2 } = useMemo(() => {
    const all = FAKE_CATALOG_BOOKS;
    const set1 = all;
    const set2 = [
      ...all.slice(6),
      ...all.slice(0, 6),
    ];

    return {
      row1: [...set1, ...set1, ...set1],
      row2: [...set2, ...set2, ...set2],
    };
  }, []);

  // Marquee track DOM refs
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  // Cached pixel widths for single-set wrap (avoids getBoundingClientRect in RAF loop)
  const setWidth1 = useRef(2448);
  const setWidth2 = useRef(2448);

  // Measure track widths once on mount and on window resize only
  useEffect(() => {
    const measureWidths = () => {
      if (row1Ref.current && row1Ref.current.children.length >= 13) {
        const c0 = row1Ref.current.children[0];
        const c12 = row1Ref.current.children[12];
        if (c0 && c12) {
          const dist = Math.abs(
            c12.getBoundingClientRect().left - c0.getBoundingClientRect().left
          );
          if (dist > 100) setWidth1.current = dist;
        }
      }

      if (row2Ref.current && row2Ref.current.children.length >= 13) {
        const c0 = row2Ref.current.children[0];
        const c12 = row2Ref.current.children[12];
        if (c0 && c12) {
          const dist = Math.abs(
            c12.getBoundingClientRect().left - c0.getBoundingClientRect().left
          );
          if (dist > 100) setWidth2.current = dist;
        }
      }
    };

    // Initial measurement
    const timer = setTimeout(measureWidths, 100);
    window.addEventListener("resize", measureWidths, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureWidths);
    };
  }, []);

  // Hover state flags for smooth slowdown
  const isHoveredRow1 = useRef(false);
  const isHoveredRow2 = useRef(false);

  // Position and speed states for physics loop
  const pos1 = useRef(0);
  const pos2 = useRef(0);
  const speed1 = useRef(0.85);
  const speed2 = useRef(0.85);

  // Animation frame ID
  const rafId = useRef(null);

  // Pure GPU Animation Loop (Zero layout recalculations / Zero DOM reads)
  useEffect(() => {
    const normalSpeed = 0.85;
    const slowSpeed = 0.18;
    const lerpFactor = 0.05;

    const animate = () => {
      // Smoothly interpolate speed towards target
      const targetSpeed1 = isHoveredRow1.current ? slowSpeed : normalSpeed;
      speed1.current += (targetSpeed1 - speed1.current) * lerpFactor;

      const targetSpeed2 = isHoveredRow2.current ? slowSpeed : normalSpeed;
      speed2.current += (targetSpeed2 - speed2.current) * lerpFactor;

      // Update Track 1 (Gliding Leftwards)
      if (row1Ref.current) {
        const w1 = setWidth1.current;
        pos1.current += speed1.current;
        if (pos1.current >= w1) {
          pos1.current -= w1;
        }
        row1Ref.current.style.transform = `translate3d(${-pos1.current}px, 0, 0)`;
      }

      // Update Track 2 (Gliding Rightwards for dynamic visual depth)
      if (row2Ref.current) {
        const w2 = setWidth2.current;
        pos2.current += speed2.current;
        if (pos2.current >= w2) {
          pos2.current -= w2;
        }
        row2Ref.current.style.transform = `translate3d(${pos2.current - w2}px, 0, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleRow1MouseEnter = useCallback(() => {
    isHoveredRow1.current = true;
  }, []);

  const handleRow1MouseLeave = useCallback(() => {
    isHoveredRow1.current = false;
  }, []);

  const handleRow2MouseEnter = useCallback(() => {
    isHoveredRow2.current = true;
  }, []);

  const handleRow2MouseLeave = useCallback(() => {
    isHoveredRow2.current = false;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDIO PLAYBACK & MODAL INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════
  const [selectedBook, setSelectedBook] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const audioRef = useRef(null);

  const getAudio = useCallback((src) => {
    const targetSrc = src || FAKE_SOUND_SAMPLE;
    if (!audioRef.current) {
      const audio = new Audio(targetSrc);
      audio.preload = "auto";
      audioRef.current = audio;
    } else {
      if (audioRef.current.src !== targetSrc) {
        audioRef.current.src = targetSrc;
        audioRef.current.load();
      }
    }
    return audioRef.current;
  }, []);

  // Audio lifecycle listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [selectedBook]);

  // Open & play audio sample for a book
  const handlePlayBook = useCallback(
    (book, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setSelectedBook(book);
      setIsVoiceModalOpen(true);

      const audio = getAudio(book.audioSrc);
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    },
    [getAudio]
  );

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const handleSkip = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + seconds)
    );
  }, []);

  const handleSeek = useCallback((fraction) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
  }, []);

  const handleCloseModal = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsVoiceModalOpen(false);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    row1,
    row2,
    row1Ref,
    row2Ref,
    handleRow1MouseEnter,
    handleRow1MouseLeave,
    handleRow2MouseEnter,
    handleRow2MouseLeave,
    selectedBook,
    isVoiceModalOpen,
    isPlaying,
    currentTime,
    duration,
    progress,
    handlePlayBook,
    handleTogglePlay,
    handleSkip,
    handleSeek,
    handleCloseModal,
  };
}

export default useBooksMasonry;
