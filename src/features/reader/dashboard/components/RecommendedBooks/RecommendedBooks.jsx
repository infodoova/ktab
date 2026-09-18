import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Headphones, Star } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useRecommendedBooks } from "./useRecommendedBooks";
import "./RecommendedBooks.css";

/**
 * Individual Recommended Book Card with independent cover loading & fallback state.
 * Renders minimal important details: cover, audio badge, genre, title, author, rating, and page count.
 */
function RecommendedBookCard({ book, onSelect }) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  const coverSrc = book?.coverImageUrl || book?.cover || "";
  const bookTitle = book?.title || "بدون عنوان";
  const authorName =
    book?.customAuthorName ||
    book?.authorName ||
    book?.author ||
    "مؤلف غير محدد";
  const genre = book?.mainGenreName || book?.genre || null;
  const hasAudio = Boolean(book?.hasAudio);
  const rating = Number(book?.averageRating) || 0;
  const totalReviews = Number(book?.totalReviews) || 0;
  const pageCount = book?.pageCount || null;

  return (
    <article
      className="ktab-book-shelf-card"
      onClick={() => onSelect(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(book)}
      aria-label={`عرض تفاصيل كتاب ${bookTitle}`}
    >
      <div className="ktab-book-shelf-card__cover-wrap">
        {!coverSrc || hasCoverError ? (
          <div
            className="ktab-book-shelf-card__fallback-cover"
            role="img"
            aria-label={bookTitle}
          >
            <img
              src={brandIconImg}
              alt=""
              className="ktab-book-shelf-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-book-shelf-card__image-container">
            {!coverLoaded && <div className="ktab-book-shelf-card__cover-shimmer" />}
            <img
              src={coverSrc}
              alt={bookTitle}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setHasCoverError(true)}
              className={`ktab-book-shelf-card__img ${
                coverLoaded
                  ? "ktab-book-shelf-card__img--loaded"
                  : "ktab-book-shelf-card__img--loading"
              }`}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {/* Audio Badge on Cover (Top-Left) */}
        {hasAudio && (
          <div className="ktab-book-shelf-card__audio-badge" title="يتضمن نسخة صوتية">
            <Headphones size={11} strokeWidth={2.4} />
            <span>صوتي</span>
          </div>
        )}

        {/* Specs Floating Pill on Cover (Bottom-Right) */}
        {(rating > 0 || totalReviews > 0 || pageCount) && (
          <div className="ktab-book-shelf-card__cover-specs">
            <span className="ktab-book-shelf-card__spec-item">
              <Star size={10} className="ktab-book-shelf-card__star-icon" />
              <span>
                {rating > 0 ? rating.toFixed(1) : "جديد"}
                {totalReviews > 0 ? ` (${totalReviews})` : ""}
              </span>
            </span>

            {pageCount && (
              <>
                <span className="ktab-book-shelf-card__spec-dot">•</span>
                <span className="ktab-book-shelf-card__spec-item">{pageCount} ص</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Text Body UNDER Card: Category, Title, Author */}
      <div className="ktab-book-shelf-card__body">
        {genre && <span className="ktab-book-shelf-card__genre">{genre}</span>}

        <h3 className="ktab-book-shelf-card__title" title={bookTitle}>
          {bookTitle}
        </h3>

        <p className="ktab-book-shelf-card__author" title={authorName}>
          {authorName}
        </p>
      </div>
    </article>
  );
}

/**
 * Editorial horizontal book shelf for Recommended Books.
 * Clean Apple-style layout with navigation arrows, 3:4 book proportions, and fluid scroll snap.
 */
export function RecommendedBooks({ books = [], loading = false }) {
  const {
    trackRef,
    handleScrollNext,
    handleScrollPrev,
    handleSelectBook,
  } = useRecommendedBooks({ books });

  if (!loading && (!books || books.length === 0)) {
    return null;
  }

  return (
    <section className="ktab-recommended-shelf" dir="rtl" aria-label="موصى به لك">
      <div className="ktab-recommended-shelf__header">
        <div className="ktab-recommended-shelf__title-wrap">
          <h2 className="ktab-recommended-shelf__heading">موصى به لك</h2>
        </div>

        {books.length > 3 && (
          <div className="ktab-recommended-shelf__controls" aria-label="أزرار التمرير">
            {/* In RTL: Right arrow scrolls backward, Left arrow scrolls forward */}
            <button
              type="button"
              onClick={handleScrollPrev}
              className="ktab-recommended-shelf__arrow-btn"
              aria-label="السابق"
              title="السابق"
            >
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={handleScrollNext}
              className="ktab-recommended-shelf__arrow-btn"
              aria-label="التالي"
              title="التالي"
            >
              <ChevronLeft size={16} strokeWidth={2.4} />
            </button>
          </div>
        )}
      </div>

      <div ref={trackRef} className="ktab-recommended-shelf__track">
        {books.map((book) => (
          <RecommendedBookCard
            key={book.id || book.bookId}
            book={book}
            onSelect={handleSelectBook}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendedBooks;
