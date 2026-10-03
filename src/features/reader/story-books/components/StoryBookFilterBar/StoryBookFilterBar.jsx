import React, { memo } from "react";
import { BookMarked, RotateCcw } from "lucide-react";
import { AGE_BANDS } from "../../constants/storyBooksConstants";
import "./StoryBookFilterBar.css";

/**
 * Filter bar tailored for children's storybooks:
 * Real age band segmentation pills and counter badge.
 */
export const StoryBookFilterBar = memo(function StoryBookFilterBar({
  selectedAge = "ALL",
  onAgeChange,
  totalCount = 0,
  isFiltered = false,
  onClearFilters,
}) {
  const ageOptions = [
    { id: "ALL", label: "جميع الأعمار" },
    ...AGE_BANDS.map((a) => ({ id: a.value, label: a.label })),
  ];

  return (
    <div className="child-filter-bar">
      <div className="child-filter-bar__age-row">
        <div className="child-filter-bar__age-group" role="tablist" aria-label="تصفية حسب الفئة العمرية">
          {ageOptions.map((age) => {
            const isActive = selectedAge === age.id;
            return (
              <button
                key={age.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`child-filter-bar__age-btn ${isActive ? "child-filter-bar__age-btn--active" : ""}`}
                onClick={() => onAgeChange?.(age.id)}
              >
                <span className="child-filter-bar__age-label">{age.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter & Clear Action */}
        <div className="child-filter-bar__stats-wrap">
          <div className="child-filter-bar__count-badge">
            <BookMarked size={14} className="child-filter-bar__badge-icon" />
            <span>{totalCount} قصة</span>
          </div>

          {isFiltered && (
            <button
              type="button"
              className="child-filter-bar__clear-btn"
              onClick={onClearFilters}
              title="إعادة ضبط خيارات التصفية"
            >
              <RotateCcw size={13} />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default StoryBookFilterBar;
