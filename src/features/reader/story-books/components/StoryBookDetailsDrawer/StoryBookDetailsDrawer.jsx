import React, { memo } from "react";
import { BookOpen, User, Tag } from "lucide-react";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import "./StoryBookDetailsDrawer.css";

/**
 * Children's Story Book Details Drawer.
 * Built with the standard global DetailsDrawer (left slide-over on desktop, bottom sheet on mobile).
 * Strictly right-aligned editorial layout without duration or likes clutter.
 */
export const StoryBookDetailsDrawer = memo(function StoryBookDetailsDrawer({
  story,
  isOpen = false,
  onClose,
  onStartReading,
}) {
  if (!story) return null;

  const {
    title,
    subtitle,
    author,
    illustrator,
    cover,
    ageLabel,
    category,
    summary,
  } = story;

  // Sticky action footer
  const footer = (
    <div className="child-story-drawer__footer" dir="rtl">
      <button
        type="button"
        className="child-story-drawer__btn-primary"
        onClick={() => onStartReading?.(story)}
      >
        <BookOpen size={16} strokeWidth={2.4} />
        <span>ابدأ القراءة التفاعلية</span>
      </button>
    </div>
  );

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={category ? `قسم: ${category}` : "تفاصيل الحكاية"}
      footer={footer}
      width="480px"
      className="child-story-details-drawer"
    >
      <div className="child-story-drawer__content" dir="rtl">
        {/* 1:1 Large Story Cover Artwork */}
        <div className="child-story-drawer__artwork-wrap">
          <img
            src={cover}
            alt={title}
            className="child-story-drawer__artwork-img"
          />
          {ageLabel && (
            <span className="child-story-drawer__badge-age">
              {ageLabel}
            </span>
          )}
        </div>

        {/* Story Metadata Pills (Strictly Right-Aligned) */}
        <div className="child-story-drawer__pills-row">
          {category && (
            <div className="child-story-drawer__pill">
              <Tag size={12} />
              <span>{category}</span>
            </div>
          )}
          {ageLabel && (
            <div className="child-story-drawer__pill">
              <span>الفئة: {ageLabel}</span>
            </div>
          )}
        </div>

        {/* Titles & Credits (Right-Aligned) */}
        <div className="child-story-drawer__meta-section">
          <h3 className="child-story-drawer__title">{title}</h3>
          {subtitle && (
            <p className="child-story-drawer__subtitle">{subtitle}</p>
          )}

          <div className="child-story-drawer__credits">
            <div className="child-story-drawer__credit-item">
              <User size={13} className="child-story-drawer__credit-icon" />
              <span className="child-story-drawer__credit-label">المؤلف:</span>
              <span className="child-story-drawer__credit-val">{author}</span>
            </div>
            {illustrator && (
              <div className="child-story-drawer__credit-item">
                <span className="child-story-drawer__credit-label">الرسوم:</span>
                <span className="child-story-drawer__credit-val">{illustrator}</span>
              </div>
            )}
          </div>
        </div>

        {/* Story Summary Card */}
        {summary && (
          <div className="child-story-drawer__summary-card">
            <h4 className="child-story-drawer__summary-heading">نبذة عن الحكاية</h4>
            <p className="child-story-drawer__summary-text">{summary}</p>
          </div>
        )}
      </div>
    </DetailsDrawer>
  );
});

export default StoryBookDetailsDrawer;
