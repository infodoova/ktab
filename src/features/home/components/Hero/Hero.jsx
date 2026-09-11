import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Volume2 } from "lucide-react";
import { useHero } from "../../hooks/useHero";
import EarlyAccess from "../EarlyAccess";
import VoiceSampleModal from "../VoiceSampleModal";
import "./Hero.css";

/**
 * Pure presentational Hero component styled after Eleven Reader & Apple.
 * Features fluid 3D physical book carousel animation, 3D first-page flip card,
 * and the animated Voice Sample Player Modal.
 * Zero business logic inside JSX; state and 3D positioning metrics are in useHero.
 */
export default function Hero() {
  const [revealedCardId, setRevealedCardId] = useState(null);

  const {
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
    isVoiceModalOpen,
    openVoiceModal,
    closeVoiceModal,
    isSamplePlaying,
    sampleTimeFormatted,
    sampleDurationFormatted,
    sampleProgress,
    toggleSamplePlay,
    skipSampleTime,
    seekSample,
    playbackRate,
    setPlaybackRate,
    isEarlyAccessOpen,
    closeEarlyAccess,
    handleStartNow,
  } = useHero();

  return (
    <section id="hero" className="er-hero-section" dir="rtl">
      <div className="er-hero-container">
        {/* ═══════════ FLUID 3D BOOK SHOWCASE CAROUSEL ═══════════ */}
        <div className="er-carousel-stage">
          {/* Circular Navigation Arrows with Stable Anchor Wrapper */}
          <div className="er-arrow-anchor prev">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={prevBook}
              className="er-carousel-arrow"
              type="button"
              aria-label="الكتاب السابق"
            >
              <ChevronRight size={22} />
            </motion.button>
          </div>

          <div className="er-arrow-anchor next">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={nextBook}
              className="er-carousel-arrow"
              type="button"
              aria-label="الكتاب التالي"
            >
              <ChevronLeft size={22} />
            </motion.button>
          </div>

          {/* 3D Physical Animated Book Deck with Drag / Swipe */}
          <motion.div
            className="er-book-deck"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {animatedBooks.map((book) => (
              <motion.div
                key={book.id}
                className={`er-book-card-item ${book.isCenter ? "er-center-card" : ""} ${
                  revealedCardId === book.id ? "revealed" : ""
                }`}
                initial={false}
                animate={book.motionConfig}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 24,
                  mass: 0.8,
                }}
                onMouseEnter={() => {
                  if (book.isCenter) setRevealedCardId(book.id);
                }}
                onMouseLeave={() => {
                  setRevealedCardId(null);
                }}
                onClick={() => {
                  if (!book.isCenter) {
                    setRevealedCardId(null);
                    selectBook(book.index);
                  }
                }}
                style={{
                  pointerEvents: book.isVisible ? "auto" : "none",
                }}
              >
                <div className="er-modern-card-container">
                  {/* Visual Hero Artwork with Natural Gradient Dissolve */}
                  <div className="er-modern-card-art-wrapper">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="er-modern-card-art-img"
                    />
                    <div className="er-book-spine-highlight" />
                  </div>

                  {/* Seamless Elegant Glassmorphism Lower Surface */}
                  <div className="er-modern-card-glass-dock">
                    <div className="er-modern-card-meta">
                      <h3 className="er-modern-card-title">{book.title}</h3>
                      <p className="er-modern-card-author">{book.author}</p>
                    </div>

                    <button
                      type="button"
                      className="er-modern-card-play-btn"
                      dir="rtl"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVoiceModal();
                      }}
                      aria-label={`تشغيل عينة ${book.title}`}
                    >
                      <Play className="er-modern-card-play-icon" size={11} fill="currentColor" />
                      <span className="er-modern-card-play-text">تشغيل العينة</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ═══════════ EDITORIAL HEADLINE & SUBTITLE ═══════════ */}
        <h1 className="er-hero-title">
          استمع واقرأ في أي مكان بأصوات تحبها
        </h1>

        <p className="er-hero-subtitle">
          اقرأ بصوت عالٍ أحدث الكتب، الروايات، والمقالات المترجمة بأصوات ذكية فائقة الواقعية.
          أكثر من 10,000 كتاب وملخص في متناول يدك.
        </p>

        {/* ═══════════ START NOW BUTTON ═══════════ */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStartNow}
          className="er-hero-btn-primary"
          type="button"
        >
          ابدأ الآن
        </motion.button>
      </div>

      {/* Voice Sample Player Modal (Eleven Reader & Apple Quality) */}
      <VoiceSampleModal
        isOpen={isVoiceModalOpen}
        onClose={closeVoiceModal}
        book={currentBook}
        isPlaying={isSamplePlaying}
        currentTime={sampleTimeFormatted}
        duration={sampleDurationFormatted}
        progress={sampleProgress}
        onTogglePlay={toggleSamplePlay}
        onSkip={skipSampleTime}
        onSeek={seekSample}
        onStartNow={handleStartNow}
      />

      {/* Early Access Modal */}
      <EarlyAccess
        isOpen={isEarlyAccessOpen}
        onClose={closeEarlyAccess}
      />
    </section>
  );
}
