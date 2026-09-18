import React from "react";
import { ArrowLeft } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useContinueReading } from "./useContinueReading";
import "./ContinueReading.css";

/**
 * Editorial "متابعة القراءة" showcase component.
 * Displays active books in progress with depth cover, fluid progress bar, and instant resume action.
 */
export function ContinueReading({ books = [] }) {
  const {
    books: formattedBooks,
    handleResumeReading,
    handleOpenDetails,
  } = useContinueReading({ books });

  if (!formattedBooks || formattedBooks.length === 0) {
    return null;
  }

  return (
    <section className="ktab-continue-reading" dir="rtl" aria-label="متابعة القراءة">
      <div className="ktab-continue-reading__header">
        <h2 className="ktab-continue-reading__heading">متابعة القراءة</h2>
      </div>

      <div className="ktab-continue-reading__list">
        {formattedBooks.map((book) => {
          const coverSrc = book.cover || book.coverImageUrl;
          const bookTitle = book.title || "بدون عنوان";
          const authorName = book.author || book.authorName || "مؤلف غير محدد";

          return (
            <article key={book.id || book.bookId} className="ktab-continue-card">
              <div
                className="ktab-continue-card__main"
                onClick={() => handleOpenDetails(book)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleOpenDetails(book)}
                style={{ cursor: "pointer" }}
              >
                <div className="ktab-continue-card__cover-wrap">
                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt={bookTitle}
                      className="ktab-continue-card__cover-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.parentElement.querySelector(".ktab-continue-card__cover-fallback");
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="ktab-continue-card__cover-fallback"
                    aria-hidden="true"
                    style={{ display: coverSrc ? "none" : "flex" }}
                  >
                    <img
                      src={brandIconImg}
                      alt=""
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        objectFit: "contain",
                        opacity: 0.6,
                        filter: "grayscale(100%)",
                      }}
                    />
                  </div>
                </div>

                <div className="ktab-continue-card__info">
                  <h3 className="ktab-continue-card__title" title={bookTitle}>
                    {bookTitle}
                  </h3>
                  <p className="ktab-continue-card__author" title={authorName}>
                    {authorName}
                  </p>

                  <div className="ktab-continue-card__progress-wrap">
                    <div className="ktab-continue-card__track">
                      <div
                        className="ktab-continue-card__fill"
                        style={{ width: `${book.percent}%` }}
                      />
                    </div>

                    <div className="ktab-continue-card__stats">
                      <span className="ktab-continue-card__pages">
                        {book.currentProgress} / {book.totalCount || 0} صفحة
                      </span>
                      <span className="ktab-continue-card__percentage">
                        {book.percent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleResumeReading(book)}
                className="ktab-continue-card__action-btn"
                title={`متابعة قراءة ${bookTitle}`}
              >
                <span>متابعة القراءة</span>
                <ArrowLeft size={16} strokeWidth={2.4} className="ktab-continue-card__action-icon" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ContinueReading;
