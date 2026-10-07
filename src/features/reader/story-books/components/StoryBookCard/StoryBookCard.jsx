import React, { memo, useState, useCallback, useRef } from "react";
import { MoreVertical, BookOpen, FileText, FileDown, Ban } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { getStoryStatusConfig } from "../../constants/storyBooksConstants";
import "./StoryBookCard.css";

/**
 * Editorial 1:1 Children's Story Book Card.
 * Reflects real backend status and live signed cover artwork:
 * - Real storybook status badge
 * - Real child hero name
 * - Real page count
 * - Dynamic action options
 */
export const StoryBookCard = memo(function StoryBookCard({
  story,
  onClick,
  isMenuOpen = false,
  onToggleMenu,
  onPreview,
  onDetails,
  onConvertToPdf,
  onCancel,
}) {
  const coverSrc = story?.coverImageUrl || story?.coverUrl || story?.cover;
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prevCover, setPrevCover] = useState(coverSrc);
  const imgRef = useRef(null);

  if (prevCover !== coverSrc) {
    setPrevCover(coverSrc);
    setLoaded(false);
    setHasError(false);
  }

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => {
    setHasError(true);
    setLoaded(false);
  }, []);

  if (!story) return null;

  const {
    id,
    title,
    titleAr,
    childName,
    childNameAr,
    status,
    pageCount,
  } = story;

  const displayTitle = title || titleAr || "قصة مخصصة";
  const displayChild = childName || childNameAr || "";
  const isApprovedAndGeneratingChar = status === "STORY_READY" && story?.storyApproved;
  const statusConfig = isApprovedAndGeneratingChar
    ? { label: "جاري إعداد مظهر البطل...", color: "#0f172a", bg: "#ffffff", border: "#94a3b8", canRead: false }
    : getStoryStatusConfig(status);
  const isReady = status === "READY" || status === "COMPLETED";
  const isInProgress = ["DRAFT", "STORY_READY", "CHARACTER_READY", "ILLUSTRATING", "QA", "RENDERING"].includes(status);

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
      aria-label={`عرض قصة ${displayTitle}`}
    >
      {/* 1:1 Square Elevated Cover Wrapper */}
      <div className="ktab-child-story-card__cover-wrap">
        {!coverSrc || hasError ? (
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
              src={coverSrc}
              alt={displayTitle}
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

        {/* Status Badge */}
        {status && (
          <div
            className="ktab-child-story-card__status-badge"
            style={{
              color: statusConfig.color || "#0f172a",
              backgroundColor: statusConfig.bg || "#ffffff",
              borderColor: statusConfig.border || statusConfig.color || "#0f172a",
            }}
          >
            <span>{statusConfig.label}</span>
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
              {isReady && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleMenu?.(null);
                    if (onPreview) onPreview(story);
                    else onClick?.(story);
                  }}
                  className="ktab-child-story-card__menu-item"
                >
                  <span>قراءة القصة</span>
                  <BookOpen size={13} strokeWidth={2.2} />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onToggleMenu?.(null);
                  if (onDetails) onDetails(story);
                  else onClick?.(story);
                }}
                className="ktab-child-story-card__menu-item"
              >
                <span>تفاصيل ومتابعة</span>
                <FileText size={13} strokeWidth={2.2} />
              </button>

              {isReady && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleMenu?.(null);
                    onConvertToPdf?.(story);
                  }}
                  className="ktab-child-story-card__menu-item"
                >
                  <span>تحميل PDF</span>
                  <FileDown size={13} strokeWidth={2.2} />
                </button>
              )}

              {isInProgress && onCancel && (
                <>
                  <div className="ktab-child-story-card__menu-divider" />
                  <button
                    type="button"
                    onClick={() => {
                      onToggleMenu?.(null);
                      onCancel?.(story);
                    }}
                    className="ktab-child-story-card__menu-item ktab-child-story-card__menu-item--danger"
                  >
                    <span>إلغاء التوليد</span>
                    <Ban size={13} strokeWidth={2.2} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editorial Card Body */}
      <div className="ktab-child-story-card__body">
        <h4 className="ktab-child-story-card__title" title={displayTitle}>
          {displayTitle}
        </h4>
        <div className="ktab-child-story-card__meta">
          {displayChild && (
            <span className="ktab-child-story-card__author">
              البطل: {displayChild}
            </span>
          )}
          {pageCount > 0 && (
            <>
              {displayChild && <span className="ktab-child-story-card__bullet">•</span>}
              <span className="ktab-child-story-card__detail">
                {pageCount} صفحة
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
});

export default StoryBookCard;
