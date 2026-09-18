import React from "react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useStoryCard } from "./useStoryCard";
import "./StoryCard.css";

/**
 * Editorial Apple-style simple interactive story card.
 * Pure and uncluttered: cover artwork, category, title, and author.
 * Pressing the card triggers the story preview modal.
 */
export function StoryCard({ story, onClick }) {
  const {
    coverUrl,
    title,
    genre,
    authorName,
    sceneCount,
    coverLoaded,
    hasError,
    handleCoverLoad,
    handleCoverError,
    handleClick,
    handleKeyDown,
  } = useStoryCard({ story, onClick });

  return (
    <article
      className="ktab-story-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`عرض تفاصيل قصة ${title}`}
    >
      {/* Clean 3:4 Artwork */}
      <div className="ktab-story-card__cover-wrap">
        {!coverUrl || hasError ? (
          <div className="ktab-story-card__fallback-cover" role="img" aria-label={title}>
            <img src={brandIconImg} alt="" className="ktab-story-card__fallback-logo" aria-hidden="true" />
          </div>
        ) : (
          <div className="ktab-story-card__img-container">
            {!coverLoaded && <div className="ktab-story-card__shimmer" />}
            <img
              src={coverUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              onLoad={handleCoverLoad}
              onError={handleCoverError}
              className={`ktab-story-card__img ${
                coverLoaded ? "ktab-story-card__img--loaded" : "ktab-story-card__img--loading"
              }`}
            />
          </div>
        )}
      </div>

      {/* Metadata Under Card */}
      <div className="ktab-story-card__body">
        <div className="ktab-story-card__meta-top">
          {genre && <span className="ktab-story-card__genre">{genre}</span>}
          {sceneCount ? (
            <span className="ktab-story-card__scenes-count">• {sceneCount} مشهد</span>
          ) : null}
        </div>

        <h3 className="ktab-story-card__title" title={title}>
          {title}
        </h3>

        {authorName && (
          <p className="ktab-story-card__author" title={`تأليف: ${authorName}`}>
            {authorName}
          </p>
        )}
      </div>
    </article>
  );
}

export default StoryCard;
