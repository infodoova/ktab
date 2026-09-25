import React from "react";
import {
  MoveUp,
  MoveDown,
  ArrowLeft,
  ArrowRight,
  Hand,
  Sparkles,
  X,
  Layers,
} from "lucide-react";
import { useFlipTutorial } from "../../hooks/useFlipTutorial";
import "./FlipTutorial.css";

/**
 * Editorial Animated Gesture Tutorial Overlay.
 * Appears dynamically when the user changes page transition style.
 * Displays high-contrast animated hand gestures, directional arrows,
 * and clear navigation guidance adapted to the active reader theme.
 */
export function FlipTutorial({ transitionMode, theme = "pure-white", onClose }) {
  const { isVisible, isExiting, dismiss, config, durationMs } = useFlipTutorial({
    transitionMode,
    autoDismissMs: 3800,
  });

  const handleManualClose = (e) => {
    e.stopPropagation();
    dismiss();
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <aside
      className={`ktab-flip-tutorial-wrap ${
        isExiting ? "ktab-flip-tutorial-wrap--exiting" : ""
      }`}
      onClick={handleManualClose}
      aria-live="polite"
      role="region"
      aria-label="دليل التنقل بين الصفحات"
      dir="rtl"
    >
      <div
        className={`ktab-flip-tutorial-card ktab-flip-tutorial-card--theme-${theme}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Mode Name & Dismiss Action */}
        <div className="ktab-flip-tutorial__header">
          <div className="ktab-flip-tutorial__title-box">
            <div className="ktab-flip-tutorial__icon-halo">
              <Sparkles size={16} strokeWidth={2.4} />
            </div>
            <div className="flex flex-col">
              <span className="ktab-flip-tutorial__title">{config.title}</span>
              <span className="ktab-flip-tutorial__badge">{config.badge}</span>
            </div>
          </div>

          <button
            type="button"
            className="ktab-flip-tutorial__close-btn"
            onClick={handleManualClose}
            aria-label="إغلاق التلميح"
            title="إغلاق"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>

        {/* Dynamic Animated Gesture Stage */}
        <div className="ktab-flip-tutorial__stage">
          {config.type === "vertical" && (
            <div className="ktab-gesture-flow ktab-gesture-flow--vertical">
              {/* Swipe Up: Next Page */}
              <div className="ktab-gesture-item">
                <div className="ktab-gesture-anim ktab-gesture-anim--swipe-up">
                  <div className="ktab-gesture-hand ktab-gesture-hand--up">
                    <Hand size={22} strokeWidth={2.2} />
                  </div>
                  <div className="ktab-gesture-arrow ktab-gesture-arrow--up">
                    <MoveUp size={18} strokeWidth={2.6} />
                  </div>
                </div>
                <div className="ktab-gesture-info">
                  <span className="ktab-gesture-action">{config.nextLabel}</span>
                  <span className="ktab-gesture-sub">{config.nextSub}</span>
                </div>
              </div>

              <div className="ktab-gesture-divider" aria-hidden="true" />

              {/* Swipe Down: Previous Page */}
              <div className="ktab-gesture-item">
                <div className="ktab-gesture-anim ktab-gesture-anim--swipe-down">
                  <div className="ktab-gesture-hand ktab-gesture-hand--down">
                    <Hand size={22} strokeWidth={2.2} />
                  </div>
                  <div className="ktab-gesture-arrow ktab-gesture-arrow--down">
                    <MoveDown size={18} strokeWidth={2.6} />
                  </div>
                </div>
                <div className="ktab-gesture-info">
                  <span className="ktab-gesture-action">{config.prevLabel}</span>
                  <span className="ktab-gesture-sub">{config.prevSub}</span>
                </div>
              </div>
            </div>
          )}

          {config.type === "horizontal" && (
            <div className="ktab-gesture-flow ktab-gesture-flow--horizontal">
              {/* Swipe Left in RTL: Next Page */}
              <div className="ktab-gesture-item">
                <div className="ktab-gesture-anim ktab-gesture-anim--swipe-left">
                  <div className="ktab-gesture-hand ktab-gesture-hand--left">
                    <Hand size={22} strokeWidth={2.2} />
                  </div>
                  <div className="ktab-gesture-arrow ktab-gesture-arrow--left">
                    <ArrowLeft size={18} strokeWidth={2.6} />
                  </div>
                </div>
                <div className="ktab-gesture-info">
                  <span className="ktab-gesture-action">{config.nextLabel}</span>
                  <span className="ktab-gesture-sub">{config.nextSub}</span>
                </div>
              </div>

              <div className="ktab-gesture-divider" aria-hidden="true" />

              {/* Swipe Right in RTL: Previous Page */}
              <div className="ktab-gesture-item">
                <div className="ktab-gesture-anim ktab-gesture-anim--swipe-right">
                  <div className="ktab-gesture-hand ktab-gesture-hand--right">
                    <Hand size={22} strokeWidth={2.2} />
                  </div>
                  <div className="ktab-gesture-arrow ktab-gesture-arrow--right">
                    <ArrowRight size={18} strokeWidth={2.6} />
                  </div>
                </div>
                <div className="ktab-gesture-info">
                  <span className="ktab-gesture-action">{config.prevLabel}</span>
                  <span className="ktab-gesture-sub">{config.prevSub}</span>
                </div>
              </div>
            </div>
          )}

          {config.type === "curl" && (
            <div className="ktab-gesture-flow ktab-gesture-flow--curl">
              {/* Tap & Drag Corner */}
              <div className="ktab-gesture-item">
                <div className="ktab-gesture-anim ktab-gesture-anim--curl">
                  <div className="ktab-gesture-ripple" />
                  <div className="ktab-gesture-hand ktab-gesture-hand--tap">
                    <Hand size={22} strokeWidth={2.2} />
                  </div>
                  <div className="ktab-gesture-corner-crease" />
                </div>
                <div className="ktab-gesture-info">
                  <span className="ktab-gesture-action">{config.nextLabel}</span>
                  <span className="ktab-gesture-sub">{config.nextSub}</span>
                </div>
              </div>

              <div className="ktab-gesture-divider" aria-hidden="true" />

              {/* Opposite edge tap */}
              <div className="ktab-gesture-item">
                <div className="ktab-gesture-anim ktab-gesture-anim--curl-prev">
                  <div className="ktab-gesture-ripple ktab-gesture-ripple--delayed" />
                  <div className="ktab-gesture-hand ktab-gesture-hand--tap-prev">
                    <Hand size={22} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="ktab-gesture-info">
                  <span className="ktab-gesture-action">{config.prevLabel}</span>
                  <span className="ktab-gesture-sub">{config.prevSub}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Tap hint & Dismiss Button */}
        <div className="ktab-flip-tutorial__footer">
          <span className="ktab-flip-tutorial__hint">{config.tapHint}</span>
          <button
            type="button"
            className="ktab-flip-tutorial__action-btn"
            onClick={handleManualClose}
          >
            فهمت
          </button>
        </div>

        {/* Timed progress indicator */}
        <div
          className="ktab-flip-tutorial__progress"
          style={{ animationDuration: `${durationMs}ms` }}
        />
      </div>
    </aside>
  );
}

export default FlipTutorial;
