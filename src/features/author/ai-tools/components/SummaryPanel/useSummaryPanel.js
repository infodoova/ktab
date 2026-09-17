import { useState, useCallback } from "react";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating copy-to-clipboard interactions and visual feedback.
 */
export function useSummaryPanel({ summary = "" }) {
  const [copied, setCopied] = useState(false);

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
    handleCopy,
  };
}
