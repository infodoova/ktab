import React from "react";
import { ChevronsUp, ChevronsDown, ChevronDown } from "lucide-react";
import { useLibrarySortBar } from "./useLibrarySortBar";
import "./LibrarySortBar.css";

/**
 * Editorial sorting action bar for the Reader Library catalog.
 */
export function LibrarySortBar({
  sortField = "title",
  ascending = true,
  onSortChange,
}) {
  const { sortFields, handleFieldChange, handleToggleOrder } = useLibrarySortBar({
    sortField,
    ascending,
    onSortChange,
  });

  return (
    <div className="ktab-lib-sortbar" dir="rtl">
      {/* Sort Selector & Order Toggle */}
      <div className="ktab-lib-sortbar__controls-group">
        <span className="ktab-lib-sortbar__label">ترتيب حسب:</span>

        <div className="ktab-lib-sortbar__select-wrap">
          <select
            className="ktab-lib-sortbar__select"
            value={sortField}
            onChange={(e) => handleFieldChange(e.target.value)}
            aria-label="اختيار حقل الترتيب"
          >
            {sortFields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="ktab-lib-sortbar__select-icon" />
        </div>

        <button
          type="button"
          onClick={handleToggleOrder}
          className="ktab-lib-sortbar__btn-action"
          aria-label={ascending ? "ترتيب تصاعدي (انقر للتبديل لتنازلي)" : "ترتيب تنازلي (انقر للتبديل لتصاعدي)"}
          title={ascending ? "تصاعدي" : "تنازلي"}
        >
          {ascending ? (
            <ChevronsUp size={16} strokeWidth={2.4} />
          ) : (
            <ChevronsDown size={16} strokeWidth={2.4} />
          )}
          <span>{ascending ? "تصاعدي" : "تنازلي"}</span>
        </button>
      </div>
    </div>
  );
}

export default LibrarySortBar;
