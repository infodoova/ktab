import React from "react";
import { Star, X } from "lucide-react";
import "./FullUserRatesModal.css";

/**
 * Editorial Apple Books-style full customer reviews dialog.
 * On mobile, presents as a full-height bottom sheet with grab handle.
 */
export function FullUserRatesModal({ isOpen, onClose, reviews = [], loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="apple-full-rates-backdrop" onClick={onClose}>
      <div
        className="apple-full-rates-dialog"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="جميع آراء وتقييمات القراء"
      >
        {/* Mobile Drag Handle */}
        <div className="apple-full-rates-dialog__handle-wrap">
          <div className="apple-full-rates-dialog__handle" />
        </div>

        {/* Header */}
        <div className="apple-full-rates-dialog__header">
          <div>
            <h3 className="apple-full-rates-dialog__title">جميع آراء وتقييمات القراء</h3>
            <p className="apple-full-rates-dialog__subtitle">
              تجارب ومراجعات موثّقة ({reviews.length} تقييم)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="apple-full-rates-dialog__close-btn"
            aria-label="إغلاق"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Content List */}
        <div className="apple-full-rates-dialog__body">
          {loading ? (
            <div className="apple-full-rates-dialog__loading">
              <span className="apple-full-rates-dialog__spinner" />
              <span>جاري تحميل الآراء...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="apple-full-rates-dialog__empty">
              <p>لا توجد مراجعات مسجلة حتى الآن.</p>
            </div>
          ) : (
            reviews.map((review, index) => {
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

              return (
                <div key={review.id || index} className="apple-full-rates-card">
                  <div className="apple-full-rates-card__top">
                    <div className="apple-full-rates-card__user">
                      <div className="apple-full-rates-card__avatar">
                        {review.userName?.[0] || "ق"}
                      </div>
                      <div className="apple-full-rates-card__user-info">
                        <span className="apple-full-rates-card__name">
                          {review.userName || "قارئ كِتَاب"}
                        </span>
                        {formattedDate && (
                          <span className="apple-full-rates-card__date">{formattedDate}</span>
                        )}
                      </div>
                    </div>

                    <div className="apple-full-rates-card__stars">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <Star
                          key={starIndex}
                          size={13}
                          className={`apple-full-rates-card__star ${
                            starIndex <= ratingVal ? "is-filled" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && review.comment.trim() ? (
                    <p className="apple-full-rates-card__comment">
                      {review.comment.trim()}
                    </p>
                  ) : null}
                </div>

              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default FullUserRatesModal;
