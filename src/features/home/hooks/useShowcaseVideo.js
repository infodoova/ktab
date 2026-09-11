import { useState, useRef, useEffect, useCallback } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * Custom hook containing all scroll animation metrics, video playback state,
 * and event handlers for the scroll-driven ShowcaseVideo component.
 * Follows zero-logic-in-JSX engineering standard.
 */
export function useShowcaseVideo() {
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
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
  // Targeted directly to the video stage so timing is locked to the screen center:
  // 0.0 - 0.18: enters compact from bottom
  // 0.18 - 0.48: smoothly grows to full cinematic width as it reaches viewport center
  // 0.48 - 0.64: holds at peak full size (1.0) while in prime viewing zone
  // 0.64 - 0.94: smoothly shrinks back down as it scrolls towards the top
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  // Video scales up from compact to big in viewport center, then shrinks back down
  const scale = useTransform(
    scrollYProgress,
    [0.18, 0.48, 0.64, 0.92],
    [0.72, 1, 1, 0.72]
  );

  // Border radius sharpens when big, and rounds when compact
  const borderRadius = useTransform(
    scrollYProgress,
    [0.18, 0.48, 0.64, 0.92],
    [32, 16, 16, 32]
  );

  // Cinema Mode: when video reaches peak big size on desktop, hide the navbar so the user
  // gets an immersive Google Antigravity experience; return the navbar when scrolling away.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) {
      if (document.body.classList.contains("ktab-cinema-active")) {
        document.body.classList.remove("ktab-cinema-active");
      }
      return;
    }

    // Peak big size zone
    const isPeakBig = latest >= 0.38 && latest <= 0.68;
    if (isPeakBig) {
      document.body.classList.add("ktab-cinema-active");
    } else {
      document.body.classList.remove("ktab-cinema-active");
    }
  });

  // Ensure body class is cleaned up if component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove("ktab-cinema-active");
    };
  }, []);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Mute / Unmute toggle
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  return {
    stageRef,
    videoRef,
    scale,
    borderRadius,
    isPlaying,
    isMuted,
    isMobile,
    togglePlay,
    toggleMute,
  };
}

export default useShowcaseVideo;
