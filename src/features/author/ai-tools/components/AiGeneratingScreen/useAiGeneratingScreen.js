import { useState, useEffect } from "react";

export const GENERATION_STEPS = [
  {
    id: 1,
    label: "فهرسة فصول ومحتوى الـ PDF",
    threshold: 32,
  },
  {
    id: 2,
    label: "تحليل العقدة الدرامية وبنية الشخصيات",
    threshold: 68,
  },
  {
    id: 3,
    label: "صياغة النهاية الأدبية وفق الشريحة المحددة",
    threshold: 100,
  },
];

export const THINKING_PHRASES = [
  "جاري استخراج الفصول وتحليل محتوى المسودة...",
  "التفكير في الحبكة وتتبع مسار وتطور الشخصيات...",
  "تلخيص الأحداث واستنباط العقدة الروائية...",
  "صياغة الخاتمة المتناسقة مع أسلوب الكتاب...",
];

/**
 * Custom hook managing realistic AI progress progression, step states, and cycling thinking phrases.
 */
export function useAiGeneratingScreen() {
  const [progress, setProgress] = useState(12);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Smooth realistic progress progression
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94; // Hold near completion until backend responds
        // Progress faster initially, then slower for realistic feel
        const increment = prev < 40 ? 3 : prev < 75 ? 2 : 1;
        return Math.min(94, prev + increment);
      });
    }, 450);

    return () => clearInterval(progressInterval);
  }, []);

  // Rotate thinking phrases synchronized with progress
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
    }, 3200);

    return () => clearInterval(phraseInterval);
  }, []);

  const currentPhrase = THINKING_PHRASES[phraseIndex];

  return {
    progress,
    currentPhrase,
    steps: GENERATION_STEPS,
  };
}

export default useAiGeneratingScreen;
