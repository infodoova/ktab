import { useState, useMemo, useCallback } from "react";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating copy-to-clipboard interactions,
 * word count metrics, and automatic script direction detection (RTL / LTR).
 */
export function useSummaryPanel({ summary = "" }) {
  const [copied, setCopied] = useState(false);

  // Automatically detect script direction based on Arabic Unicode range
  const textDirection = useMemo(() => {
    if (!summary) return "rtl";
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(summary) ? "rtl" : "ltr";
  }, [summary]);

  const wordCount = useMemo(() => {
    if (!summary) return 0;
    return summary.trim().split(/\s+/).filter(Boolean).length;
  }, [summary]);

  const readingTimeMinutes = useMemo(() => {
    if (!wordCount) return 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const handleCopy = useCallback(() => {
    if (!summary) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          AlertToast("تم نسخ الخاتمة إلى الحافظة بنجاح", "SUCCESS");
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          AlertToast("تعذر نسخ النص، يرجى المحاولة يدوياً", "ERROR");
        });
    }
  }, [summary]);

  return {
    copied,
    wordCount,
    readingTimeMinutes,
    textDirection,
    handleCopy,
  };
}

export default useSummaryPanel;


