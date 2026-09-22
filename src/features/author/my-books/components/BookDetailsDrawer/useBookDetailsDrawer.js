import { useState, useEffect, useCallback } from "react";
import { fetchAuthorBookById } from "../../services/myBooksService";

/**
 * Custom hook encapsulating BookDetailsDrawer state, lifecycle, and scroll locks.
 */
export function useBookDetailsDrawer({ isOpen, onClose, book }) {
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  useEffect(() => {
    if (!isOpen || !book?.id) {
      setDetails(null);
      return;
    }

    let active = true;
    async function loadFullDetails() {
      setLoadingDetails(true);
      try {
        const res = await fetchAuthorBookById(book.id);
        const data = res?.data || res;
        if (active && data && typeof data === "object") {
          setDetails(data);
        }
      } catch (err) {
        console.error("Failed to load author book details:", err);
      } finally {
        if (active) setLoadingDetails(false);
      }
    }

    loadFullDetails();
    return () => {
      active = false;
    };
  }, [isOpen, book?.id]);

  const activeBook = details || book;
  const coverUrl = activeBook?.coverImageUrl || activeBook?.cover;
  const isDraft = activeBook?.status === "DRAFT" || activeBook?.isDraft;

  useEffect(() => {
    setCoverLoaded(false);
    setHasCoverError(false);
  }, [coverUrl]);

  const handleCoverLoad = useCallback(() => {
    setCoverLoaded(true);
  }, []);

  const handleCoverError = useCallback(() => {
    setHasCoverError(true);
    setCoverLoaded(false);
  }, []);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Derived presentation values
  const title = activeBook?.title || "كتاب بدون عنوان";
  const author = activeBook?.authorName || activeBook?.customAuthorName || "مؤلف مستقل";
  const description = activeBook?.description || "";
  const statusLabel = isDraft ? "مسودة" : "منشور";
  const mainGenre = activeBook?.mainGenreName || activeBook?.mainGenre?.name || activeBook?.genreName || "عام";
  const subGenre = activeBook?.subGenreName || activeBook?.subGenre?.name || null;
  const pageCountText = activeBook?.pageCount ? `${activeBook.pageCount} صفحة` : "غير محدد";
  
  const langCode = (activeBook?.language || "ar").toLowerCase();
  const languageText =
    langCode === "ar" ? "العربية" : langCode === "en" ? "الإنجليزية" : langCode === "fr" ? "الفرنسية" : langCode.toUpperCase();

  const ageRangeText = activeBook?.ageRangeMin
    ? (activeBook?.ageRangeMax && activeBook?.ageRangeMax < 99
        ? `${activeBook.ageRangeMin} - ${activeBook.ageRangeMax} سنة`
        : `+${activeBook.ageRangeMin} سنة`)
    : "لكافة الأعمار";

  const hasAudio = Boolean(activeBook?.hasAudio);
  const audioText = hasAudio ? "متوفر صوتياً" : "نسخة نصية فقط";
  const ratingText = Number(activeBook?.averageRating ?? 0).toFixed(1);
  const totalReviews = activeBook?.totalReviews ?? 0;
  const reviewsText = `${totalReviews} ${totalReviews === 1 ? "تقييم" : totalReviews === 2 ? "تقييمان" : "تقييمات"}`;
  
  let publishDateText = "غير محدد";
  const rawDate = activeBook?.publishDate || activeBook?.createdAt;
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        publishDateText = d.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      publishDateText = String(rawDate).split("T")[0];
    }
  }

  const pdfUrl = activeBook?.pdfDownloadUrl || null;
  const pdfName = activeBook?.pdfFileName || (activeBook?.title ? `${activeBook.title}.pdf` : "ملف_الكتاب.pdf");
  const sourceText =
    activeBook?.bookSource === "AUTHOR"
      ? "مؤلف مستقل"
      : activeBook?.libraryOrganizationName
      ? `مكتبة ${activeBook.libraryOrganizationName}`
      : "منصة كِتاب";
  const readCount = activeBook?.readCount ?? activeBook?.totalReads ?? 0;
  const readCountText = `${readCount} ${readCount === 1 ? "قراءة" : readCount === 2 ? "قراءتان" : "قراءات"}`;

  const handlePreview = useCallback(() => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  }, [pdfUrl]);

  // Structured specification grid items (12 balanced tiles)
  const specItems = [
    {
      id: "author",
      label: "المؤلف",
      value: author,
      iconType: "user",
    },
    {
      id: "source",
      label: "المصدر",
      value: sourceText,
      iconType: "building",
    },
    {
      id: "mainGenre",
      label: "التصنيف الرئيسي",
      value: mainGenre,
      iconType: "bookmark",
    },
    {
      id: "subGenre",
      label: subGenre ? "التصنيف الفرعي" : "صيغة الكتاب",
      value: subGenre || (pdfUrl ? "مستند PDF" : "نسخة رقمية"),
      iconType: subGenre ? "tag" : "fileText",
    },
    {
      id: "status",
      label: "حالة النشر",
      value: statusLabel,
      iconType: isDraft ? "clock" : "check",
      highlight: isDraft ? "draft" : "published",
    },
    {
      id: "rating",
      label: "التقييم والمراجعات",
      value: `${ratingText} (${reviewsText})`,
      iconType: "star",
      highlight: "gold",
    },
    {
      id: "audio",
      label: "النسخة الصوتية",
      value: audioText,
      iconType: "headphones",
      highlight: hasAudio ? "teal" : "muted",
    },
    {
      id: "pageCount",
      label: "عدد الصفحات",
      value: pageCountText,
      iconType: "bookOpen",
    },
    {
      id: "ageRange",
      label: "الفئة العمرية",
      value: ageRangeText,
      iconType: "users",
    },
    {
      id: "language",
      label: "اللغة",
      value: languageText,
      iconType: "globe",
    },
    {
      id: "publishDate",
      label: "تاريخ النشر",
      value: publishDateText,
      iconType: "calendar",
    },
    {
      id: "readCount",
      label: "إجمالي القراءات",
      value: readCountText,
      iconType: "eye",
    },
  ];

  return {
    coverUrl,
    isDraft,
    title,
    author,
    description,
    statusLabel,
    mainGenre,
    subGenre,
    pageCountText,
    languageText,
    ageRangeText,
    hasAudio,
    audioText,
    ratingText,
    totalReviews,
    reviewsText,
    publishDateText,
    pdfUrl,
    pdfName,
    canPreview: Boolean(pdfUrl),
    handlePreview,
    sourceText,
    readCount,
    readCountText,
    specItems,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    loadingDetails,
  };
}

export default useBookDetailsDrawer;

