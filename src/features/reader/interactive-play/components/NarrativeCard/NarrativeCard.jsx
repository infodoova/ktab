import React from "react";
import "./NarrativeCard.css";

/**
 * Editorial Manuscript Scroll Card displaying high-contrast story prose.
 * Features an authentic open parchment scroll finish with curled ends.
 *
 * @param {string} text - Scene narrative text
 * @param {boolean} showRetry - Whether to show retry banner
 * @param {() => void} onRetry - Retry callback
 */
export function NarrativeCard({ text, showRetry, onRetry, isGenerating = false }) {
  const isLoading = isGenerating || !text;

  return (
    <section className="ktab-narrative-card" aria-label="أحداث المشهد">
      <div className="ktab-narrative-card__body">
        {isLoading ? (
          <div className="ktab-narrative-card__skeleton" aria-label="جاري كتابة أحداث المشهد">
            <div className="ktab-narrative-card__skeleton-header">
              <span className="ktab-narrative-card__skeleton-dot" aria-hidden="true" />
              <span className="ktab-narrative-card__skeleton-hint">
                جاري تدوين وقائع المشهد...
              </span>
            </div>
            <div className="ktab-narrative-card__skeleton-line" style={{ width: "96%" }} />
            <div className="ktab-narrative-card__skeleton-line" style={{ width: "88%" }} />
            <div className="ktab-narrative-card__skeleton-line" style={{ width: "92%" }} />
            <div className="ktab-narrative-card__skeleton-line" style={{ width: "65%" }} />
          </div>
        ) : (
          <div className="ktab-narrative-card__content">
            <p className="ktab-narrative-card__text">{text}</p>
          </div>
        )}
      </div>

      {showRetry && (
        <div className="ktab-narrative-card__retry-banner">
          <span className="ktab-narrative-card__retry-text">
            تعذر توليد المشهد التالي بسبب انقطاع مؤقت في الاتصال.
          </span>
          <button
            type="button"
            className="ktab-narrative-card__retry-btn"
            disabled={isGenerating}
            onClick={onRetry}
          >
            إعادة المحاولة
          </button>
        </div>
      )}
    </section>
  );
}

export default NarrativeCard;
