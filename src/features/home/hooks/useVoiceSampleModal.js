import { useState, useMemo, useRef, useEffect, useCallback } from "react";

/**
 * Dedicated custom hook managing VoiceSampleModal state, sentence-by-sentence
 * chunked read-along highlighting, auto-scroll, and scrubber click calculations.
 * Adheres to the strict zero-business-logic in JSX architecture standard.
 */
export function useVoiceSampleModal({ book, progress = 0, onSeek }) {
  const [isPillMode, setIsPillMode] = useState(false);
  const activeSentenceRef = useRef(null);

  // Split excerpt into natural sentence/clause chunks so highlights advance briskly and naturally
  const sentences = useMemo(() => {
    if (!book?.firstPageExcerpt) return [];
    const raw = book.firstPageExcerpt.trim();
    // Split by Arabic sentence & clause punctuation (. or ؟ or ! or ،)
    const matches = raw.match(/[^.؟!،,]+[.؟!،,]+/g);
    if (matches && matches.length > 0) {
      return matches.map((s) => s.trim()).filter(Boolean);
    }
    return raw.split(/[.،؛]/).map((s) => s.trim()).filter(Boolean);
  }, [book?.firstPageExcerpt]);

  // Compute active sentence/clause index with responsive, faster pacing
  const activeSentenceIdx = useMemo(() => {
    if (!sentences.length || progress <= 0) return 0;
    return Math.min(
      sentences.length - 1,
      Math.max(0, Math.floor((progress / 100) * sentences.length))
    );
  }, [progress, sentences.length]);

  // Smoothly scroll active sentence into view inside the transcript container
  useEffect(() => {
    if (activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSentenceIdx]);

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
    sentences,
    activeSentenceIdx,
    activeSentenceRef,
    handleScrubberClick,
  };
}

export default useVoiceSampleModal;
