import { useState, useRef, useEffect, useCallback } from "react";
import { publisherEditorialService } from "../services/publisherEditorialService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing PublisherBookCard presentation state, image lifecycle,
 * and contextual editorial action triggers.
 *
 * @param {Object} params
 * @param {Object} params.book
 * @param {Function} [params.onDetails]
 * @param {Function} [params.onApprove]
 * @param {Function} [params.onReject]
 */
export function usePublisherBookCard({ book, onDetails, onApprove, onReject }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setCoverLoaded(false);
    setHasCoverError(false);
  }, [book?.coverImageUrl]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleDetailsClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setIsMenuOpen(false);
      onDetails?.(book);
    },
    [book, onDetails]
  );

  const handleApproveClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setIsMenuOpen(false);
      onApprove?.(book);
    },
    [book, onApprove]
  );

  const handleRejectClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setIsMenuOpen(false);
      onReject?.(book);
    },
    [book, onReject]
  );

  const handleDownloadSource = useCallback(
    async (e) => {
      e?.stopPropagation?.();
      setIsMenuOpen(false);
      if (!book?.id) return;

      try {
        setDownloading(true);
        const res = await publisherEditorialService.getSourceFile(book.id);
        const downloadUrl = res?.data?.downloadUrl;
        if (!downloadUrl) {
          AlertToast("لم يتوفر رابط تنزيل مباشر للملف الأصلي.", "WARNING");
          return;
        }

        // Open secure ephemeral download in new tab
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        AlertToast("تعذر الحصول على رابط تنزيل ملف الكتاب، يرجى المحاولة لاحقاً.", "ERROR");
      } finally {
        setDownloading(false);
      }
    },
    [book?.id]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleDetailsClick();
      }
    },
    [handleDetailsClick]
  );

  const authorDisplayName =
    (book?.customAuthorName && book.customAuthorName.trim()) ||
    (book?.authorName && book.authorName.trim()) ||
    "مؤلف غير معروف";

  const genreLabel =
    book?.mainGenreName &&
    book?.subGenreName &&
    book.mainGenreName.trim() !== book.subGenreName.trim()
      ? `${book.mainGenreName.trim()} / ${book.subGenreName.trim()}`
      : (book?.mainGenreName && book.mainGenreName.trim()) ||
        (book?.subGenreName && book.subGenreName.trim()) ||
        "";

  return {
    isMenuOpen,
    menuRef,
    coverLoaded,
    hasCoverError,
    downloading,
    authorDisplayName,
    genreLabel,
    setCoverLoaded,
    setHasCoverError,
    toggleMenu,
    handleDetailsClick,
    handleApproveClick,
    handleRejectClick,
    handleDownloadSource,
    handleKeyDown,
  };
}

export default usePublisherBookCard;
