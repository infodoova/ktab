import React, { useState, useEffect } from "react";

/**
 * SceneText Component
 * Displays the scene narrative text with beautiful typography and animations
 * Pure presentation component - all logic in mainComp
 */
function SceneText({ text, sceneNumber = 0 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText("");
    setIsAnimating(true);

    // Typewriter effect
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsAnimating(false);
        clearInterval(intervalId);
      }
    }, 20); // Speed of typewriter effect

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="mb-1 md:mb-2 relative">
      {/* Main card - Very compact */}
      <div className="relative glass rounded-lg p-3 md:p-4 shadow-sm border border-[var(--earth-sand)]/20">
        {/* Scene number badge - Subtle */}
        <div className="absolute -top-1.5 left-2 bg-[var(--earth-olive)] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm">
          #{sceneNumber + 1}
        </div>

        {/* Text content - Optimized for vertical space */}
        <div className="relative pt-2" dir="rtl">
          <p className="text-[var(--earth-brown-dark)] text-xs md:text-sm leading-relaxed font-semibold">
            {displayedText}
            {isAnimating && (
              <span className="inline-block w-0.5 h-3 bg-[var(--earth-brown-dark)] ml-1 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SceneText;
