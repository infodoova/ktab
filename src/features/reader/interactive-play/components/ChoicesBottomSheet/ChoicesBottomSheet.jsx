import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ChoiceCards } from "../ChoiceCards/ChoiceCards";
import "./ChoicesBottomSheet.css";

/**
 * Editorial Bottom Sheet Modal for interactive story choices on mobile & tablet devices.
 * Prevents choices from taking up permanent viewport space while reading, providing a
 * focused decision-making experience when the user is ready.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the bottom sheet is open
 * @param {() => void} props.onClose - Dismiss callback
 * @param {Array} props.nodes - Decision nodes (options A, B, C, D)
 * @param {(node: Object) => void} props.onNodeClick - Choice selection handler
 * @param {boolean} props.disabled - Whether choices are disabled (e.g., past scene)
 * @param {string|null} props.chosenNodeId - Currently selected node ID
 * @param {boolean} props.isGenerating - Whether scene is generating
 * @param {number|string} [props.sceneId] - Active scene identifier
 */
export function ChoicesBottomSheet({
  isOpen,
  onClose,
  nodes = [],
  onNodeClick,
  disabled = false,
  chosenNodeId = null,
  isGenerating = false,
  sceneId,
  isEnding = false,
  onRestart,
  onExit,
}) {
  /* Close on Escape key */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChoiceSelect = (node) => {
    if (disabled || isGenerating || Boolean(chosenNodeId)) return;
    onNodeClick?.(node);
    // Smooth delay allows tactile selected animation before sheet dismissal
    setTimeout(() => {
      onClose?.();
    }, 180);
  };

  return (
    <div
      className="ktab-choices-sheet__overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="خيارات المسار التالي"
      dir="rtl"
    >
      <div
        className="ktab-choices-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="ktab-choices-sheet__handle-wrap">
          <span className="ktab-choices-sheet__handle" aria-hidden="true" />
        </div>

        {/* Sheet Header */}
        <div className="ktab-choices-sheet__header">
          <div className="ktab-choices-sheet__title-group">
            <h3 className="ktab-choices-sheet__title">
              {isEnding ? "نهاية القصة" : "اختر مسارك التالي"}
            </h3>
            {isEnding ? (
              <span className="ktab-choices-sheet__subtitle">
                اكتملت جميع فصول الرواية التفاعلية
              </span>
            ) : sceneId ? (
              <span className="ktab-choices-sheet__subtitle">
                المشهد {sceneId} • حدد اتجاه القصة
              </span>
            ) : null}
          </div>

          <button
            type="button"
            className="ktab-choices-sheet__close-btn"
            onClick={onClose}
            aria-label="إغلاق خيارات المسار"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sheet Content: Full Choice Cards / Ending Card */}
        <div className="ktab-choices-sheet__content">
          <ChoiceCards
            nodes={nodes}
            onNodeClick={handleChoiceSelect}
            disabled={disabled}
            chosenNodeId={chosenNodeId}
            isGenerating={isGenerating}
            isEnding={isEnding}
            onRestart={() => {
              onClose?.();
              onRestart?.();
            }}
            onExit={() => {
              onClose?.();
              onExit?.();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChoicesBottomSheet;
