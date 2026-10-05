import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Trash2 } from "lucide-react";
import { useBookReviewModal } from "./useBookReviewModal";
import "./BookReviewModal.css";

const STARS = [1, 2, 3, 4, 5];

/**
 * Editorial Apple-style Review & Rating Modal dialog.
 * Pure declarative JSX using useBookReviewModal hook for state, animations, and events.
 */
export function BookReviewModal({
  isOpen,
  onClose,
  isReviewed,
  userRating,
  setUserRating,
  userReview,
  setUserReview,
  onSubmitReview,
  onDeleteReview,
}) {
  const {
    sheetVariants,
    handleStarClick,
    handleReviewChange,
    handleDialogClick,
  } = useBookReviewModal({
    isOpen,
    setUserRating,
    setUserReview,
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="apple-review-backdrop"
          className="apple-review-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            key="apple-review-dialog"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="apple-review-dialog"
            onClick={handleDialogClick}
            role="dialog"
            aria-modal="true"
            aria-label="تقييم العمل ومراجعته"
            dir="rtl"
          >
            {/* Mobile Sheet Drag Indicator Handle */}
            <div className="apple-review-dialog__handle-wrap">
              <div className="apple-review-dialog__handle" />
            </div>

            {/* Header */}
            <div className="apple-review-dialog__header">
              <h3 className="apple-review-dialog__title">
                {isReviewed ? "تعديل تقييمك" : "تقييم هذا العمل"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="apple-review-dialog__close-btn"
                aria-label="إغلاق"
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </div>

            {/* Body */}
            <div className="apple-review-dialog__body">
              {/* Star Rating Picker */}
              <div className="apple-review-dialog__stars-group">
                <span className="apple-review-dialog__stars-hint">اختر تقييمك بالنجوم</span>
                <div className="apple-review-dialog__stars-row">
                  {STARS.map((starIndex) => (
                    <button
                      key={starIndex}
                      type="button"
                      data-star={starIndex}
                      onClick={handleStarClick}
                      className="apple-review-dialog__star-btn"
                      aria-label={`${starIndex} من 5 نجوم`}
                    >
                      <Star
                        size={32}
                        className={`apple-review-dialog__star-icon ${
                          starIndex <= userRating ? "is-active" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Textarea */}
              <div className="apple-review-dialog__input-group">
                <label className="apple-review-dialog__input-label">رأيك الشخصي (اختياري)</label>
                <textarea
                  value={userReview}
                  onChange={handleReviewChange}
                  placeholder="شارك انطباعك، أسلوب الكاتب، أو ما لفت انتباهك في هذا العمل..."
                  rows={4}
                  className="apple-review-dialog__textarea"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="apple-review-dialog__footer">
              {isReviewed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteReview?.(e);
                  }}
                  className="apple-review-dialog__btn-delete"
                >
                  <Trash2 size={15} strokeWidth={2} />
                  <span>حذف التقييم</span>
                </button>
              )}

              <div className="apple-review-dialog__actions">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose?.(e);
                  }}
                  className="apple-review-dialog__btn-cancel"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmitReview?.(e);
                  }}
                  className="apple-review-dialog__btn-submit"
                >
                  {isReviewed ? "تحديث التقييم" : "نشر التقييم"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BookReviewModal;
