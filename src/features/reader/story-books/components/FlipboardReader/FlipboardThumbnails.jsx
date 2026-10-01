import React, { memo } from "react";
import { X } from "lucide-react";
import "./FlipboardThumbnails.css";

/**
 * Slide-up filmstrip thumbnails panel for the Flipboard reader.
 * Enables quick page scanning and direct navigation between pages.
 */
export const FlipboardThumbnails = memo(function FlipboardThumbnails({
  pages = [],
  currentPage = 0,
  isOpen = false,
  onClose,
  onSelectPage,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="flipboard-thumbnails-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="فهرس صفحات الحكاية"
    >
      <div
        className="flipboard-thumbnails-drawer"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flipboard-thumbnails__header">
          <h3 className="flipboard-thumbnails__title">فهرس صفحات الحكاية</h3>
          <button
            type="button"
            className="flipboard-thumbnails__close-btn"
            onClick={onClose}
            aria-label="إغلاق الفهرس"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flipboard-thumbnails__strip">
          {pages.map((page, idx) => {
            const isActive = idx === currentPage;
            return (
              <button
                key={`thumb-${idx}`}
                type="button"
                onClick={() => onSelectPage?.(idx)}
                className={`flipboard-thumb-card ${
                  isActive ? "flipboard-thumb-card--active" : ""
                }`}
              >
                <div className="flipboard-thumb-card__preview">
                  {page.image && (
                    <img
                      src={page.image}
                      alt=""
                      className="flipboard-thumb-card__img"
                      loading="lazy"
                    />
                  )}
                  <span className="flipboard-thumb-card__num">{idx + 1}</span>
                </div>
                <span className="flipboard-thumb-card__label" title={page.title}>
                  {page.type === "cover" ? "الغلاف" : page.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default FlipboardThumbnails;
