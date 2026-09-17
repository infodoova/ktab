import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Calendar,
  Languages,
  Eye,
  Trash2,
  Edit,
  Sparkles,
  Layers,
  Compass,
} from "lucide-react";
import brandIconImg from "@/assets/logo/BrandIcon.png";
import { useStoryEditorModal } from "./useStoryEditorModal";
import "./StoryEditorModal.css";

/**
 * Pure presentation StoryEditorModal component.
 * Uses useStoryEditorModal for state, animations, and narrative structure.
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

  return (
    <AnimatePresence>
      {isOpen && story && (
        <div
          className="ktab-story-drawer-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-drawer-title"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ktab-story-drawer-backdrop-overlay"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.98 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
              mass: 0.8,
            }}
            className="ktab-story-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="ktab-story-drawer__header">
              <h3 id="story-drawer-title" className="ktab-story-drawer__title">
                تفاصيل القصة التفاعلية
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="ktab-story-drawer__close-btn"
                aria-label="إغلاق"
                title="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="ktab-story-drawer__body">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default StoryEditorModal;
