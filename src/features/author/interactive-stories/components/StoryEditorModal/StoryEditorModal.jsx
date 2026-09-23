import React from "react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { useStoryEditorModal } from "./useStoryEditorModal";
import "./StoryEditorModal.css";

/**
 * Author Interactive Story Editor/Details Drawer.
 * Built with standard DetailsDrawer: slide-over on desktop, true sheet modal on mobile.
 */
export function StoryEditorModal({ isOpen, onClose, story }) {
  const {
    coverUrl,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    genreLabel,
    lensLabel,
    styleLabel,
    scenes,
    constitutionEntries,
  } = useStoryEditorModal({ isOpen, onClose, story });

  if (!story) return null;

  return (
    <DetailsDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل القصة التفاعلية"
      width="520px"
      className="ktab-story-editor-drawer"
    >
      {/* Hero Story Info */}
      <div className="ktab-story-drawer__hero">
        <div className="ktab-story-drawer__cover-wrap">
          {!hasCoverError && coverUrl ? (
            <>
              {!coverLoaded && <div className="ktab-story-drawer__cover-shimmer" />}
              <img
                src={coverUrl}
                alt={story.title}
                onLoad={handleCoverLoad}
                onError={handleCoverError}
                className={`ktab-story-drawer__cover-img ${
                  coverLoaded
                    ? "ktab-story-drawer__cover-img--loaded"
                    : "ktab-story-drawer__cover-img--loading"
                }`}
                loading="lazy"
                decoding="async"
              />
            </>
          ) : (
            <div className="ktab-story-drawer__fallback-cover">
              <img
                src={brandIconImg}
                alt=""
                className="ktab-story-drawer__fallback-logo"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        <div className="ktab-story-drawer__info">
          <h4 className="ktab-story-drawer__story-title">{story.title}</h4>
          <p className="ktab-story-drawer__story-genre">
            {genreLabel}
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

      {/* Narrative Setup / Constitution */}
      {constitutionEntries.length > 0 && (
        <div className="ktab-story-drawer__section">
          <h4 className="ktab-story-drawer__section-title">تمهيد وحبكة القصة</h4>
          <div className="ktab-story-drawer__constitution-list">
            {constitutionEntries.map((item) => (
              <div key={item.key || item.label} className="ktab-story-drawer__constitution-item">
                <span className="ktab-story-drawer__constitution-label">{item.label}</span>
                <p className="ktab-story-drawer__constitution-box">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DetailsDrawer>
  );
}

export default StoryEditorModal;
