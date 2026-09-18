import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search, Star } from "lucide-react";
import { Select } from "@/components/myui/forms";
import { useBookSearch } from "../../hooks/useBookSearch";
import "./BookSearchModal.css";

/**
 * Advanced search & filtering modal for the Reader Library catalog.
 * Displays as an iOS-inspired gesture-enabled bottom sheet on mobile devices,
 * and an editorial centered glass modal on desktop.
 */
export function BookSearchModal({ isOpen, onClose, onApply }) {
  const {
    isMobile,
    selectedRating,
    handleRatingSelect,
    selectedAgeBracket,
    handleAgeBracketChange,
    ageOptions,
    selectedCategory,
    availableSubGenres,
    selectedSubGenre,
    categoryOptions,
    subGenreOptions,
    handleCategoryChange,
    handleSubGenreChange,
    handleApplyFilters,
    handleResetFilters,
  } = useBookSearch({ isOpen, onClose, onApply });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ktab-search-modal-backdrop" onClick={onClose}>
          <motion.div
            className={`ktab-search-modal-box ${
              isMobile
                ? "ktab-search-modal-box--bottomsheet"
                : "ktab-search-modal-box--desktop"
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="تصفية واكتشاف الكتب"
            {...(isMobile
              ? {
                  drag: "y",
                  dragConstraints: { top: 0 },
                  dragElastic: { top: 0, bottom: 0.35 },
                  onDragEnd: (_, info) => {
                    if (info.offset.y > 90 || info.velocity.y > 450) {
                      onClose();
                    }
                  },
                  initial: { y: "100%" },
                  animate: { y: 0 },
                  exit: { y: "100%" },
                  transition: { type: "spring", damping: 28, stiffness: 340 },
                }
              : {
                  initial: { opacity: 0, scale: 0.96, y: 8 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.96, y: 8 },
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                })}
          >
            {/* Mobile Sheet Drag Handle Indicator */}
            {isMobile && (
              <div className="ktab-search-modal__drag-bar" aria-hidden="true">
                <span className="ktab-search-modal__drag-indicator" />
              </div>
            )}

            {/* Header */}
            <header className="ktab-search-modal__header">
              <div className="ktab-search-modal__title-group">
                <div className="ktab-search-modal__icon-badge" aria-hidden="true">
                  <Filter size={18} strokeWidth={2.4} />
                </div>
                <h2 className="ktab-search-modal__title">تصفية الكتب</h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="ktab-search-modal__close-btn"
                aria-label="إغلاق"
                title="إغلاق"
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </header>

            {/* Body */}
            <div className="ktab-search-modal__body">
              {/* Dual Category & Subgenre Select Lists on 1 Row */}
              <div className="ktab-search-modal__dropdowns-row">
                <div className="ktab-search-modal__dropdown-col">
                  <Select
                    label="التصنيف الرئيسي"
                    placeholder="جميع التصنيفات"
                    options={categoryOptions}
                    value={String(selectedCategory || "")}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  />
                </div>
                <div className="ktab-search-modal__dropdown-col">
                  <Select
                    label="التصنيف الفرعي"
                    placeholder={
                      !selectedCategory
                        ? "اختر تصنيفاً أولاً"
                        : availableSubGenres.length === 0
                        ? "لا توجد تصنيفات فرعية"
                        : "جميع التصنيفات الفرعية"
                    }
                    options={subGenreOptions}
                    value={String(selectedSubGenre || "")}
                    onChange={(e) => handleSubGenreChange(e.target.value)}
                    disabled={!selectedCategory || availableSubGenres.length === 0}
                  />
                </div>
              </div>

              {/* Rating & Age Filters */}
              <div className="ktab-search-modal__meta-row">
                {/* Minimum Rating (5 Buttons from 1 to 5) */}
                <div className="ktab-rating-select-wrap">
                  <label className="ktab-search-modal__label">الحد الأدنى للتقييم</label>
                  <div
                    className="ktab-rating-btn-group"
                    role="group"
                    aria-label="اختر الحد الأدنى للتقييم"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => {
                      const isActive = selectedRating === rating;
                      return (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingSelect(rating)}
                          className={`ktab-rating-btn ${
                            isActive ? "ktab-rating-btn--active" : ""
                          }`}
                          aria-pressed={isActive}
                          title={`${rating} ${
                            rating === 1 ? "نجمة" : "نجوم"
                          } فأكثر`}
                        >
                          <Star
                            size={19}
                            className={`ktab-rating-star ${
                              isActive ? "is-filled" : ""
                            }`}
                          />
                          <span className="ktab-rating-num">{rating}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age Bracket Filter (Global Select) */}
                <div className="ktab-search-modal__col">
                  <Select
                    label="الفئة العمرية"
                    placeholder="جميع الفئات العمرية"
                    options={ageOptions}
                    value={selectedAgeBracket}
                    onChange={(e) => handleAgeBracketChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

        {/* Footer */}
        <footer className="ktab-search-modal__footer">
          <button
            type="button"
            onClick={handleResetFilters}
            className="ktab-search-modal__reset-btn"
          >
            إعادة تعيين
          </button>
          <button
            type="button"
            onClick={handleApplyFilters}
            className="ktab-search-modal__apply-btn"
          >
            <Search size={16} strokeWidth={2.4} />
            <span>تطبيق الفلاتر</span>
          </button>
        </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BookSearchModal;
