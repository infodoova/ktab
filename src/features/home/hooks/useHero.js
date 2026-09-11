import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FAKE_HERO_BOOKS as HERO_BOOKS, FAKE_SOUND_SAMPLE } from "@/fakedataorassets/testData";

/**
 * Custom hook containing all state, audio playback, and 3D positioning metrics for the Hero section.
 * Powers the 3D book carousel, first-page flip, and the animated Voice Sample Player Modal.
 */
export function useHero() {
  const navigate = useNavigate();
  const books = HERO_BOOKS;

  // Carousel & 3D Flip State
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 680 : false
  );
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 680);
      setWindowWidth(w);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Voice Sample Modal & Audio State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSamplePlaying, setIsSamplePlaying] = useState(false);
  const [sampleTime, setSampleTime] = useState(0);
  const [sampleDuration, setSampleDuration] = useState(1);
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  const sampleAudioRef = useRef(null);

  // Early Access Modal State
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);

  const currentBook = books[activeIndex] || books[0];

  // Safe helper to obtain a ready-to-play HTMLAudioElement with valid source
  const getAudio = useCallback(() => {
    const targetSrc = currentBook?.audioSrc || FAKE_SOUND_SAMPLE;
    if (!sampleAudioRef.current) {
      const audio = new Audio(targetSrc);
      audio.preload = "auto";
      sampleAudioRef.current = audio;
    } else if (
      !sampleAudioRef.current.src ||
      sampleAudioRef.current.src === "" ||
      sampleAudioRef.current.src === window.location.href ||
      !sampleAudioRef.current.src.includes(".mp3")
    ) {
      sampleAudioRef.current.src = targetSrc;
      sampleAudioRef.current.load();
    }
    return sampleAudioRef.current;
  }, [currentBook]);

  // Initialize and synchronize sample audio element
  useEffect(() => {
    const audio = getAudio();
    audio.playbackRate = playbackRate;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setSampleDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setSampleTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsSamplePlaying(false);
      setSampleTime(0);
    };

    const handlePlay = () => setIsSamplePlaying(true);
    const handlePause = () => setIsSamplePlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    if (audio.duration && !isNaN(audio.duration)) {
      setSampleDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [getAudio, playbackRate]);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
        sampleAudioRef.current = null;
      }
    };
  }, []);

  // Carousel navigation handlers with flip reset
  const nextBook = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev + 1) % books.length);
  }, [books.length]);

  const prevBook = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length);
  }, [books.length]);

  const selectBook = useCallback((index) => {
    setIsFlipped(false);
    setActiveIndex(index);
  }, []);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Tactile swipe / drag gesture handler for mobile & desktop drag
  const handleDragEnd = useCallback(
    (event, info) => {
      const swipeThreshold = 40;
      const velocityThreshold = 250;
      if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
        prevBook();
      } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
        nextBook();
      }
    },
    [nextBook, prevBook]
  );

  // Voice Sample Modal controls
  const openVoiceModal = useCallback(() => {
    setIsVoiceModalOpen(true);
    const audio = getAudio();
    if (audio) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsSamplePlaying(true))
        .catch((err) => {
          console.warn("Audio playback was blocked:", err);
          setIsSamplePlaying(false);
        });
    }
  }, [getAudio]);

  const closeVoiceModal = useCallback(() => {
    setIsVoiceModalOpen(false);
    if (sampleAudioRef.current) {
      sampleAudioRef.current.pause();
      setIsSamplePlaying(false);
    }
  }, []);

  const toggleSamplePlay = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;
    if (isSamplePlaying) {
      audio.pause();
      setIsSamplePlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsSamplePlaying(true))
        .catch((err) => {
          console.warn("Play blocked:", err);
          setIsSamplePlaying(false);
        });
    }
  }, [getAudio, isSamplePlaying]);

  const skipSampleTime = useCallback((seconds) => {
    const audio = getAudio();
    if (!audio) return;
    const maxDuration = audio.duration && !isNaN(audio.duration) ? audio.duration : sampleDuration || 1;
    const newTime = Math.max(0, Math.min(maxDuration, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setSampleTime(newTime);
  }, [getAudio, sampleDuration]);

  const seekSample = useCallback((percent) => {
    const audio = getAudio();
    if (!audio) return;
    const maxDuration = audio.duration && !isNaN(audio.duration) ? audio.duration : sampleDuration || 1;
    const newTime = (Math.max(0, Math.min(100, percent)) / 100) * maxDuration;
    audio.currentTime = newTime;
    setSampleTime(newTime);
  }, [getAudio, sampleDuration]);

  const setPlaybackRate = useCallback((rate) => {
    const audio = getAudio();
    if (audio) {
      audio.playbackRate = rate;
    }
    setPlaybackRateState(rate);
  }, [getAudio]);

  // Time format helper (mm:ss)
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const sampleProgress = sampleDuration > 0 ? (sampleTime / sampleDuration) * 100 : 0;

  // Fluid 3D Apple-style Curved Arc Animation Calculations
  const animatedBooks = useMemo(() => {
    const count = books.length;
    const isSmallMobile = windowWidth <= 420;
    const xStep1 = isMobile
      ? (isSmallMobile ? Math.min(115, Math.max(98, windowWidth * 0.28)) : 126)
      : 215;
    const xStep2 = isMobile ? 230 : 390;
    const centerZ = isMobile ? 85 : 140;
    const centerScale = 1;
    const sideScale1 = isMobile ? 0.82 : 0.84;
    const sideScale2 = isMobile ? 0.62 : 0.70;

    return books.map((book, index) => {
      let offset = (index - activeIndex) % count;
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;

      const isCenter = offset === 0;

      // Realistic 3D arc perspective coordinates
      let x = 0;
      let y = 0;
      let z = 0;
      let scale = 1;
      let rotateY = 0;
      let opacity = 1;
      let zIndex = 10;
      let isVisible = true;

      if (isCenter) {
        x = 0;
        y = 0;
        z = centerZ;
        scale = centerScale;
        rotateY = 0;
        opacity = 1;
        zIndex = 30;
      } else if (offset === 1) {
        x = -xStep1;
        y = 6;
        z = 25;
        scale = sideScale1;
        rotateY = 26;
        opacity = 0.85;
        zIndex = 20;
      } else if (offset === -1) {
        x = xStep1;
        y = 6;
        z = 25;
        scale = sideScale1;
        rotateY = -26;
        opacity = 0.85;
        zIndex = 20;
      } else if (offset === 2) {
        x = -xStep2;
        y = 16;
        z = -75;
        scale = sideScale2;
        rotateY = 38;
        opacity = isMobile ? 0 : 0.48;
        zIndex = 10;
        isVisible = !isMobile;
      } else if (offset === -2) {
        x = xStep2;
        y = 16;
        z = -75;
        scale = sideScale2;
        rotateY = -38;
        opacity = isMobile ? 0 : 0.48;
        zIndex = 10;
        isVisible = !isMobile;
      } else {
        x = offset > 0 ? -600 : 600;
        y = 24;
        z = -150;
        scale = 0.55;
        rotateY = offset > 0 ? 50 : -50;
        opacity = 0;
        zIndex = 0;
        isVisible = false;
      }

      return {
        ...book,
        index,
        offset,
        isCenter,
        isVisible,
        motionConfig: {
          x,
          y,
          z,
          scale,
          rotateY,
          opacity,
          zIndex,
        },
      };
    });
  }, [books, activeIndex, isFlipped, isMobile, windowWidth]);

  // Navigation handlers
  const handleStartNow = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  const openEarlyAccess = useCallback(() => {
    setIsEarlyAccessOpen(true);
  }, []);

  const closeEarlyAccess = useCallback(() => {
    setIsEarlyAccessOpen(false);
  }, []);

  return {
    books,
    animatedBooks,
    activeIndex,
    currentBook,
    isFlipped,
    nextBook,
    prevBook,
    selectBook,
    toggleFlip,
    handleDragEnd,
    // Voice Sample Modal Controls
    isVoiceModalOpen,
    openVoiceModal,
    closeVoiceModal,
    isSamplePlaying,
    sampleTimeFormatted: formatTime(sampleTime),
    sampleDurationFormatted: formatTime(sampleDuration),
    sampleProgress,
    toggleSamplePlay,
    skipSampleTime,
    seekSample,
    playbackRate,
    setPlaybackRate,
    // Other Modals & Nav
    isEarlyAccessOpen,
    openEarlyAccess,
    closeEarlyAccess,
    handleStartNow,
  };
}

export default useHero;
