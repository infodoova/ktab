import React from "react";
import { Check, ChevronLeft } from "lucide-react";
import "./ChoiceCards.css";

/**
 * Decision choice cards grid (A, B, C, D).
 * Features glassy, responsive cards with instant tactile feedback.
 */
export function ChoiceCards({
  nodes = [],
  onNodeClick,
  disabled = false,
  chosenNodeId = null,
  isGenerating = false,
}) {
  const showSkeleton = isGenerating || !nodes.length;
  const isLocked = disabled || Boolean(chosenNodeId) || isGenerating;

  let headerLabel = "اختر مسارك التالي";
  if (isGenerating) {
    headerLabel = "جاري إعداد الخيارات...";
  } else if (chosenNodeId) {
    headerLabel = "مسارك المختار";
  } else if (disabled) {
    headerLabel = "مشهد سابق (للقراءة فقط)";
  }

  return (
    <div
      className={`ktab-choice-cards ${isLocked ? "ktab-choice-cards--locked" : ""}`}
      dir="rtl"
    >
      <div className="ktab-choice-cards__header">
        <span className="ktab-choice-cards__label">{headerLabel}</span>
        {isGenerating && (
          <span className="ktab-choice-cards__generating-pill">
            جاري توليد الخيارات القادمة...
          </span>
        )}
      </div>

      <div className="ktab-choice-cards__grid">
        {showSkeleton ? (
          ["1", "2", "3", "4"].map((num) => (
            <div
              key={num}
              className="ktab-choice-card ktab-choice-card--skeleton"
              aria-hidden="true"
            >
              <div className="ktab-choice-card__badge ktab-choice-card__badge--skeleton">
                {num}
              </div>
              <div className="ktab-choice-card__skeleton-content">
                <div className="ktab-choice-card__skeleton-bar" />
                <div className="ktab-choice-card__skeleton-sub-bar" />
              </div>
            </div>
          ))
        ) : (
          nodes.map((node, index) => {
            const isSelected = chosenNodeId === node.nodeId;
            const isFaded = Boolean(chosenNodeId) && !isSelected;
            const choiceNumber = index + 1;

            return (
              <button
                key={node.nodeId || index}
                type="button"
                disabled={isLocked}
                aria-disabled={isLocked}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  onNodeClick?.(node);
                }}
                className={[
                  "ktab-choice-card",
                  isSelected && "ktab-choice-card--selected",
                  isFaded && "ktab-choice-card--faded",
                  isLocked && "ktab-choice-card--disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="ktab-choice-card__badge">
                  {isSelected ? <Check size={14} strokeWidth={2.8} /> : choiceNumber}
                </div>
                <span className="ktab-choice-card__text">{node.nodeText}</span>
                <span className="ktab-choice-card__arrow" aria-hidden="true">
                  <ChevronLeft size={16} />
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChoiceCards;
