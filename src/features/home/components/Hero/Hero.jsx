import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHero } from "../../hooks/useHero";
import HomeCoverImage from "../HomeCoverImage/HomeCoverImage";
import "./Hero.css";

/**
 * Displays top-reviewed public covers in the reader's 3D carousel.
 * Data fetching, gestures and positioning are managed by useHero.
 */
export default function Hero() {
  const {
    books,
    animatedBooks,
    isLoading,
    error,
    retry,
    refreshAfterImageError,
    nextBook,
    prevBook,
    handleSelectBook,
    handleDragEnd,
    handleStartNow,
  } = useHero();

  return (
    <section id="hero" className="er-hero-section" dir="rtl">
      <div className="er-hero-container">
        {/* ═══════════ FLUID 3D BOOK SHOWCASE CAROUSEL ═══════════ */}
        {books.length > 0 && <div className="er-carousel-stage" aria-busy={isLoading}>
          {/* Circular Navigation Arrows with Stable Anchor Wrapper */}
          <div className="er-arrow-anchor prev">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={prevBook}
              disabled={isLoading || books.length < 2}
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
              disabled={isLoading || books.length < 2}
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
                className={`er-book-card-item ${book.isCenter ? "er-center-card" : ""} ${book.isVisible ? "" : "er-card-hidden"}`}
                initial={false}
                animate={book.motionConfig}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 24,
                  mass: 0.8,
                }}
                data-index={book.index}
                onClick={handleSelectBook}
              >
                <div className="er-modern-card-container">
                  {/* Visual Hero Artwork with Natural Gradient Dissolve */}
                  <div className="er-modern-card-art-wrapper">
                    <HomeCoverImage src={book.cover} loading="eager" onImageError={refreshAfterImageError} />
                    <div className="er-book-spine-highlight" />
                  </div>

                  {/* Audio preview temporarily disabled: onClick={() => openVoiceModal(book)} */}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>}
        {error && <div className="home-covers-error" role="status">{error}<button className="home-covers-retry" type="button" onClick={retry}>إعادة المحاولة</button></div>}

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
    </section>
  );
}
