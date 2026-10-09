import { useState, useCallback } from "react";

/**
 * Dedicated custom hook managing VoiceSampleModal state, sentence-by-sentence
 * chunked read-along highlighting, auto-scroll, and scrubber click calculations.
 * Adheres to the strict zero-business-logic in JSX architecture standard.
 */
export function useVoiceSampleModal({ onSeek }) {
  const [isPillMode, setIsPillMode] = useState(false);

  // Handle click seeking on the RTL audio scrubber bar
  const handleScrubberClick = useCallback(
    (e) => {
      if (!onSeek) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickFromRight = rect.right - e.clientX;
      const percent = Math.max(
        0,
        Math.min(100, (clickFromRight / rect.width) * 100)
      );
      onSeek(percent);
    },
    [onSeek]
  );

  return {
    isPillMode,
    setIsPillMode,
    handleScrubberClick,
  };
}

export default useVoiceSampleModal;
