import React from "react";
import { ChevronRight, ChevronLeft, Sparkles, Play } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useStoriesHero } from "./useStoriesHero";
import "./StoriesHero.css";

/**
 * Pure declarative presentation component for the featured interactive stories hero.
 */
export function StoriesHero({ stories = [], onStoryClick, onStartStory }) {
  const {
    total,
    currentIndex,
    coverUrl,
    genre,
    title,
    description,
    nextSlide,
    prevSlide,
    goToSlide,
    handleMouseEnter,
    handleMouseLeave,
    handleStartAdventure,
    handleDetailsClick,
    handleArtworkKeyDown,
  } = useStoriesHero({ stories, onStoryClick, onStartStory });

  if (total === 0) return null;

  return (
    <section
      className="ktab-stories-hero"
      dir="rtl"
      aria-label="القصص التفاعلية المميزة"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="ktab-stories-hero__container">
        {/* Story Info (Right in RTL) */}
        <div className="ktab-stories-hero__content">
          <div className="ktab-stories-hero__badge">
            <Sparkles size={13} className="ktab-stories-hero__badge-icon" />
            <span>{genre}</span>
          </div>

          <h1 className="ktab-stories-hero__title" title={title}>
            {title}
          </h1>

          <p className="ktab-stories-hero__desc">{description}</p>

          <div className="ktab-stories-hero__actions">
            <button
              type="button"
              onClick={handleStartAdventure}
              className="ktab-stories-hero__btn-primary"
            >
              <Play size={16} fill="currentColor" />
              <span>ابدأ المغامرة الآن</span>
            </button>

            <button
              type="button"
              onClick={handleDetailsClick}
              className="ktab-stories-hero__btn-secondary"
            >
              <span>تفاصيل المسار</span>
            </button>
          </div>

          {/* Navigation Controls */}
          {total > 1 && (
            <div className="ktab-stories-hero__nav">
              <div className="ktab-stories-hero__dots" role="tablist">
                {stories.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`ktab-stories-hero__dot ${
                      idx === currentIndex ? "ktab-stories-hero__dot--active" : ""
                    }`}
                    aria-label={`انتقال إلى القصة ${idx + 1}`}
                    role="tab"
                    aria-selected={idx === currentIndex}
                  />
                ))}
              </div>

              <div className="ktab-stories-hero__arrows">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="ktab-stories-hero__arrow"
                  aria-label="القصة السابقة"
                  title="السابق"
                >
                  <ChevronRight size={16} strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="ktab-stories-hero__arrow"
                  aria-label="القصة التالية"
                  title="التالي"
                >
                  <ChevronLeft size={16} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3D Artwork Showcase (Left in RTL) */}
        <div
          className="ktab-stories-hero__artwork-wrap"
          onClick={handleDetailsClick}
          role="button"
          tabIndex={0}
          onKeyDown={handleArtworkKeyDown}
          title="عرض تفاصيل القصة"
        >
          <div className="ktab-stories-hero__artwork">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                key={coverUrl}
                loading="eager"
                decoding="async"
                className="ktab-stories-hero__img"
              />
            ) : (
              <div className="ktab-stories-hero__artwork-fallback">
                <img src={brandIconImg} alt="" className="ktab-stories-hero__fallback-logo" />
              </div>
            )}
            <div className="ktab-stories-hero__artwork-gloss" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoriesHero;
