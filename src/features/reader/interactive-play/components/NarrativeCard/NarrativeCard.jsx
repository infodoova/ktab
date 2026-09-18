import React, { useState, useEffect, useRef } from "react";
import "./NarrativeCard.css";

/**
 * Narrative text card with typewriter effect and scene number indicator.
 * Also renders an inline retry banner when a choice submission fails.
 *
 * @param {string} text - Scene narrative text to display
 * @param {number} sceneNumber - Current scene number
 * @param {boolean} showRetry - Whether to show the retry banner
 * @param {() => void} onRetry - Retry handler for failed choice submissions
 */
export function NarrativeCard({ text, sceneNumber, showRetry, onRetry }) {
  const [displayedText, setDisplayedText] = useState("");
  const scrollRef = useRef(null);

  /* Typewriter: reveal text character-by-character */
  useEffect(() => {
    setDisplayedText("");
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [text]);

  /* Auto-scroll to bottom as text reveals */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className="narrative-card">
      <div className="narrative-card__scene-tag">
        <span className="narrative-card__scene-dot" />
        <span className="narrative-card__scene-label">
          المشهد {sceneNumber}
        </span>
      </div>

      <div ref={scrollRef} className="narrative-card__text-area">
        {displayedText}
      </div>

      {showRetry && (
        <div className="narrative-card__retry-banner">
          <span className="narrative-card__retry-text">
            تعذر توليد المشهد التالي بسبب انقطاع الاتصال.
          </span>
          <button className="narrative-card__retry-btn" onClick={onRetry}>
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
}

export default NarrativeCard;
