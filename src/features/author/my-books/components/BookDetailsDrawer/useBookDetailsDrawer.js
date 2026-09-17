import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook encapsulating BookDetailsDrawer state, lifecycle, and scroll locks.
 */
export function useBookDetailsDrawer({ isOpen, onClose, book }) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  const coverUrl = book?.coverImageUrl || book?.cover;
  const isDraft = book?.status === "DRAFT" || book?.isDraft;

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
  const title = book?.title || "كتاب بدون عنوان";
  const author = book?.authorName || book?.customAuthorName || "مؤلف مستقل";
  const description = book?.description || "";
  const statusLabel = isDraft ? "مسودة" : "منشور";
  const mainGenre = book?.mainGenreName || book?.mainGenre?.name || book?.genreName || "عام";
  const subGenre = book?.subGenreName || book?.subGenre?.name || null;
  const pageCountText = book?.pageCount ? `${book.pageCount} صفحة` : "غير محدد";
  
  const langCode = (book?.language || "ar").toLowerCase();
  const languageText =
    langCode === "ar" ? "العربية" : langCode === "en" ? "الإنجليزية" : langCode === "fr" ? "الفرنسية" : langCode.toUpperCase();

  const ageRangeText = book?.ageRangeMin
    ? (book?.ageRangeMax && book?.ageRangeMax < 99
        ? `${book.ageRangeMin} - ${book.ageRangeMax} سنة`
        : `+${book.ageRangeMin} سنة`)
    : "لكافة الأعمار";

  const hasAudio = Boolean(book?.hasAudio);
  const audioText = hasAudio ? "متوفر صوتياً" : "نسخة نصية فقط";
  const ratingText = Number(book?.averageRating ?? 0).toFixed(1);
  const totalReviews = book?.totalReviews ?? 0;
  const reviewsText = `${totalReviews} ${totalReviews === 1 ? "تقييم" : totalReviews === 2 ? "تقييمان" : "تقييمات"}`;
  
  let publishDateText = "غير محدد";
  const rawDate = book?.publishDate || book?.createdAt;
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

  const pdfUrl = book?.pdfDownloadUrl || null;
  const pdfName = book?.pdfFileName || (book?.title ? `${book.title}.pdf` : "ملف_الكتاب.pdf");
  const sourceText =
    book?.bookSource === "AUTHOR"
      ? "مؤلف مستقل"
      : book?.libraryOrganizationName
      ? `مكتبة ${book.libraryOrganizationName}`
      : "منصة كِتاب";
  const readCount = book?.readCount ?? book?.totalReads ?? 0;
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
  };
}

export default useBookDetailsDrawer;

