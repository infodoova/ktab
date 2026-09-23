import React from "react";
import { Play } from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { useStoryDetailsModal } from "./useStoryDetailsModal";
import "./StoryDetailsModal.css";

/**
 * Reader Interactive Story Preview Drawer.
 * Built with standard DetailsDrawer: slide-over on desktop, true sheet modal on mobile.
 */
export function StoryDetailsModal({
  isOpen,
  onClose,
  story,
  onStartSession,
}) {
  const {
    coverUrl,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    title,
    genreLabel,
    author,
    lensLabel,
    styleLabel,
    scenes,
    synopsis,
    handleStart,
  } = useStoryDetailsModal({ isOpen, onClose, story, onStartSession });

  const footer = (
    <div className="ktab-story-drawer__footer-inner">
      <button
        type="button"
        onClick={handleStart}
        className="ktab-story-drawer__start-btn"
        id="btn-start-interactive-story"
      >
        <Play size={16} fill="currentColor" />
        <span>ابدأ المغامرة التفاعلية</span>
      </button>
    </div>
  );

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل القصة التفاعلية"
      footer={footer}
      width="520px"
      className="ktab-story-details-drawer"
    >
      {/* Hero Story Info */}
      <div className="ktab-story-drawer__hero">
        <div className="ktab-story-drawer__cover-wrap">
          {!hasCoverError && coverUrl ? (
            <>
              {!coverLoaded && <div className="ktab-story-drawer__cover-shimmer" />}
              <img
                src={coverUrl}
                alt={title}
                onLoad={handleCoverLoad}
                onError={handleCoverError}
                className={`ktab-story-drawer__cover-img ${
                  coverLoaded
                    ? "ktab-story-drawer__cover-img--loaded"
                    : "ktab-story-drawer__cover-img--loading"
                }`}
              />
            </>
          ) : (
            <div className="ktab-story-drawer__cover-fallback">
              <img
                src={brandIconImg}
                alt=""
                className="ktab-story-drawer__fallback-logo"
              />
            </div>
          )}
        </div>

        <div className="ktab-story-drawer__info">
          <h2 className="ktab-story-drawer__story-title" title={title}>
            {title}
          </h2>
          <p className="ktab-story-drawer__author-genre">
            <span>{author}</span>
            <span className="ktab-story-drawer__meta-dot">•</span>
            <span>{genreLabel}</span>
          </p>
          <div className="ktab-story-drawer__tags">
            {lensLabel && (
              <span className="ktab-story-drawer__tag">{lensLabel}</span>
            )}
            {styleLabel && (
              <span className="ktab-story-drawer__tag">{styleLabel}</span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="ktab-story-drawer__metrics">
        <div className="ktab-story-drawer__metric-card">
          <div className="ktab-story-drawer__metric-content">
            <span className="ktab-story-drawer__metric-label">عدد المشاهد</span>
            <span className="ktab-story-drawer__metric-value">{scenes} مشاهد</span>
          </div>
        </div>

        <div className="ktab-story-drawer__metric-card">
          <div className="ktab-story-drawer__metric-content">
            <span className="ktab-story-drawer__metric-label">النمط البصري</span>
            <span className="ktab-story-drawer__metric-value">
              {styleLabel || "سينمائي"}
            </span>
          </div>
        </div>
      </div>

      {/* Brief Story Synopsis / Editorial Overview */}
      {synopsis && (
        <div className="ktab-story-drawer__section">
          <h4 className="ktab-story-drawer__section-title">نبذة عن القصة</h4>
          <div className="ktab-story-drawer__synopsis-box">
            <p className="ktab-story-drawer__synopsis-text">{synopsis}</p>
          </div>
        </div>
      )}
    </DetailsDrawer>
  );
}

export default StoryDetailsModal;
