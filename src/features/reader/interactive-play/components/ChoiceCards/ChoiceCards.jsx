import React from "react";
import "./ChoiceCards.css";

/**
 * Decision choice cards grid (A, B, C, D).
 * Renders a generating skeleton when isGenerating is true.
 *
 * @param {Array} nodes - Choice nodes array [{nodeId, nodeText}]
 * @param {(node) => void} onNodeClick - Click handler for choice selection
 * @param {boolean} disabled - Whether interaction is disabled
 * @param {string|null} chosenNodeId - ID of the already-chosen node
 * @param {boolean} isGenerating - Whether a new scene is being generated
 */
export function ChoiceCards({
  nodes = [],
  onNodeClick,
  disabled = false,
  chosenNodeId = null,
  isGenerating = false,
}) {
  if (isGenerating) {
    return (
      <div className="choice-cards">
        <div className="choice-cards__generating">
          <div className="choice-cards__generating-dots">
            <span className="choice-cards__generating-dot" />
            <span className="choice-cards__generating-dot" />
            <span className="choice-cards__generating-dot" />
          </div>
          <p className="choice-cards__generating-text">
            يرسم الذكاء الاصطناعي ملامح طريقك...
          </p>
          <div className="choice-cards__generating-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="choice-cards__generating-card">
                <div className="choice-cards__generating-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!nodes.length) return null;

  return (
    <div className="choice-cards">
      <div className="choice-cards__label">
        {chosenNodeId ? "مسارك الذي اخترته:" : "اختر مسارك:"}
      </div>

      <div className="choice-cards__grid">
        {nodes.map((node) => {
          const isSelected = chosenNodeId === node.nodeId;
          const isFaded = chosenNodeId && !isSelected;

          return (
            <button
              key={node.nodeId}
              disabled={disabled || Boolean(chosenNodeId)}
              onClick={() => onNodeClick?.(node)}
              className={[
                "choice-card",
                isSelected && "choice-card--selected",
                isFaded && "choice-card--faded",
                (disabled || chosenNodeId) && "choice-card--disabled",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="choice-card__key">{node.nodeId}</span>
              <span className="choice-card__text">{node.nodeText}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChoiceCards;
