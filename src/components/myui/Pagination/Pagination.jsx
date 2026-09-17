import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "./Pagination.css";

/**
 * Global Pagination Component.
 * Renders previous/next navigation buttons and numbered page pills.
 * Current page is highlighted in the pills; status indicator is optional and hidden by default.
 */
export function Pagination({
  page = 0,
  totalPages = 1,
  onPageChange,
  disabled = false,
  prevLabel = "السابق",
  nextLabel = "التالي",
  zeroIndexed = true,
  showStatus = false,
  className = "",
}) {
  const currentPage = zeroIndexed ? page + 1 : page;
  const safeTotalPages = Math.max(1, totalPages || 1);
  const canGoPrev = zeroIndexed ? page > 0 : page > 1;
  const canGoNext = zeroIndexed ? page + 1 < safeTotalPages : page < safeTotalPages;

  // Generate numbered pages (max 5 visible)
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(safeTotalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav
      className={`ktab-pagination ${
        showStatus ? "ktab-pagination--with-status" : ""
      } ${className}`}
      dir="rtl"
      aria-label="التنقل بين الصفحات"
    >
      {/* Optional Current Page Indicator */}
      {showStatus && (
        <div className="ktab-pagination__status">
          <span className="ktab-pagination__status-label">الصفحة</span>
          <span className="ktab-pagination__status-active">{currentPage}</span>
          <span className="ktab-pagination__status-total">من {safeTotalPages}</span>
        </div>
      )}

      {/* Page Number Pills & Arrow Actions */}
      <div className="ktab-pagination__controls">
        {/* Previous Button (Points right in RTL) */}
        <button
          type="button"
          onClick={() => canGoPrev && !disabled && onPageChange?.(zeroIndexed ? page - 1 : page - 1)}
          disabled={!canGoPrev || disabled}
          className="ktab-pagination__arrow-btn"
          aria-label={prevLabel}
          title={prevLabel}
        >
          <ChevronRight size={16} />
          <span className="ktab-pagination__btn-text">{prevLabel}</span>
        </button>

        {/* Page Number Buttons */}
        <div className="ktab-pagination__pills">
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => !isActive && !disabled && onPageChange?.(zeroIndexed ? p - 1 : p)}
                disabled={disabled}
                className={`ktab-pagination__pill ${
                  isActive ? "ktab-pagination__pill--active" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button (Points left in RTL) */}
        <button
          type="button"
          onClick={() => canGoNext && !disabled && onPageChange?.(zeroIndexed ? page + 1 : page + 1)}
          disabled={!canGoNext || disabled}
          className="ktab-pagination__arrow-btn"
          aria-label={nextLabel}
          title={nextLabel}
        >
          <span className="ktab-pagination__btn-text">{nextLabel}</span>
          <ChevronLeft size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
