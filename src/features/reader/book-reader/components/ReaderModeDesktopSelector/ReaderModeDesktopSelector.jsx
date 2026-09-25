import React from "react";
import { Check, EyeOff } from "lucide-react";
import { TRANSITION_MODES } from "../../constants/readerConstants";
import { TransitionModeIcon } from "../TransitionModeIcon/TransitionModeIcon";
import "./ReaderModeDesktopSelector.css";

/**
 * Desktop Reader Transition Mode Selector.
 * Apple-inspired monochromatic design with large, professional 1:1 square cards.
 * Symmetrically positioned with generous breathing room from the book.
 * Allows instant dismissal/hiding if the reader prefers a completely clear view.
 */
export function ReaderModeDesktopSelector({
  currentMode = "curl",
  onSelectMode,
  theme = "pure-white",
  visible = true,
  onToggleVisibility,
}) {
  if (!visible) return null;

  return (
    <aside
      className={`ktab-reader-mode-desktop ktab-reader-mode-desktop--theme-${theme}`}
      aria-label="أنماط تقليب صفحات الكتاب"
      dir="rtl"
    >
      {/* Minimal Header with Dismiss / Hide Filter Button */}
      <div className="ktab-reader-mode-desktop__header">
        <div className="flex items-center justify-between w-full px-1">
          <span className="ktab-reader-mode-desktop__title">تقليب الصفحات</span>
          {onToggleVisibility && (
            <button
              type="button"
              className="ktab-reader-mode-hide-btn"
              onClick={onToggleVisibility}
              title="إخفاء محدد الأنماط"
              aria-label="إخفاء محدد الأنماط"
            >
              <EyeOff size={14} strokeWidth={2.2} />
            </button>
          )}
        </div>
        <span className="ktab-reader-mode-desktop__sub">أسلوب حركة الصفحات</span>
      </div>

      <div className="ktab-reader-mode-desktop__list">
        {TRANSITION_MODES.map((mode) => {
          const isSelected = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              className={`ktab-mode-square-card ${
                isSelected ? "ktab-mode-square-card--active" : ""
              }`}
              onClick={() => onSelectMode?.(mode.id)}
              title={mode.desc}
              aria-pressed={isSelected}
            >
              {/* Check Badge if Selected */}
              {isSelected && (
                <div className="ktab-mode-check-badge">
                  <Check size={13} strokeWidth={3.5} />
                </div>
              )}

              {/* Apple-Style Vector Icon */}
              <div className="ktab-mode-square-icon-slot">
                <TransitionModeIcon mode={mode.id} size={50} />
              </div>

              {/* Title & Subtitle Under Icon */}
              <div className="ktab-mode-square-label">
                <span className="ktab-mode-square-title">{mode.title}</span>
                <span className="ktab-mode-square-desc">
                  {mode.id === "curl"
                    ? "ثني باللمس"
                    : mode.id === "flip3d"
                    ? "حركة رأسية"
                    : "حركة أفقية"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default ReaderModeDesktopSelector;
