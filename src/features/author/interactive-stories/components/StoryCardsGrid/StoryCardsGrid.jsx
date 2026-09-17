import React, { useRef, useEffect } from "react";
import { MoreVertical, Trash2, Eye, Loader2 } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useStoryCoverImage } from "./useStoryCoverImage";
import { ARABIC_TAG_MAP } from "../../constants/interactiveStoriesConstants";
import "./StoryCardsGrid.css";

function StoryCoverImage({ coverUrl, title }) {
  const { loaded, hasError, handleLoad, handleError } = useStoryCoverImage(coverUrl);

  if (!coverUrl || hasError) {
    return (
      <div className="ktab-story-card__fallback-cover" role="img" aria-label={title || "قصة تفاعلية"}>
        <img
          src={brandIconImg}
          alt=""
          className="ktab-story-card__fallback-logo"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="ktab-story-card__image-container">
      {!loaded && <div className="ktab-story-card__cover-shimmer" />}
      <img
        src={coverUrl}
        alt={title || "قصة تفاعلية"}
        onLoad={handleLoad}
        onError={handleError}
        className={`ktab-story-card__cover-img ${
          loaded ? "ktab-story-card__cover-img--loaded" : "ktab-story-card__cover-img--loading"
        }`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Pure presentation StoryCardsGrid component.
 */
export function StoryCardsGrid({
  stories = [],
  loading = false,
  loadingMore = false,
  page = 0,
  totalPages = 1,
  openMenuId,
  setOpenMenuId,
  onStoryClick,
  onDeleteClick,
  onLoadMore,
  onCreateNew,
  searchQuery = "",
  onResetFilters,
  isFiltered = false,
}) {
  const sentinelRef = useRef(null);

  // Automatic infinite scroll trigger on viewport intersection
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && page + 1 < totalPages) {
          onLoadMore?.();
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, page, totalPages, onLoadMore]);

  if (loading) {
    return (
      <div className="ktab-stories-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`story-skel-${i}`} className="ktab-story-skeleton">
            <div className="ktab-story-skeleton__cover" />
            <div className="ktab-story-skeleton__line ktab-story-skeleton__line--title" />
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    const isSearchOrFilter = Boolean((searchQuery && searchQuery.trim()) || isFiltered);

    return (
      <div className="ktab-stories-empty">
        <h3 className="ktab-stories-empty__title">
          {isSearchOrFilter ? "لا توجد نتائج مطابقة" : "لم تنشئ أي قصة تفاعلية بعد"}
        </h3>
        <p className="ktab-stories-empty__desc">
          {isSearchOrFilter
            ? searchQuery.trim()
              ? `لم نتمكن من العثور على أي قصة تطابق «${searchQuery.trim()}».`
              : "لا توجد قصص ضمن التصنيف المحدد حالياً."
            : "ابدأ بتأسيس أول عالم تفاعلي وصياغة المشاهد والمسارات السردية لجمهورك."}
        </p>

        {isSearchOrFilter ? (
          onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ktab-stories-empty__reset-btn"
            >
              إعادة ضبط التصفية
            </button>
          )
        ) : (
          onCreateNew && (
            <button
              type="button"
              onClick={onCreateNew}
              className="ktab-stories-empty__action-btn"
            >
              إنشاء أول قصة تفاعلية
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div className="ktab-stories-container">
      <div className="ktab-stories-grid">
        {stories.map((story, index) => {
          const storyId = story.id ?? story.storyId ?? index;
          const isOpen = openMenuId === storyId;
          const coverUrl = story.coverImageUrl || story.coverImage || story.cover;

          return (
            <div
              key={`story-${storyId}`}
              onClick={() => onStoryClick && onStoryClick(story)}
              className="ktab-story-card"
            >
              {/* Cover Image + Actions */}
              <div className="ktab-story-card__cover-wrap">
                <StoryCoverImage coverUrl={coverUrl} title={story.title} />

                {/* Top-Left: Menu Actions */}
                <div className="ktab-story-card__menu-anchor story-menu-area">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isOpen ? null : storyId);
                    }}
                    className="ktab-story-card__menu-btn"
                    aria-label="خيارات القصة"
                    title="خيارات"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {isOpen && (
                    <div
                      className="ktab-story-card__menu-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onStoryClick && onStoryClick(story);
                        }}
                        className="ktab-story-card__menu-item"
                      >
                        <span>عرض التفاصيل</span>
                        <Eye size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDeleteClick && onDeleteClick(story);
                        }}
                        className="ktab-story-card__menu-item ktab-story-card__menu-item--danger"
                      >
                        <span>حذف القصة</span>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body: Only Name */}
              <div className="ktab-story-card__body">
                <h4 className="ktab-story-card__title" title={story.title}>
                  {story.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll Sentinel & Subtle Spinner */}
      {page + 1 < totalPages && (
        <div ref={sentinelRef} className="ktab-stories-infinite-sentinel">
          {loadingMore && (
            <div className="ktab-stories-infinite-spinner">
              <Loader2 size={24} className="ktab-spinner" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StoryCardsGrid;
