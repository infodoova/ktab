import React, { memo, useState, useCallback, useEffect, useRef } from "react";
import { MoreVertical, Eye, FileText, FileDown, Trash2 } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import "./StoryBookCard.css";

/**
 * Highly professional 1:1 Children's Story Book Card.
 * Adheres strictly to Ktab's Eleven Reader + Apple design standard:
 * - Transparent container with elevated 1:1 square cover
 * - Smooth progressive image loading with shimmer
 * - Subtle frosted-glass meta badges
 * - Floating 3-dots actions menu (Preview, Details, Turn to PDF, Delete)
 * - Clean editorial typography and responsive hover elevation
 */
export const StoryBookCard = memo(function StoryBookCard({
  story,
  onClick,
  isMenuOpen = false,
  onToggleMenu,
  onPreview,
  onDetails,
  onConvertToPdf,
  onDelete,
}) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Check if image is already cached/complete when mounting or props change
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
      setHasError(false);
    } else {
      setLoaded(false);
      setHasError(false);
    }
  }, [story?.cover]);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback((e) => {
    if (e?.currentTarget && e.currentTarget.src !== bunnyCover) {
      e.currentTarget.src = bunnyCover;
      setLoaded(true);
    } else {
      setHasError(true);
      setLoaded(false);
    }
  }, []);

  if (!story) return null;

  const {
    id,
    title,
    author,
    cover,
    ageLabel,
    category,
  } = story;

  return (
    <article
      className={`ktab-child-story-card ${isMenuOpen ? "ktab-child-story-card--menu-open" : ""}`}
      onClick={() => onClick?.(story)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(story);
        }
      }}
      aria-label={`عرض قصة ${title}`}
    >
      {/* 1:1 Square Elevated Cover Wrapper */}
      <div className="ktab-child-story-card__cover-wrap">
        {!cover || hasError ? (
          <div className="ktab-child-story-card__fallback-cover">
            <img
              src={brandIconImg}
              alt=""
              className="ktab-child-story-card__fallback-logo"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="ktab-child-story-card__image-container">
            {!loaded && <div className="ktab-child-story-card__cover-shimmer" />}
            <img
              ref={imgRef}
              src={cover}
              alt={title}
              loading="lazy"
              decoding="async"
              onLoad={handleLoad}
              onError={handleError}
              className={`ktab-child-story-card__cover-img ${
                loaded
                  ? "ktab-child-story-card__cover-img--loaded"
                  : "ktab-child-story-card__cover-img--loading"
              }`}
            />
          </div>
        )}

        {/* Top-Left: 3-dots Menu Anchor */}
        <div className="ktab-child-story-card__menu-anchor">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu?.(isMenuOpen ? null : id);
            }}
            className="ktab-child-story-card__menu-btn"
            aria-label="خيارات القصة"
            title="خيارات"
          >
            <MoreVertical size={14} />
          </button>

          {isMenuOpen && (
            <div
              className="ktab-child-story-card__menu-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  onToggleMenu?.(null);
                  if (onPreview) onPreview(story);
                  else onClick?.(story);
                }}
                className="ktab-child-story-card__menu-item"
              >
                <span>معاينة القصة</span>
                <Eye size={13} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleMenu?.(null);
                  if (onDetails) onDetails(story);
                  else onClick?.(story);
                }}
                className="ktab-child-story-card__menu-item"
              >
                <span>عرض التفاصيل</span>
                <FileText size={13} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleMenu?.(null);
                  onConvertToPdf?.(story);
                }}
                className="ktab-child-story-card__menu-item"
              >
                <span>تحويل إلى PDF</span>
                <FileDown size={13} strokeWidth={2.2} />
              </button>

              <div className="ktab-child-story-card__menu-divider" />

              <button
                type="button"
                onClick={() => {
                  onToggleMenu?.(null);
                  onDelete?.(story);
                }}
                className="ktab-child-story-card__menu-item ktab-child-story-card__menu-item--danger"
              >
                <span>حذف القصة</span>
                <Trash2 size={13} strokeWidth={2.2} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Card Body */}
      <div className="ktab-child-story-card__body">
        <h4 className="ktab-child-story-card__title" title={title}>
          {title}
        </h4>
        <div className="ktab-child-story-card__meta">
          <span className="ktab-child-story-card__author">{author}</span>
          {category && (
            <>
              <span className="ktab-child-story-card__bullet">•</span>
              <span className="ktab-child-story-card__detail">
                {category}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
});

export default StoryBookCard;
