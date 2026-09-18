import React from "react";
import { Headphones, Star } from "lucide-react";
import { useSimilarBooks } from "./useSimilarBooks";
import "./SimilarBooks.css";

/**
 * Editorial Apple Books-inspired Similar Books recommendation section.
 * Renders minimal important details: cover, audio badge, genre, title, author, rating, and page count.
 * Pure declarative JSX using useSimilarBooks for click handling.
 */
export function SimilarBooks({ books = [], loading = false }) {
  const { handleBookClick } = useSimilarBooks();

  if (loading) {
    return (
      <section className="apple-similar-books" dir="rtl">
        <h2 className="apple-similar-books__heading">أعمال قد تنال إعجابك</h2>
        <div className="apple-similar-books__loading">
          <span className="apple-similar-books__spinner" />
          <span>جاري تحميل الترشيحات...</span>
        </div>
      </section>
    );
  }

  if (!books || books.length === 0) return null;

  return (
    <section className="apple-similar-books" dir="rtl" aria-label="أعمال مشابهة">
      <div className="apple-similar-books__header">
        <h2 className="apple-similar-books__heading">أعمال قد تنال إعجابك</h2>
        <p className="apple-similar-books__subheading">
          ترشيحات مختارة بعناية تتوافق مع اهتماماتك
        </p>
      </div>

      <div className="apple-similar-books__grid">
        {books.map((simBook) => {
          const cover = simBook.coverImageUrl || simBook.cover || "";
          const genre = simBook.mainGenreName || simBook.genre || null;
          const author = simBook.customAuthorName || simBook.authorName || "";
          const hasAudio = Boolean(simBook.hasAudio);
          const rating = Number(simBook.averageRating) || 0;
          const totalReviews = Number(simBook.totalReviews) || 0;
          const pageCount = simBook.pageCount;

          return (
            <div
              key={simBook.id}
              data-book-id={simBook.id}
              onClick={handleBookClick}
              className="apple-similar-card"
              role="button"
              tabIndex={0}
            >
              {/* Cover Artwork with Floating Specs & Audio Badge UP */}
              <div className="apple-similar-card__artwork">
                <img
                  src={cover}
                  alt={simBook.title}
                  loading="lazy"
                  decoding="async"
                  className="apple-similar-card__img"
                />

                {/* Audio Badge (Top-Left) */}
                {hasAudio && (
                  <div className="apple-similar-card__audio-badge" title="يتضمن نسخة صوتية">
                    <Headphones size={11} strokeWidth={2.4} />
                    <span>صوتي</span>
                  </div>
                )}

                {/* Specs Floating Pill (Bottom of Cover) */}
                {(rating > 0 || totalReviews > 0 || pageCount) && (
                  <div className="apple-similar-card__cover-specs">
                    <span className="apple-similar-card__spec-item">
                      <Star size={10} className="apple-similar-card__star-icon" />
                      <span>
                        {rating > 0 ? rating.toFixed(1) : "جديد"}
                        {totalReviews > 0 ? ` (${totalReviews})` : ""}
                      </span>
                    </span>

                    {pageCount && (
                      <>
                        <span className="apple-similar-card__spec-dot">•</span>
                        <span className="apple-similar-card__spec-item">{pageCount} ص</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Text Body UNDER Card: Category, Title, Author */}
              <div className="apple-similar-card__meta">
                {genre && <span className="apple-similar-card__genre">{genre}</span>}

                <h3 className="apple-similar-card__title" title={simBook.title}>
                  {simBook.title}
                </h3>

                {author && <span className="apple-similar-card__author">{author}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SimilarBooks;
