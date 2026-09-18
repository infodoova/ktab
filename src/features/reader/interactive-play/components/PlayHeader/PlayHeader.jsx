import React from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import "./PlayHeader.css";

/**
 * Sticky header for the interactive play view.
 * @param {string} title - Story title
 * @param {() => void} onBack - Back/exit handler
 * @param {() => void} onRestart - Restart session handler
 */
export function PlayHeader({ title, onBack, onRestart }) {
  return (
    <header className="play-header" dir="rtl">
      <div className="play-header__leading">
        <button
          className="play-header__back-btn"
          onClick={onBack}
          aria-label="الخروج"
        >
          <ArrowRight size={18} />
        </button>
        <div className="play-header__info">
          <h1 className="play-header__title">
            {title || "المغامرة التفاعلية"}
          </h1>
          <span className="play-header__session-tag">
            <span className="play-header__session-dot" />
            جلسة نشطة
          </span>
        </div>
      </div>

      <div className="play-header__trailing">
        <button
          className="play-header__restart-btn"
          onClick={onRestart}
          title="إعادة البدء من البداية"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}

export default PlayHeader;
