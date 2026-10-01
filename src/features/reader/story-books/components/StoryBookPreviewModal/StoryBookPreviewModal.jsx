import React, { memo } from "react";
import { X, BookOpen, Clock, Heart } from "lucide-react";
import "./StoryBookPreviewModal.css";

/**
 * Child Story Preview Modal.
 * Showcases the 1:1 cover illustration, story summary, reading duration,
 * audio narration toggle, and call to action to launch the interactive story.
 */
export const StoryBookPreviewModal = memo(function StoryBookPreviewModal({
  story,
  onClose,
  onStartReading,
}) {
  if (!story) return null;

  const {
    title,
    subtitle,
    author,
    cover,
    ageLabel,
    category,
    readingTime,
    summary,
    isInteractive,
    likesCount,
  } = story;

  return (
    <div
      className="child-preview-modal__backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="child-preview-modal-title"
    >
      <div
        className="child-preview-modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="child-preview-modal__close-btn"
          onClick={onClose}
          aria-label="إغلاق النافذة"
        >
          <X size={18} />
        </button>

        <div className="child-preview-modal__content">
          {/* Left / Top: 1:1 Artwork */}
          <div className="child-preview-modal__cover-wrap">
            <img
              src={cover}
              alt={title}
              className="child-preview-modal__cover-img"
            />
          </div>

          {/* Right / Body: Details */}
          <div className="child-preview-modal__body">
            <div className="child-preview-modal__tags-row">
              <span className="child-preview-modal__age-tag">{ageLabel}</span>
              <span className="child-preview-modal__cat-tag">{category}</span>
              {readingTime && (
                <span className="child-preview-modal__time-tag">
                  <Clock size={12} />
                  <span>{readingTime}</span>
                </span>
              )}
            </div>

            <h2 id="child-preview-modal-title" className="child-preview-modal__title">
              {title}
            </h2>

            {subtitle && (
              <p className="child-preview-modal__subtitle">
                {subtitle}
              </p>
            )}

            <div className="child-preview-modal__author-row">
              <span className="child-preview-modal__author-label">تأليف ورسم:</span>
              <span className="child-preview-modal__author-name">{author}</span>
              {likesCount && (
                <span className="child-preview-modal__likes">
                  <Heart size={13} fill="currentColor" />
                  <span>{likesCount} إعجاب من الأبطال</span>
                </span>
              )}
            </div>

            {summary && (
              <div className="child-preview-modal__summary-box">
                <p className="child-preview-modal__summary-text">{summary}</p>
              </div>
            )}

            {/* Actions */}
            <div className="child-preview-modal__actions">
              <button
                type="button"
                className="child-preview-modal__btn-read"
                onClick={() => onStartReading?.(story)}
              >
                <BookOpen size={16} />
                <span>ابدأ القراءة التفاعلية</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StoryBookPreviewModal;
