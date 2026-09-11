import { useState, useRef, useEffect, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useVoiceSampleStore } from "./useVoiceSampleStore";

/**
 * Format seconds into mm:ss
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * Custom hook containing all scroll animation metrics, video playback state,
 * timestamp tracking, auto-replay, and click-to-toggle pause logic.
 * Follows zero-logic-in-JSX engineering standard.
 */
export function useShowcaseVideo() {
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pulseAction, setPulseAction] = useState(null); // "play" | "pause" | null
  const pulseTimerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll-driven Google Antigravity expansion & shrinking animation
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0.18, 0.48, 0.64, 0.92],
    [0.72, 1, 1, 0.72]
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0.18, 0.48, 0.64, 0.92],
    [32, 16, 16, 32]
  );

  // Cinema Mode: when video reaches peak big size on desktop, hide navbar
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) {
      if (document.body.classList.contains("ktab-cinema-active")) {
        document.body.classList.remove("ktab-cinema-active");
      }
      return;
    }

    const isPeakBig = latest >= 0.38 && latest <= 0.68;
    if (isPeakBig) {
      document.body.classList.add("ktab-cinema-active");
    } else {
      document.body.classList.remove("ktab-cinema-active");
    }
  });

  useEffect(() => {
    return () => {
      document.body.classList.remove("ktab-cinema-active");
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  // Show transient center feedback icon when toggling
  const triggerPulse = useCallback((action) => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    setPulseAction(action);
    pulseTimerRef.current = setTimeout(() => {
      setPulseAction(null);
    }, 600);
  }, []);

  // Play / Pause toggle on click
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          triggerPulse("play");
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerPulse("pause");
    }
  }, [triggerPulse]);

  // Mute / Unmute toggle (Single audio enforcement)
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    // If unmuting video, immediately close any active audio voice sample
    if (!nextMuted) {
      useVoiceSampleStore.getState().closeSample();
    }
  }, []);

  // Listen to all video metadata and readyState events to guarantee duration is never stuck at 0
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncDuration = () => {
      const dur = video.duration;
      if (dur && isFinite(dur) && dur > 0) {
        setDuration(dur);
      }
    };

    if (video.readyState >= 1) {
      syncDuration();
    }

    video.addEventListener("loadedmetadata", syncDuration);
    video.addEventListener("durationchange", syncDuration);
    video.addEventListener("canplay", syncDuration);
    video.addEventListener("loadeddata", syncDuration);

    return () => {
      video.removeEventListener("loadedmetadata", syncDuration);
      video.removeEventListener("durationchange", syncDuration);
      video.removeEventListener("canplay", syncDuration);
      video.removeEventListener("loadeddata", syncDuration);
    };
  }, []);

  // Time update listener
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime || 0;
    const dur = videoRef.current.duration;
    setCurrentTime(cur);

    if (dur && isFinite(dur) && dur > 0) {
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  }, []);

  // Duration loaded listener
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    if (dur && isFinite(dur) && dur > 0) {
      setDuration(dur);
    }
  }, []);

  // Guaranteed Auto-Replay on video end
  const handleEnded = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {});
  }, []);

  // Seek on progress bar click
  const handleProgressClick = useCallback((e) => {
    e.stopPropagation();
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * (videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(pct * 100);
  }, []);

  return {
    stageRef,
    videoRef,
    progressBarRef,
    scale,
    borderRadius,
    isPlaying,
    isMuted,
    isMobile,
    currentTime,
    duration,
    progress,
    pulseAction,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
    togglePlay,
    toggleMute,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleProgressClick,
  };
}

export default useShowcaseVideo;
