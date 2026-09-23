import React from "react";
import { Headphones, BookOpen, Star } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useLibraryBookCard } from "./useLibraryBookCard";
import "./LibraryBookCard.css";

/**
 * Editorial Apple Books-inspired card for Reader catalog books.
 * Displays minimal essential details: cover, audio badge, genre, title, author, rating, and page count.
 */
export const LibraryBookCard = React.memo(function LibraryBookCard({ book, onClick, index = 0 }) {
  const {
    coverUrl,
    bookTitle,
    authorName,
    genre,
    isDraft,
    hasAudio,
    rating,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    handleClick,
    handleKeyDown,
  } = useLibraryBookCard({ book, onClick });

  // Books above the fold (first 4 items) load eagerly with high network priority
  const isAboveFold = index < 4;

  return (
    <article
      onClick={handleClick}
      className="ktab-lib-card"
      dir="rtl"
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`عرض تفاصيل كتاب ${bookTitle}`}
    >
      <div className="ktab-lib-card__cover-wrap">
        {!coverUrl || hasCoverError ? (
          <div
            className="ktab-lib-card__fallback-cover"
            role="img"
            aria-label={bookTitle}
          >
            <img
              src={brandIconImg}
              alt=""
              className="ktab-lib-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-lib-card__image-container">
            {!coverLoaded && <div className="ktab-lib-card__cover-shimmer" />}
            <img
              src={coverUrl}
              alt={`غلاف ${bookTitle}`}
              onLoad={handleCoverLoad}
              onError={handleCoverError}
              className={`ktab-lib-card__img ${
                coverLoaded
                  ? "ktab-lib-card__img--loaded"
                  : "ktab-lib-card__img--loading"
              }`}
              loading={isAboveFold ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={isAboveFold ? "high" : "low"}
            />
          </div>
        )}

        {/* Top-Right: Draft Badge */}
        {isDraft && (
          <div className="ktab-lib-card__top-badges">
            <span className="ktab-lib-card__draft-badge">مسودة</span>
          </div>
        )}

        {/* Floating Cover Footer */}
        <div className="ktab-lib-card__cover-footer">
          <div className="ktab-lib-card__footer-pill" title={`التقييم: ${rating.toFixed(1)}`}>
            <Star size={11} className="ktab-lib-card__star-icon" />
            <span>{rating.toFixed(1)}</span>
          </div>

          <div
            className={`ktab-lib-card__footer-pill ${
              hasAudio
                ? "ktab-lib-card__footer-pill--audio-active"
                : "ktab-lib-card__footer-pill--audio-inactive"
            }`}
            title={hasAudio ? "يتوفر نسخة صوتية" : "نسخة نصية فقط"}
          >
            {hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
            <span>{hasAudio ? "صوتي" : "نصي"}</span>
          </div>
        </div>
      </div>

      {/* Text Body UNDER Card: Category, Title, Author */}
      <div className="ktab-lib-card__body">
        {genre && (
          <span className="ktab-lib-card__genre" title={genre}>
            {genre}
          </span>
        )}

        <h3 className="ktab-lib-card__title" title={bookTitle}>
          {bookTitle}
        </h3>

        <p className="ktab-lib-card__author" title={authorName}>
          {authorName}
        </p>
      </div>
    </article>
  );
});

export default LibraryBookCard;
