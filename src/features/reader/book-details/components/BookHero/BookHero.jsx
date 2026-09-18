import React from "react";
import { Play, Bookmark, Share, Star, Loader2 } from "lucide-react";
import "./BookHero.css";

/**
 * Editorial Apple Books-inspired Book Hero section.
 * Renders cover artwork, title, author, rating summary, and call-to-actions.
 * On PC: A tightly composed 2-column layout matching Apple Books Preview.
 * On mobile: Compact side-by-side header with full-width unified action bar.
 */
export function BookHero({
  book,
  isAssigned,
  isAssignLoading,
  isReviewed,
  isReviewLoading = false,
  onToggleAssign,
  onOpenReviewModal,
  onStartReading,
  onShare,
}) {
  if (!book) return null;

  const {
    id,
    title,
    authorName,
    hasAudio,
    averageRating = 0,
    totalReviews = 0,
    coverImageUrl,
    mainGenreName,
    subGenreName,
  } = book;

  const numericRating = Number(averageRating) || 0;
  const reviewsCount = Number(totalReviews) || 0;

  return (
    <section className="apple-book-hero" dir="rtl">
      <div className="apple-book-hero__main">
        {/* 1. Cover Artwork Card */}
        <div className="apple-book-hero__artwork-wrap">
          <div className="apple-book-hero__artwork-card">
            <img
              src={coverImageUrl}
              alt={title}
              loading="eager"
              decoding="async"
              className="apple-book-hero__cover-img"
            />
            {hasAudio && (
              <div className="apple-book-hero__audio-badge" title="يتضمن نسخة صوتية">
                <Play size={11} fill="currentColor" />
                <span>صوتي</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Metadata, Details & Action Buttons Column */}
        <div className="apple-book-hero__content">
          <div className="apple-book-hero__text-meta">
            {/* Genre Breadcrumb */}
            {(mainGenreName || subGenreName) && (
              <div className="apple-book-hero__genre-tag">
                <span>{mainGenreName}</span>
                {subGenreName && <span className="apple-book-hero__genre-sep">•</span>}
                {subGenreName && <span>{subGenreName}</span>}
              </div>
            )}

            {/* Book Title */}
            <h1 className="apple-book-hero__title">{title}</h1>

            {/* Author */}
            <div className="apple-book-hero__author">
              <span className="apple-book-hero__author-by">تأليف:</span>
              <span className="apple-book-hero__author-name">{authorName}</span>
            </div>

            {/* Rating Summary (Stars + Rating Value + Reviews Count) */}
            <div className="apple-book-hero__rating-row">
              <div className="apple-book-hero__stars" aria-label={`التقييم ${numericRating.toFixed(1)} من 5`}>
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <Star
                    key={starIndex}
                    size={15}
                    className={`apple-book-hero__star ${
                      starIndex <= Math.round(numericRating) ? "is-filled" : ""
                    }`}
                  />
                ))}
              </div>
              <span className="apple-book-hero__rating-score">
                {numericRating > 0 ? numericRating.toFixed(1) : "جديد"}
              </span>
              <span className="apple-book-hero__rating-dot">•</span>
              <span className="apple-book-hero__rating-count">
                {reviewsCount > 0 ? `${reviewsCount} تقييم` : "بدون تقييمات"}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons: integrated beside cover on PC, full-width row on mobile */}
          <div className="apple-book-hero__actions">
            {/* Primary Read / Listen CTA */}
            <button
              type="button"
              onClick={onStartReading}
              className="apple-book-hero__btn apple-book-hero__btn--primary"
              id="btn-start-reading"
            >
              <Play size={16} fill="currentColor" />
              <span>{hasAudio ? "استمع واقرأ" : "ابدأ القراءة"}</span>
            </button>

            {/* Add to My Library / Favorite Toggle Button */}
            <button
              type="button"
              onClick={onToggleAssign}
              disabled={isAssignLoading}
              className={`apple-book-hero__btn apple-book-hero__btn--secondary ${
                isAssigned ? "is-assigned" : ""
              }`}
              title={isAssigned ? "في مكتبتي (انقر للإزالة)" : "أضف إلى مكتبتي"}
              aria-label={isAssigned ? "في مكتبتي" : "أضف إلى مكتبتي"}
              id="btn-toggle-library"
            >
              {isAssignLoading ? (
                <Loader2 size={17} className="apple-book-hero__btn-spinner" />
              ) : (
                <Bookmark
                  size={17}
                  fill={isAssigned ? "currentColor" : "none"}
                  className="apple-book-hero__btn-icon"
                />
              )}
              <span className="apple-book-hero__btn-text">
                {isAssigned ? "في مكتبتي" : "أضف للمكتبة"}
              </span>
            </button>

            {/* Review Action Button */}
            <button
              type="button"
              onClick={onOpenReviewModal}
              disabled={isReviewLoading}
              className={`apple-book-hero__btn apple-book-hero__btn--secondary ${
                isReviewed ? "is-reviewed" : ""
              }`}
              title={isReviewed ? "تعديل تقييمك" : "أضف تقييمك لهذا العمل"}
              aria-label={isReviewed ? "تعديل تقييمك" : "تقييم العمل"}
              id="btn-open-review"
            >
              {isReviewLoading ? (
                <Loader2 size={17} className="apple-book-hero__btn-spinner" />
              ) : (
                <Star
                  size={17}
                  fill={isReviewed ? "#f59e0b" : "none"}
                  color={isReviewed ? "#f59e0b" : "currentColor"}
                  className="apple-book-hero__btn-icon"
                />
              )}
              <span className="apple-book-hero__btn-text">
                {isReviewed ? "تعديل تقييمك" : "تقييم العمل"}
              </span>
            </button>


            {/* Apple Share Button (iOS Style) */}
            <button
              type="button"
              onClick={onShare}
              className="apple-book-hero__icon-btn"
              aria-label="مشاركة الكتاب"
              title="مشاركة رابط الكتاب"
              id="btn-share-book"
            >
              <Share size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Apple Books Editorial Divider Line */}
      <div className="apple-book-hero__divider" />
    </section>
  );
}

export default BookHero;
