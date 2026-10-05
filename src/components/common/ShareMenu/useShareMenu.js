import { useState, useCallback } from "react";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing streamlined sharing:
 * - Mobile: Uses the device's native share sheet (default OS dialog).
 * - PC: Instant 1-click copy link to clipboard with visual checkmark and toast.
 */
export function useShareMenu({
  url = "",
  bookId = null,
  page = null,
  title = "",
  text = "",
  authorName = "",
} = {}) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Generates canonical direct link /reader/BookDetails/{id} or reader display page, or uses provided url
  const resolvedUrl = url
    ? url
    : bookId
      ? page
        ? `${origin}/reader/display/${encodeURIComponent(bookId)}?page=${encodeURIComponent(page)}`
        : `${origin}/reader/BookDetails/${encodeURIComponent(bookId)}`
      : typeof window !== "undefined"
        ? window.location.href
        : "";

  const resolvedText = text
    ? text
    : title
      ? `استكشف "${title}"${authorName ? ` للكاتب ${authorName}` : ""} على تطبيق كِتَاب:`
      : "تطبيق كِتَاب:";

  const resolvedTitle = title || "تطبيق كِتَاب";

  // Check if device is mobile where native share is the natural default
  const isMobileDevice = useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return false;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia ? window.matchMedia("(max-width: 768px)").matches : false;
    const isMobileUa = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || "");
    return (hasTouch && isSmallScreen) || isMobileUa;
  }, []);

  /**
   * Main Action Handler:
   * Mobile -> native system share sheet.
   * PC -> 1-click copy link directly to clipboard.
   */
  const handleAction = useCallback(
    async (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      // 1. Mobile Native Share Sheet (System Default)
      if (isMobileDevice() && typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: resolvedTitle,
            text: resolvedText,
            url: resolvedUrl,
          });
          return;
        } catch (err) {
          // If aborted by user, do nothing.
          if (err.name === "AbortError") return;
        }
      }

      // 2. PC: Direct 1-Click Copy Link
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(resolvedUrl);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = resolvedUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        AlertToast(bookId ? "تم نسخ رابط الكتاب بنجاح" : "تم نسخ الرابط بنجاح", "SUCCESS");
        setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        AlertToast("تعذر نسخ الرابط", "ERROR");
      }
    },
    [isMobileDevice, resolvedTitle, resolvedText, resolvedUrl, bookId]
  );

  return {
    copied,
    resolvedUrl,
    handleAction,
  };
}

export default useShareMenu;
