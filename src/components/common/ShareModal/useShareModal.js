import { useState, useCallback, useMemo } from "react";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing industry-standard sharing state, short link generation,
 * clipboard feedback, and external app share intents.
 */
export function useShareModal({
  isOpen,
  onClose,
  url = "",
  bookId,
  bookTitle = "",
  authorName = "",
  page = null,
  customText = "",
} = {}) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  // Generates concise short link matching /share?b={id} or uses provided url
  const shortUrl = useMemo(() => {
    if (url) return url;
    if (!bookId) {
      return typeof window !== "undefined" ? window.location.href : "";
    }
    return page
      ? `${origin}/share?b=${encodeURIComponent(bookId)}&p=${encodeURIComponent(page)}`
      : `${origin}/share?b=${encodeURIComponent(bookId)}`;
  }, [origin, url, bookId, page]);

  const shareText = useMemo(() => {
    if (customText) return customText;
    const titlePart = bookTitle ? `كتاب "${bookTitle}"` : "هذا العمل";
    const authorPart = authorName ? ` للكاتب ${authorName}` : "";
    return `استكشف ${titlePart}${authorPart} على تطبيق كِتَاب:`;
  }, [customText, bookTitle, authorName]);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shortUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      AlertToast("تم نسخ الرابط المختصر إلى الحافظة بنجاح", "SUCCESS");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      AlertToast("تعذر نسخ الرابط تلقائياً", "ERROR");
    }
  }, [shortUrl]);

  const handleShareWhatsApp = useCallback(() => {
    const fullMsg = `${shareText}\n${shortUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullMsg)}`, "_blank", "noopener,noreferrer");
  }, [shareText, shortUrl]);

  const handleShareTelegram = useCallback(() => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  }, [shareText, shortUrl]);

  const handleShareTwitter = useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shortUrl)}`, "_blank", "noopener,noreferrer");
  }, [shareText, shortUrl]);

  const handleShareFacebook = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`, "_blank", "noopener,noreferrer");
  }, [shortUrl]);

  const handleShareEmail = useCallback(() => {
    const subject = bookTitle ? `ترشيح قراءة: ${bookTitle}` : "مشاركة كتاب من تطبيق كِتَاب";
    const body = `${shareText}\n\n${shortUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  }, [bookTitle, shareText, shortUrl]);

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: bookTitle ? `كتاب: ${bookTitle}` : "تطبيق كِتَاب",
        text: shareText,
        url: shortUrl,
      });
    } catch (err) {
      // AbortError is user cancellation; ignore silently
      if (err.name !== "AbortError") {
        AlertToast("تعذرت المشاركة المباشرة", "WARNING");
      }
    }
  }, [canNativeShare, bookTitle, shareText, shortUrl]);

  return {
    shortUrl,
    shareText,
    copied,
    canNativeShare,
    handleCopy,
    handleShareWhatsApp,
    handleShareTelegram,
    handleShareTwitter,
    handleShareFacebook,
    handleShareEmail,
    handleNativeShare,
  };
}

export default useShareModal;
