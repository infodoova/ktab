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
  const statusUpper = String(activeBook?.status || "").toUpperCase();
  const isDraft = statusUpper === "DRAFT" || Boolean(activeBook?.isDraft);
  const isPending =
    statusUpper === "PENDING_APPROVAL" ||
    statusUpper === "UNDER_REVIEW" ||
    statusUpper === "PENDING" ||
    statusUpper === "SUBMITTED" ||
    statusUpper === "IN_REVIEW" ||
    statusUpper === "AWAITING_APPROVAL" ||
    Boolean(activeBook?.isPendingApproval);

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
  const statusLabel = isDraft ? "مسودة" : isPending ? "قيد المراجعة" : "منشور";
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
  
  const rawDate =
    activeBook?.submittedAt ||
    activeBook?.submissionDate ||
    activeBook?.publishDate ||
    activeBook?.publishedDate ||
    activeBook?.createdAt ||
    activeBook?.createdDate ||
    activeBook?.creationDate ||
    activeBook?.updatedAt ||
    activeBook?.lastModifiedDate ||
    activeBook?.timestamp;

  let formattedDate = null;
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      formattedDate = String(rawDate).split("T")[0];
    }
  }

  const dateLabel = isPending
    ? "تاريخ التقديم"
    : isDraft
    ? "تاريخ الحفظ"
    : "تاريخ النشر";

  const dateValue =
    formattedDate ||
    (isPending
      ? "بانتظار الاعتماد"
      : isDraft
      ? "مسودة غير منشورة"
      : "منشور");

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
      highlight: "indigo",
    },
    {
      id: "source",
      label: "المصدر",
      value: sourceText,
      iconType: "building",
      highlight: "purple",
    },
    {
      id: "mainGenre",
      label: "التصنيف الرئيسي",
      value: mainGenre,
      iconType: "bookmark",
      highlight: "amber",
    },
    {
      id: "subGenre",
      label: subGenre ? "التصنيف الفرعي" : "صيغة الكتاب",
      value: subGenre || (pdfUrl ? "مستند PDF" : "نسخة رقمية"),
      iconType: subGenre ? "tag" : "fileText",
      highlight: "cyan",
    },
    {
      id: "status",
      label: "حالة النشر",
      value: statusLabel,
      iconType: isDraft || isPending ? "clock" : "check",
      highlight: isDraft ? "draft" : isPending ? "pending" : "published",
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
      highlight: "emerald",
    },
    {
      id: "ageRange",
      label: "الفئة العمرية",
      value: ageRangeText,
      iconType: "users",
      highlight: "sky",
    },
    {
      id: "language",
      label: "اللغة",
      value: languageText,
      iconType: "globe",
      highlight: "blue",
    },
    {
      id: "publishDate",
      label: dateLabel,
      value: dateValue,
      iconType: "calendar",
      highlight: "slate",
    },
    {
      id: "readCount",
      label: "إجمالي القراءات",
      value: readCountText,
      iconType: "eye",
      highlight: "rose",
    },
  ];

  return {
    coverUrl,
    isDraft,
    isPending,
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
    publishDateText: dateValue,
    dateLabel,
    dateValue,
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

