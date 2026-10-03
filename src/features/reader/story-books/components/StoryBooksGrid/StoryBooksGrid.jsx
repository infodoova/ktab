import React, { memo, useState, useEffect } from "react";
import { Plus, BookOpen, SearchX } from "lucide-react";
import { StoryBookCard } from "../StoryBookCard/StoryBookCard";
import "./StoryBooksGrid.css";

/**
 * Grid layout for children's 1:1 storybook cards.
 * Handles loading skeleton states, polished empty states (fresh vs filtered),
 * and fluid responsive grid mapping.
 */
export const StoryBooksGrid = memo(function StoryBooksGrid({
  stories = [],
  loading = false,
  isFiltered = false,
  onCardClick,
  onClearFilters,
  onOpenCreateModal,
  onPreview,
  onDetails,
  onConvertToPdf,
  onCancel,
  onDelete,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close active 3-dots menu on click outside
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest(".ktab-child-story-card__menu-anchor")) {
        setOpenMenuId(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  if (loading) {
    return (
      <div className="child-stories-grid">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="child-story-skeleton-card">
            <div className="child-story-skeleton-card__cover" />
            <div className="child-story-skeleton-card__body">
              <div className="child-story-skeleton-card__line child-story-skeleton-card__line--short" />
              <div className="child-story-skeleton-card__line child-story-skeleton-card__line--title" />
              <div className="child-story-skeleton-card__line" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="child-stories-empty" dir="rtl">
        {isFiltered ? (
          /* Filtered state with 0 results */
          <>
            <div className="child-stories-empty__icon-wrap">
              <SearchX size={26} strokeWidth={1.8} className="child-stories-empty__icon" />
            </div>
            <h3 className="child-stories-empty__title">لم نعثر على أي حكاية مطابقة للبحث</h3>
            <p className="child-stories-empty__desc">
              جرّب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية للعثور على قصصك.
            </p>
            <div className="child-stories-empty__actions">
              {onClearFilters && (
                <button
                  type="button"
                  className="child-stories-empty__btn-secondary"
                  onClick={onClearFilters}
                >
                  <span>عرض جميع القصص</span>
                </button>
              )}
              {onOpenCreateModal && (
                <button
                  type="button"
                  className="child-stories-empty__btn-primary"
                  onClick={onOpenCreateModal}
                >
                  <Plus size={16} strokeWidth={2.4} />
                  <span>ابتكار قصة جديدة</span>
                </button>
              )}
            </div>
          </>
        ) : (
          /* Fresh initial state with 0 stories created yet */
          <>
            <div className="child-stories-empty__icon-wrap">
              <BookOpen size={26} strokeWidth={1.8} className="child-stories-empty__icon" />
            </div>
            <h3 className="child-stories-empty__title">لا توجد قصص أطفال بعد</h3>
            <p className="child-stories-empty__desc">
              ابدأ بإنشاء قصة مصورة ومخصصة لطفلك باسمه ومظهره واهتماماته في خطوات بسيطة.
            </p>
            <div className="child-stories-empty__actions">
              {onOpenCreateModal && (
                <button
                  type="button"
                  className="child-stories-empty__btn-primary"
                  onClick={onOpenCreateModal}
                >
                  <Plus size={16} strokeWidth={2.4} />
                  <span>ابتكار قصة جديدة</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="child-stories-grid" role="region" aria-label="قائمة قصص الأطفال">
      {stories.map((story) => (
        <StoryBookCard
          key={story.id}
          story={story}
          onClick={onCardClick}
          isMenuOpen={openMenuId === story.id}
          onToggleMenu={(id) => setOpenMenuId(id)}
          onPreview={onPreview}
          onDetails={onDetails || onCardClick}
          onConvertToPdf={onConvertToPdf}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

export default StoryBooksGrid;
