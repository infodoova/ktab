import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw, Check } from "lucide-react";
import { useStoryFilterModal } from "./useStoryFilterModal";
import "./StoryFilterModal.css";

/**
 * Editorial Apple Books-inspired Story Filter Modal.
 * Renders Genre & Lens filters with smooth animations and zero inline JS.
 */
export const StoryFilterModal = memo(function StoryFilterModal({
  isOpen,
  selectedGenre,
  selectedLens,
  onApply,
  onReset,
  onClose,
}) {
  const {
    draftGenre,
    draftLens,
    isMobile,
    genres,
    lenses,
    handleGenreSelect,
    handleLensSelect,
    handleApplyClick,
    handleResetClick,
  } = useStoryFilterModal({
    isOpen,
    selectedGenre,
    selectedLens,
    onApply,
    onReset,
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ktab-story-filter-backdrop" onClick={onClose}>
          <motion.div
            className={`ktab-story-filter-dialog ${
              isMobile
                ? "ktab-story-filter-dialog--mobile"
                : "ktab-story-filter-dialog--desktop"
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="تصفية القصص التفاعلية"
            dir="rtl"
            {...(isMobile
              ? {
                  initial: { y: "100%" },
                  animate: { y: 0 },
                  exit: { y: "100%" },
                  transition: { type: "spring", damping: 28, stiffness: 340 },
                }
              : {
                  initial: { opacity: 0, scale: 0.95, y: 12 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.95, y: 12 },
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                })}
          >
            {/* Mobile Sheet Handle */}
            {isMobile && (
              <div className="ktab-story-filter-handle" aria-hidden="true" />
            )}

            {/* Header */}
            <div className="ktab-story-filter-header">
              <div className="ktab-story-filter-title-wrap">
                <div className="ktab-story-filter-badge">
                  <SlidersHorizontal size={16} strokeWidth={2.2} />
                </div>
                <h3 className="ktab-story-filter-title">تصفية القصص التفاعلية</h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="ktab-story-filter-close-btn"
                aria-label="إغلاق"
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </div>

            {/* Body */}
            <div className="ktab-story-filter-body">
              {/* 1. Genre Selection Group */}
              <div className="ktab-story-filter-section">
                <label className="ktab-story-filter-label">التصنيف الأدبي</label>
                <div className="ktab-story-filter-chips">
                  {genres.map((g) => {
                    const isSelected = draftGenre === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleGenreSelect(g.id)}
                        className={`ktab-story-filter-chip ${
                          isSelected ? "ktab-story-filter-chip--active" : ""
                        }`}
                      >
                        <span>{g.label}</span>
                        {isSelected && <Check size={13} strokeWidth={2.6} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Story Lens Selection Group */}
              <div className="ktab-story-filter-section">
                <label className="ktab-story-filter-label">منظور الصراع والقصة (Lens)</label>
                <div className="ktab-story-filter-chips">
                  {lenses.map((l) => {
                    const isSelected = draftLens === l.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => handleLensSelect(l.id)}
                        className={`ktab-story-filter-chip ${
                          isSelected ? "ktab-story-filter-chip--active" : ""
                        }`}
                      >
                        <span>{l.label}</span>
                        {isSelected && <Check size={13} strokeWidth={2.6} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="ktab-story-filter-footer">
              <button
                type="button"
                onClick={handleResetClick}
                className="ktab-story-filter-btn-reset"
              >
                <RotateCcw size={14} strokeWidth={2} />
                <span>إعادة ضبط</span>
              </button>

              <button
                type="button"
                onClick={handleApplyClick}
                className="ktab-story-filter-btn-apply"
              >
                تطبيق التصفية
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default StoryFilterModal;
