import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Headphones } from "lucide-react";
import { useShowcaseVideo } from "../../hooks/useShowcaseVideo";
import SectionHeader from "@/components/common/SectionHeader";
import heroDeskVideo from "@/assets/videos/herodesk.mp4";
import heroMobVideo from "@/assets/videos/heromob.mp4";
import "./ShowcaseVideo.css";

/**
 * Pure presentational ShowcaseVideo component inspired by Google Antigravity & Apple.
 * Smoothly scales and expands a high-definition video as the user scrolls into view.
 * Minimalist editorial section with simple headline text and zero clutter.
 */
export default function ShowcaseVideo() {
  const {
    stageRef,
    videoRef,
    scale,
    borderRadius,
    isPlaying,
    isMuted,
    isMobile,
    togglePlay,
    toggleMute,
  } = useShowcaseVideo();

  return (
    <section className="er-showcase-section" dir="rtl">
      <div className="er-showcase-container">
        {/* ═══════════ EDITORIAL SECTION HEADER (Global Component) ═══════════ */}
        <SectionHeader
          icon={Headphones}
          eyebrow="صوت فائق الواقعية والنقاء"
          title="هكذا يجب أن يكون الاستماع"
          align="center"
        />

        {/* ═══════════ SCROLL-EXPANDING BIG VIDEO (Google Antigravity Style) ═══════════ */}
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
          >
            {/* High-Definition Autoplaying Showcase Video */}
            <video
              ref={videoRef}
              className="er-showcase-video-element"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
            >
              <source
                src={isMobile ? heroMobVideo : heroDeskVideo}
                type="video/mp4"
              />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>

            {/* Bottom Floating Glass Control Dock */}
            <div className="er-showcase-video-dock">
              <button
                type="button"
                className="er-showcase-control-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? "إيقاف مؤقت للفيديو" : "تشغيل الفيديو"}
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} />}
              </button>

              <button
                type="button"
                className="er-showcase-control-btn"
                onClick={toggleMute}
                aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
