import React from "react";
import { Headphones, Star } from "lucide-react";
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
    hasAudio,
    rating,
    totalReviews,
    pageCount,
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

        {/* Audio Badge on Cover (Top-Left) */}
        {hasAudio && (
          <div className="ktab-lib-card__audio-badge" title="يتضمن نسخة صوتية">
            <Headphones size={11} strokeWidth={2.4} />
            <span>صوتي</span>
          </div>
        )}

        {/* Specs Floating Pill on Cover (Bottom-Right) */}
        {(rating > 0 || totalReviews > 0 || pageCount) && (
          <div className="ktab-lib-card__cover-specs">
            <span className="ktab-lib-card__spec-item">
              <Star size={10} className="ktab-lib-card__star-icon" />
              <span>
                {rating > 0 ? rating.toFixed(1) : "جديد"}
                {totalReviews > 0 ? ` (${totalReviews})` : ""}
              </span>
            </span>

            {pageCount && (
              <>
                <span className="ktab-lib-card__spec-dot">•</span>
                <span className="ktab-lib-card__spec-item">{pageCount} ص</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Text Body UNDER Card: Category, Title, Author */}
      <div className="ktab-lib-card__body">
        {genre && <span className="ktab-lib-card__genre">{genre}</span>}

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
