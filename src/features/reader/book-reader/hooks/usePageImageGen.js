import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  fetchImageFilters,
  triggerImageGeneration,
  pollImageGenerationStatus,
} from "../services/bookImageGenService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Validates whether an API response represents success.
 * Handles Spring Boot format: numeric statusCode, status string ("OK", "ACCEPTED"),
 * or boolean success flag.
 */
function isSuccessResponse(res, expectedCode = 200) {
  if (!res) return false;
  if (res.success === true) return true;
  if (res.statusCode === expectedCode) return true;
  if (res.status === expectedCode) return true;
  if (expectedCode === 200 && (res.status === "OK" || res.statusCode === 200)) return true;
  if (expectedCode === 202 && (res.status === "ACCEPTED" || res.statusCode === 202)) return true;
  return false;
}

/**
 * Safely triggers an in-browser download of a Blob by creating an ephemeral object URL.
 */
function triggerBlobDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

/**
 * Downloads image directly onto user's device as a file.
 * Prevents cross-origin navigation by converting to Blob with proxy fallback.
 */
async function downloadImageToDevice(imageUrl, filename = "ktab-illustration.png") {
  if (!imageUrl) return false;

  // 1. Direct Data or Blob URL
  if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  // 2. Direct simple fetch without custom auth headers (avoids S3 presigned CORS rejection)
  try {
    const res = await fetch(imageUrl, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // CORS restricted on direct origin, proceed to proxy
  }

  // 3. Edge proxy fetch with permissive CORS headers
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxyUrl, { method: "GET" });
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Proxy fetch failed, proceed to canvas fallback
  }

  // 4. Canvas extraction fallback via proxy
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = proxyUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob) {
      triggerBlobDownload(blob, filename);
      return true;
    }
  } catch {
    // Canvas extraction fallback failed
  }

  return false;
}

/**
 * Maximum character limit allowed for AI scene generation context.
 */
export const MAX_CONTEXT_CHARS = 2000;

/**
 * Minimal hook for AI page image generation.
 * Auto-combines text from current page ± 1 pages (3-page window)
 * and captures user text selection from the book canvas.
 *
 * @param {Object} params
 * @param {string|number} params.bookId
 * @param {string} params.bookTitle
 * @param {number} params.currentPage
 * @param {number} params.totalPages
 * @param {Object} params.bookRef - imperative ref exposing getPageText(p)
 * @param {boolean} params.isOpen
 */
export function usePageImageGen({
  bookId,
  bookTitle = "",
  currentPage = 1,
  totalPages = 1,
  bookRef,
  isOpen = false,
}) {
  // Dynamic Filters
  const [themes, setThemes] = useState([]);
  const [aspectRatios, setAspectRatios] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Context text: user must select text manually; never auto-populated
  const [contextText, setContextText] = useState("");
  const [isUserSelected, setIsUserSelected] = useState(false);

  // Filters selection
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("");

  // Generation lifecycle
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const pollTimerRef = useRef(null);

  const filtersFetchedRef = useRef(null);

  const minPage = Math.max(1, currentPage - 1);
  const maxPage = Math.min(totalPages, currentPage + 1);

  /**
   * Reads text from pages [P-1, P, P+1] to display as a selectable excerpt in the modal.
   * Does NOT auto-populate contextText; allows the user to highlight their desired scene manually.
   */
  const pagesExcerpt = useMemo(() => {
    if (!bookRef?.current?.getPageText) return "";

    const pages = [];
    for (let p = minPage; p <= maxPage; p++) {
      const txt = bookRef.current.getPageText(p);
      if (txt && txt.trim()) {
        pages.push(txt.trim());
      }
    }

    return pages.join("\n\n");
  }, [minPage, maxPage, bookRef, isOpen]);

  // Viewport collapse state for mobile & tablet (allows unobstructed reading and selection)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // When modal is opened on smaller screens, collapse into the floating dock
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    }
  }, [isOpen]);

  // When image generation completes, auto-expand so the user can inspect, download, or share
  useEffect(() => {
    if (activeJob?.status === "COMPLETED" && activeJob?.imageUrl) {
      setIsCollapsed(false);
    }
  }, [activeJob?.status, activeJob?.imageUrl]);

  // Reset user selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContextText("");
      setIsUserSelected(false);
      setActiveJob(null);
    }
  }, [isOpen]);

  /**
   * Resolves the CSS aspect-ratio value for the currently selected ratio.
   * Ensures the skeleton placeholder and result card match the exact dimensions.
   */
  const currentRatioCss = useMemo(() => {
    const item = aspectRatios.find(
      (r) => r.value === selectedAspectRatio || r.ratio === selectedAspectRatio
    );
    const raw = String(item?.ratio || item?.value || selectedAspectRatio || "3:4");

    if (raw.includes("1:1") || raw.includes("1_1") || raw.includes("SQUARE")) return "1 / 1";
    if (raw.includes("9:16") || raw.includes("9_16")) return "9 / 16";
    if (raw.includes("16:9") || raw.includes("16_9")) return "16 / 9";
    if (raw.includes("4:3") || raw.includes("4_3")) return "4 / 3";
    if (raw.includes("3:4") || raw.includes("3_4")) return "3 / 4";
    if (raw.includes("2:3") || raw.includes("2_3")) return "2 / 3";
    return "3 / 4";
  }, [selectedAspectRatio, aspectRatios]);

  const currentRatioLabel = useMemo(() => {
    const item = aspectRatios.find(
      (r) => r.value === selectedAspectRatio || r.ratio === selectedAspectRatio
    );
    return item?.ratio || item?.displayName || selectedAspectRatio || "3:4";
  }, [selectedAspectRatio, aspectRatios]);

  const handleResetJob = useCallback(() => {
    setActiveJob(null);
  }, []);

  /**
   * Captures text selected (highlighted) by the user.
   * Can originate either from the book page canvas or from the modal's excerpt reading card.
   * Constrained to MAX_CONTEXT_CHARS (2,000 characters).
   */
  useEffect(() => {
    if (!isOpen) return;

    // Check if user already had text highlighted on the book page prior to opening the modal
    const initialSel = window.getSelection();
    if (initialSel && !initialSel.isCollapsed) {
      let initialText = initialSel.toString().trim();
      initialText = initialText.replace(/الصفحة\s*\d+/g, "").trim();
      if (initialText && initialText.length >= 3) {
        if (initialText.length > MAX_CONTEXT_CHARS) {
          initialText = initialText.slice(0, MAX_CONTEXT_CHARS);
        }
        setContextText(initialText);
        setIsUserSelected(true);
      }
    }

    const captureSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;

      let text = sel.toString().trim();
      // Strip any accidental page numbers or page labels
      text = text.replace(/الصفحة\s*\d+/g, "").trim();
      if (!text || text.length < 3) return;

      const anchor = sel.anchorNode;
      if (!anchor) return;

      const el = anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;
      const isFromBookOrExcerpt = el?.closest?.(
        ".ktab-book-page__content-wrap, .ktab-book-page__text, .ktab-single-page, .ktab-img-excerpt-box, .ktab-3page-preview-sheet, .ktab-3page-section__text"
      );

      if (isFromBookOrExcerpt) {
        if (text.length > MAX_CONTEXT_CHARS) {
          text = text.slice(0, MAX_CONTEXT_CHARS);
          AlertToast(`تم تقليص التحديد إلى الحد الأقصى (${MAX_CONTEXT_CHARS.toLocaleString()} حرف)`, "INFO");
        }
        setContextText(text);
        setIsUserSelected(true);
      }
    };

    document.addEventListener("mouseup", captureSelection);
    document.addEventListener("touchend", captureSelection);

    return () => {
      document.removeEventListener("mouseup", captureSelection);
      document.removeEventListener("touchend", captureSelection);
    };
  }, [isOpen]);

  /**
   * Loads dynamic themes and aspect ratios from backend.
   */
  const loadFilters = useCallback(async (targetBookId) => {
    const bId = targetBookId || bookId;
    if (!bId) return;
    setLoadingFilters(true);

    try {
      const res = await fetchImageFilters(bId);
      if (isSuccessResponse(res, 200) && res?.data) {
        const fetchedThemes = res.data.themes || [];
        const fetchedRatios = res.data.aspectRatios || [];

        setThemes(fetchedThemes);
        setAspectRatios(fetchedRatios);

        setSelectedTheme((prev) => prev || (fetchedThemes[0]?.value || ""));
        setSelectedAspectRatio((prev) => {
          if (prev) return prev;
          const portrait = fetchedRatios.find(
            (r) => r.value === "PORTRAIT_3_4" || r.ratio === "3:4"
          );
          return portrait ? portrait.value : (fetchedRatios[0]?.value || "");
        });
      } else {
        AlertToast(res?.message || "تعذر تحميل فلاتر التوليد", "ERROR");
      }
    } catch (err) {
      console.error("Failed to load image filters:", err);
      AlertToast("فشل الاتصال بالخادم لجلب خيارات التوليد", "ERROR");
    } finally {
      setLoadingFilters(false);
    }
  }, [bookId]);

  // Fetch filters once per book when panel opens
  useEffect(() => {
    if (!isOpen || !bookId) return;
    if (filtersFetchedRef.current !== bookId) {
      filtersFetchedRef.current = bookId;
      loadFilters(bookId);
    }
  }, [isOpen, bookId, loadFilters]);

  /**
   * Stops any active polling interval.
   */
  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  /**
   * Polls generation status every 2.5s until COMPLETED or FAILED.
   */
  const startPolling = useCallback(
    (imageId) => {
      stopPolling();

      const poll = async () => {
        try {
          const res = await pollImageGenerationStatus(bookId, imageId);
          if (isSuccessResponse(res, 200) && res?.data) {
            const data = res.data;
            setActiveJob(data);

            if (data.status === "COMPLETED") {
              stopPolling();
              setIsGenerating(false);
              AlertToast("تم إنشاء الصورة بنجاح!", "SUCCESS");
            } else if (data.status === "FAILED") {
              stopPolling();
              setIsGenerating(false);
              AlertToast(data.failureReason || "فشل توليد الصورة", "ERROR");
            }
          }
        } catch (err) {
          console.error("Polling image status error:", err);
        }
      };

      const initialTimer = setTimeout(poll, 1200);
      pollTimerRef.current = setInterval(poll, 2500);

      return () => {
        clearTimeout(initialTimer);
        stopPolling();
      };
    },
    [bookId, stopPolling]
  );

  /**
   * Triggers the generation request.
   */
  const handleGenerate = useCallback(async () => {
    if (!contextText.trim()) {
      AlertToast("يرجى تحديد نص من صفحة الكتاب أولاً", "WARNING");
      return;
    }
    if (!selectedTheme) {
      AlertToast("يرجى اختيار أسلوب الرسم", "WARNING");
      return;
    }
    if (!selectedAspectRatio) {
      AlertToast("يرجى اختيار أبعاد الصورة", "WARNING");
      return;
    }

    const payloadContext = contextText.trim().slice(0, MAX_CONTEXT_CHARS);

    setIsGenerating(true);
    setActiveJob({
      status: "QUEUED",
      context: payloadContext,
      theme: selectedTheme,
      aspectRatio: selectedAspectRatio,
    });

    try {
      const res = await triggerImageGeneration(bookId, {
        context: payloadContext,
        theme: selectedTheme,
        aspectRatio: selectedAspectRatio,
      });

      const isAccepted = isSuccessResponse(res, 202) || isSuccessResponse(res, 200);
      const imageId = res?.data?.imageId || res?.data?.id;

      if (isAccepted && imageId) {
        setActiveJob(res.data);
        startPolling(imageId);
      } else if (res?.statusCode === 429 || res?.status === 429) {
        setIsGenerating(false);
        setActiveJob(null);
        AlertToast(res.message || "تجاوزت الحد المسموح لتوليد الصور", "WARNING");
      } else if (res?.statusCode === 409 || res?.status === 409) {
        setIsGenerating(false);
        setActiveJob(null);
        AlertToast(res.message || "طلب التوليد قيد المعالجة بالفعل", "INFO");
      } else {
        setIsGenerating(false);
        setActiveJob(null);
        AlertToast(res?.message || "حدث خطأ أثناء إرسال طلب التوليد", "ERROR");
      }
    } catch (err) {
      console.error("Trigger image generation error:", err);
      setIsGenerating(false);
      setActiveJob(null);
      AlertToast("فشل الاتصال بالخادم لإرسال طلب التوليد", "ERROR");
    }
  }, [contextText, selectedTheme, selectedAspectRatio, bookId, startPolling]);

  /**
   * Clears the user's highlighted selection.
   */
  const handleResetSelection = useCallback(() => {
    setIsUserSelected(false);
    setContextText("");
    try {
      window.getSelection()?.removeAllRanges();
    } catch {
      /* ignored */
    }
  }, []);

  /**
   * Native Share API with clipboard fallback.
   */
  const handleShareImage = useCallback(
    async (imageUrl) => {
      const url = imageUrl || activeJob?.imageUrl;
      if (!url) return;

      if (navigator.share) {
        try {
          await navigator.share({
            title: bookTitle ? `لوحة من: ${bookTitle}` : "لوحة كتاب",
            url,
          });
          return;
        } catch (err) {
          if (err.name === "AbortError") return;
        }
      }

      navigator.clipboard
        .writeText(url)
        .then(() => AlertToast("تم نسخ رابط الصورة", "SUCCESS"))
        .catch(() => AlertToast("تعذر نسخ الرابط", "ERROR"));
    },
    [activeJob, bookTitle]
  );

  const [downloading, setDownloading] = useState(false);

  /**
   * Downloads the generated image directly to the user's device.
   * Fetches image as Blob and triggers download, preventing new tab navigation.
   */
  const handleDownloadImage = useCallback(
    async (imageUrl) => {
      const targetUrl = imageUrl || activeJob?.imageUrl;
      if (!targetUrl || downloading) return;

      setDownloading(true);
      AlertToast("جارٍ تنزيل الصورة...", "INFO");

      try {
        const safeTitle = (bookTitle || "ktab-illustration")
          .replace(/[^\w\u0600-\u06FF\s-]/g, "")
          .trim()
          .replace(/\s+/g, "_");
        const filename = `${safeTitle || "ktab_scene"}_${Date.now()}.png`;

        const success = await downloadImageToDevice(targetUrl, filename);
        if (success) {
          AlertToast("تم تنزيل الصورة بنجاح", "SUCCESS");
        } else {
          AlertToast("تعذر تنزيل الصورة مباشرة", "ERROR");
        }
      } catch (err) {
        console.error("Failed to download image:", err);
        AlertToast("حدث خطأ أثناء تنزيل الصورة", "ERROR");
      } finally {
        setDownloading(false);
      }
    },
    [activeJob, bookTitle, downloading]
  );

  return {
    themes,
    aspectRatios,
    loadingFilters,
    contextText,
    charCount: contextText ? contextText.length : 0,
    maxChars: MAX_CONTEXT_CHARS,
    isUserSelected,
    pagesExcerpt,
    minPage,
    maxPage,
    selectedTheme,
    setSelectedTheme,
    selectedAspectRatio,
    setSelectedAspectRatio,
    currentRatioCss,
    currentRatioLabel,
    isGenerating,
    activeJob,
    downloading,
    isCollapsed,
    setIsCollapsed,
    toggleCollapse,
    handleGenerate,
    handleResetSelection,
    handleResetJob,
    handleShareImage,
    handleDownloadImage,
  };
}

export default usePageImageGen;
