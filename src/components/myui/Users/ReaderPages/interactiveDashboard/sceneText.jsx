import React, { useState, useEffect, useRef } from "react";

function SceneText({ text, sceneNumber = 0, isDarkMode = true }) {
  const [displayedText, setDisplayedText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    setDisplayedText("");
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className="relative w-full text-right" dir="rtl">
      {/* Scene number */}
      <div
        className={`mb-2 md:mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border ${isDarkMode ? "bg-[var(--earth-olive)]/10 border-[var(--earth-olive)]/20" : "bg-[var(--earth-olive)]/10 border-[var(--earth-olive)]/20"}`}
      >
        <span className="w-1.5 h-1.5 bg-[var(--earth-olive)] rounded-full animate-pulse" />
        <span className="text-[10px] md:text-xs font-bold text-[var(--earth-olive)] uppercase tracking-[0.2em]">
          المشهد {sceneNumber}
        </span>
      </div>

      {/* Text container */}
      <div
        ref={scrollRef}
        className={`
          max-h-[7.2em] md:max-h-[8em]
          overflow-y-auto
          custom-scrollbar
          leading-[1.8] md:leading-[2]
          text-base md:text-xl
          font-medium
          text-right
          whitespace-pre-wrap
          pr-2
          transition-colors duration-500
          ${isDarkMode ? "text-white/90" : "text-[var(--earth-brown-dark)]"}
        `}
      >
        {displayedText}
      </div>
    </div>
  );
}

export default SceneText;
