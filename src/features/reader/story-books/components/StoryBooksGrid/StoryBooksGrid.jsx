import React, { memo, useState, useEffect } from "react";
import { Plus, BookX } from "lucide-react";
import { StoryBookCard } from "../StoryBookCard/StoryBookCard";
import "./StoryBooksGrid.css";

/**
 * Grid layout for children's 1:1 storybook cards.
 * Handles loading skeleton states, friendly empty states, and fluid responsive grid mapping.
 * Manages active 3-dots action menu with click-outside closure.
 */
export const StoryBooksGrid = memo(function StoryBooksGrid({
  stories = [],
  loading = false,
  onCardClick,
  onClearFilters,
  onOpenCreateModal,
  onPreview,
  onDetails,
  onConvertToPdf,
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
      <div className="child-stories-empty">
        <div className="child-stories-empty__icon-wrap">
          <BookX size={36} className="child-stories-empty__icon" />
        </div>
        <h3 className="child-stories-empty__title">لم نعثر على أي حكاية مطابقة للبحث</h3>
        <p className="child-stories-empty__desc">
          جرّب تغيير كلمات البحث أو الفئة العمرية، أو ابتكر قصة خيالية جديدة ومخصصة لطفلك الآن!
        </p>
        <div className="child-stories-empty__actions">
          {onClearFilters && (
            <button
              type="button"
              className="child-stories-empty__btn-secondary"
              onClick={onClearFilters}
            >
              عرض جميع القصص
            </button>
          )}
          {onOpenCreateModal && (
            <button
              type="button"
              className="child-stories-empty__btn-primary"
              onClick={onOpenCreateModal}
            >
              <Plus size={15} strokeWidth={2.4} />
              <span>ابتكار قصة جديدة</span>
            </button>
          )}
        </div>
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
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

export default StoryBooksGrid;
