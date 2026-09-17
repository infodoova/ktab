import React from "react";
import { Star, MessageSquare, BookOpen, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Select, BottomSheet } from "@/components/myui";
import { useUserRatingsList } from "./useUserRatingsList";
import "./UserRatingsList.css";

/**
 * Pure presentation component rendering reader reviews list, rating filters, and sort options.
 * Uses global Select and mobile BottomSheet for refined responsive controls.
 * All filtering and presentation transformations extracted to useUserRatingsList.
 */
export function UserRatingsList({ reviews = [] }) {
  const {
    filterOptions,
    activeFilter,
    setActiveFilter,
    sortOptions,
    activeSort,
    setActiveSort,
    reviewsList,
    totalCount,
    hasReviews,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    activeFiltersCount,
    resetFilters,
  } = useUserRatingsList({ reviews });

  return (
    <section className="ktab-ratings-list-section" dir="rtl" aria-label="آراء ومراجعات القراء">
      {/* Header and Controls (No outer box, aligned directly on page) */}
      <div className="ktab-ratings-list-header">
        <div className="ktab-ratings-list-title-group">
          <h3 className="ktab-ratings-list-title">آراء ومراجعات القراء</h3>
          <p className="ktab-ratings-list-subtitle">
            مراجعات مكتوبة وملاحظات نقدية من القراء ({totalCount})
          </p>
        </div>

        {/* Desktop Controls (Rating tabs + Global Select) */}
        <div className="ktab-ratings-desktop-controls">
          <div className="ktab-ratings-filter-bar">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`ktab-ratings-filter-pill ${
                  activeFilter === f.id ? "ktab-ratings-filter-pill--active" : ""
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="ktab-ratings-sort-wrap">
            <Select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              options={sortOptions}
              placeholder="الترتيب"
              className="ktab-ratings-filter-select"
              triggerClassName="ktab-ratings-filter-select-trigger"
              menuClassName="ktab-ratings-filter-select-menu"
            />
          </div>
        </div>

        {/* Mobile Controls (Trigger button for BottomSheet) */}
        <div className="ktab-ratings-mobile-controls">
          <button
            type="button"
            className={`ktab-ratings-mobile-filter-btn ${
              activeFiltersCount > 0 ? "ktab-ratings-mobile-filter-btn--active" : ""
            }`}
            onClick={() => setIsFilterSheetOpen(true)}
            aria-label="تصفية المراجعات"
          >
            <SlidersHorizontal size={16} />
            {activeFiltersCount > 0 && (
              <span className="ktab-ratings-mobile-filter-badge">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter & Sort BottomSheet */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="تصفية وترتيب المراجعات"
      >
        <div className="ktab-ratings-sheet-content">
          <div className="ktab-ratings-sheet-field">
            <span className="ktab-ratings-sheet-label">فئة التقييم</span>
            <div className="ktab-ratings-sheet-tabs">
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`ktab-ratings-sheet-tab ${
                    activeFilter === f.id ? "ktab-ratings-sheet-tab--active" : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ktab-ratings-sheet-field">
            <span className="ktab-ratings-sheet-label">الترتيب</span>
            <Select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              options={sortOptions}
              placeholder="الترتيب"
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              className="ktab-ratings-sheet-reset-btn"
              onClick={resetFilters}
            >
              <RotateCcw size={14} />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>
      </BottomSheet>

      {/* Review Cards Feed */}
      {hasReviews ? (
        <div className="ktab-ratings-feed">
          {reviewsList.map((review, index) => (
            <article key={review.id || index} className="ktab-ratings-review-card">
              <div className="ktab-ratings-review-card__header">
                <div className="ktab-ratings-review-card__user">
                  <div className="ktab-ratings-review-card__avatar">
                    <span>{review.initial}</span>
                  </div>
                  <div className="ktab-ratings-review-card__meta">
                    <span className="ktab-ratings-review-card__name">{review.name}</span>
                    {review.dateFormatted && (
                      <span className="ktab-ratings-review-card__date">{review.dateFormatted}</span>
                    )}
                  </div>
                </div>

                <div className="ktab-ratings-review-card__rating">
                  <Star size={13} fill="currentColor" strokeWidth={1.5} />
                  <span>{review.ratingVal}</span>
                </div>
              </div>

              {review.bookTitle && (
                <div className="ktab-ratings-review-card__book-tag">
                  <BookOpen size={12} strokeWidth={2} />
                  <span>{review.bookTitle}</span>
                </div>
              )}

              {review.comment && (
                <p className="ktab-ratings-review-card__comment">{review.comment}</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="ktab-ratings-empty-state">
          <div className="ktab-ratings-empty-state__icon">
            <MessageSquare size={24} strokeWidth={1.8} />
          </div>
          <h4 className="ktab-ratings-empty-state__title">لا توجد مراجعات تطابق الفلتر</h4>
          <p className="ktab-ratings-empty-state__desc">
            لم يقم القراء بترك مراجعات بهذا التصنيف حتى الآن، أو يمكنك تجربة اختيار فلتر آخر.
          </p>
        </div>
      )}
    </section>
  );
}

export default UserRatingsList;
