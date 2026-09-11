import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Headphones } from "lucide-react";
import { useShowcaseVideo } from "../../hooks/useShowcaseVideo";
import SectionHeader from "@/components/common/SectionHeader";
import heroDeskVideo from "@/assets/videos/herodesk.mp4";
import heroMobVideo from "@/assets/videos/heromob.mp4";
import "./ShowcaseVideo.css";

/**
 * Pure presentational ShowcaseVideo component inspired by Google Antigravity & Apple.
 * Features:
 * - Click anywhere on video to toggle play/pause with fluid center feedback ripple.
 * - Real-time frosted glass timestamp badge (current time / total duration).
 * - Automatic seamless replay on end.
 * - Seekable slim progress bar along the bottom.
 * - Minimalist editorial design with zero clutter.
 */
export default function ShowcaseVideo() {
  const {
    stageRef,
    videoRef,
    progressBarRef,
    scale,
    borderRadius,
    isPlaying,
    isMuted,
    isMobile,
    progress,
    pulseAction,
    formattedCurrentTime,
    formattedDuration,
    togglePlay,
    toggleMute,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleProgressClick,
  } = useShowcaseVideo();

  return (
    <section className="er-showcase-section" dir="rtl">
      <div className="er-showcase-container">
        {/* ═══════════ EDITORIAL SECTION HEADER ═══════════ */}
        <SectionHeader
          icon={Headphones}
          eyebrow="صوت فائق الواقعية والنقاء"
          title="هكذا يجب أن يكون الاستماع"
          align="center"
        />

        {/* ═══════════ SCROLL-EXPANDING BIG VIDEO ═══════════ */}
        <div ref={stageRef} className="er-showcase-video-stage">
          <motion.div
            style={
              isMobile
                ? undefined
                : {
                    scale,
                    borderRadius,
                  }
            }
            className="er-showcase-video-card"
            onClick={togglePlay}
            role="button"
            tabIndex={0}
            aria-label={isPlaying ? "إيقاف مؤقت للفيديو" : "تشغيل الفيديو"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                togglePlay();
              }
            }}
          >
            {/* High-Definition Autoplaying Showcase Video with Auto-Replay */}
            <video
              ref={videoRef}
              className="er-showcase-video-element"
              src={isMobile ? heroMobVideo : heroDeskVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleLoadedMetadata}
              onCanPlay={handleLoadedMetadata}
              onEnded={handleEnded}
            >
              متصفحك لا يدعم تشغيل الفيديو.
            </video>

            {/* Center Transient Play/Pause Feedback Ripple */}
            <AnimatePresence>
              {pulseAction && (
                <motion.div
                  key={pulseAction}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="er-showcase-center-feedback"
                  aria-hidden="true"
                >
                  {pulseAction === "play" ? (
                    <Play size={28} fill="currentColor" />
                  ) : (
                    <Pause size={28} fill="currentColor" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Floating Glass Control Dock */}
            <div
              className="er-showcase-video-dock"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Play / Pause Button */}
              <button
                type="button"
                className="er-showcase-control-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? "إيقاف مؤقت للفيديو" : "تشغيل الفيديو"}
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              </button>

              {/* Mute / Unmute Button */}
              <button
                type="button"
                className="er-showcase-control-btn"
                onClick={toggleMute}
                aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>

              {/* Frosted Glass Time Stamp Badge */}
              <div className="er-showcase-timestamp-badge" dir="ltr">
                <span className="er-showcase-time-current">{formattedCurrentTime}</span>
                <span className="er-showcase-time-sep">/</span>
                <span className="er-showcase-time-total">{formattedDuration}</span>
              </div>
            </div>

            {/* Slim Interactive Progress Track Along Card Bottom */}
            <div
              ref={progressBarRef}
              className="er-showcase-progress-wrap"
              onClick={handleProgressClick}
              title="تقديم / ترجيع الفيديو"
            >
              <div
                className="er-showcase-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
