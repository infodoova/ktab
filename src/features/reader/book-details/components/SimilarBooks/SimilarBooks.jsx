import React from "react";
import { Headphones, BookOpen, FileText, Star } from "lucide-react";
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
          const genre =
            simBook.mainGenreName && simBook.subGenreName && simBook.mainGenreName.trim() !== simBook.subGenreName.trim()
              ? `${simBook.mainGenreName.trim()} / ${simBook.subGenreName.trim()}`
              : (simBook.mainGenreName && simBook.mainGenreName.trim()) ||
                (simBook.subGenreName && simBook.subGenreName.trim()) ||
                (simBook.genre && simBook.genre.trim()) ||
                null;
          const author =
            (simBook.customAuthorName && simBook.customAuthorName.trim()) ||
            (simBook.authorName && simBook.authorName.trim()) ||
            (simBook.author && simBook.author.trim()) ||
            "مؤلف غير محدد";
          const hasAudio = Boolean(simBook.hasAudio);
          const rating = Number(simBook.averageRating) || 0;
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
              {/* Cover Artwork (Strict 3:4 Proportions) */}
              <div className="apple-similar-card__artwork">
                <img
                  src={cover}
                  alt={simBook.title}
                  loading="lazy"
                  decoding="async"
                  className="apple-similar-card__img"
                />

                {/* Floating Cover Footer */}
                <div className="apple-similar-card__cover-footer">
                  {pageCount ? (
                    <div className="apple-similar-card__footer-pill" title={`${pageCount} صفحة`}>
                      <FileText size={11} />
                      <span>{pageCount} صفحة</span>
                    </div>
                  ) : rating > 0 ? (
                    <div className="apple-similar-card__footer-pill" title={`التقييم: ${rating.toFixed(1)}`}>
                      <Star size={11} className="apple-similar-card__star-icon" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  ) : null}

                  <div
                    className={`apple-similar-card__footer-pill ${
                      hasAudio
                        ? "apple-similar-card__footer-pill--audio-active"
                        : "apple-similar-card__footer-pill--audio-inactive"
                    }`}
                    title={hasAudio ? "يتوفر نسخة صوتية" : "نسخة نصية فقط"}
                  >
                    {hasAudio ? <Headphones size={11} /> : <BookOpen size={11} />}
                    <span>{hasAudio ? "صوتي" : "نصي"}</span>
                  </div>
                </div>
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
