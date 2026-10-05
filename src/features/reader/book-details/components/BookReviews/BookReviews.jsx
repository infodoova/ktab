import React from "react";
import { Star, ChevronLeft, PenLine, MessageSquareQuote } from "lucide-react";
import "./BookReviews.css";

/**
 * Editorial Apple Books Customer Reviews section.
 * Renders verified reader review cards, star ratings, and review management actions.
 */
export function BookReviews({
  reviews = [],
  loading = false,
  onOpenFullModal,
  onOpenReviewModal,
  isReviewed,
}) {
  return (
    <section className="apple-book-reviews" dir="rtl" aria-label="آراء وتقييمات القراء">
      {/* Header */}
      <div className="apple-book-reviews__header">
        <div className="apple-book-reviews__title-block">
          <h2 className="apple-book-reviews__heading">آراء وتقييمات القراء</h2>
          <p className="apple-book-reviews__subheading">
            تجارب حقيقية ومراجعات موثّقة من مجتمع قراء كِتَاب
          </p>
        </div>

        <div className="apple-book-reviews__header-actions">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenReviewModal?.(e);
            }}
            className="apple-book-reviews__add-btn"
            id="btn-reviews-add-review"
          >
            <PenLine size={15} strokeWidth={2.2} />
            <span>{isReviewed ? "تعديل تقييمك" : "أضف تقييمك"}</span>
          </button>

          {reviews.length >= 3 && onOpenFullModal && (
            <button
              type="button"
              onClick={onOpenFullModal}
              className="apple-book-reviews__all-btn"
              id="btn-reviews-view-all"
            >
              <span>عرض الكل</span>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="apple-book-reviews__loading">
          <span className="apple-book-reviews__spinner" />
          <span>جاري تحميل المراجعات...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="apple-book-reviews__empty-card">
          <div className="apple-book-reviews__empty-icon-wrap">
            <MessageSquareQuote size={24} strokeWidth={1.8} />
          </div>
          <div className="apple-book-reviews__empty-content">
            <h3 className="apple-book-reviews__empty-title">لا توجد مراجعات مضافة بعد</h3>
            <p className="apple-book-reviews__empty-text">
              كن أول من يشارك انطباعه وتقييمه لهذا العمل مع مجتمع القراء.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenReviewModal?.(e);
            }}
            className="apple-book-reviews__empty-cta"
            id="btn-reviews-empty-cta"
          >
            <PenLine size={15} strokeWidth={2.2} />
            <span>كتابة أول مراجعة</span>
          </button>
        </div>
      ) : (
        <div className="apple-book-reviews__grid">
          {reviews.slice(0, 3).map((review, i) => {
            const ratingVal = Number(review.rating || review.rate || 5);
            let formattedDate = "";
            if (review.createdAt) {
              try {
                formattedDate = new Date(review.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              } catch {
                formattedDate = "";
              }
            }

            const authorInitial = (review.userName || "ق").trim().charAt(0);

            return (
              <div key={review.id || i} className="apple-book-reviews__card">
                {/* Header row: user info + stars */}
                <div className="apple-book-reviews__card-header">
                  <div className="apple-book-reviews__card-user">
                    <div className="apple-book-reviews__card-avatar" aria-hidden="true">
                      {authorInitial}
                    </div>
                    <div className="apple-book-reviews__card-info">
                      <span className="apple-book-reviews__card-author">
                        {review.userName || "قارئ كِتَاب"}
                      </span>
                      {formattedDate && (
                        <span className="apple-book-reviews__card-date">{formattedDate}</span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="apple-book-reviews__card-stars" aria-label={`التقييم ${ratingVal} من 5`}>
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        size={13}
                        className={`apple-book-reviews__star ${
                          starIndex <= ratingVal ? "is-filled" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Body */}
                {review.comment && review.comment.trim() ? (
                  <p className="apple-book-reviews__card-text">
                    {review.comment.trim()}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BookReviews;
