import React, { memo } from "react";
import { BookMarked, RotateCcw } from "lucide-react";
import { AGE_FILTERS, CATEGORY_FILTERS } from "../../constants/storyBooksConstants";
import "./StoryBookFilterBar.css";

/**
 * Filter bar specifically tailored for children's storybooks:
 * Age segmentation pills with friendly emojis and horizontal scrolling category tags.
 */
export const StoryBookFilterBar = memo(function StoryBookFilterBar({
  selectedAge,
  onAgeChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
  isFiltered,
  onClearFilters,
}) {
  return (
    <div className="child-filter-bar">
      {/* Top Filter Level: Age Segmentation Pills */}
      <div className="child-filter-bar__age-row">
        <div className="child-filter-bar__age-group" role="tablist" aria-label="تصفية حسب الفئة العمرية">
          {AGE_FILTERS.map((age) => {
            const isActive = selectedAge === age.id;
            return (
              <button
                key={age.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`child-filter-bar__age-btn ${isActive ? "child-filter-bar__age-btn--active" : ""}`}
                onClick={() => onAgeChange(age.id)}
              >
                <span className="child-filter-bar__age-label">{age.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter & Clear Action */}
        <div className="child-filter-bar__stats-wrap">
          <div className="child-filter-bar__count-badge">
            <BookMarked size={14} className="child-filter-bar__sparkle-icon" />
            <span>{totalCount} قصة للأبطال</span>
          </div>

          {isFiltered && (
            <button
              type="button"
              className="child-filter-bar__clear-btn"
              onClick={onClearFilters}
              title="إعادة ضبط كل خيارات التصفية"
            >
              <RotateCcw size={13} />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Filter Level: Category Pills */}
      <div className="child-filter-bar__cat-scroll">
        <div className="child-filter-bar__cat-list">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`child-filter-bar__cat-pill ${isActive ? "child-filter-bar__cat-pill--active" : ""}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default StoryBookFilterBar;
