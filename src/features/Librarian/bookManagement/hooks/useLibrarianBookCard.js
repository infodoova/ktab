import { useState, useRef, useEffect, useCallback } from "react";
import { librarianService } from "../../services/librarianService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating dropdown menu logic, source-file downloading,
 * and cover image loading for LibrarianBookCard.
 */
export function useLibrarianBookCard({ book, onDetails, onEdit }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleDetailsClick = useCallback(
    (e) => {
      e?.stopPropagation();
      setIsMenuOpen(false);
      onDetails?.(book);
    },
    [book, onDetails]
  );

  const handleEditClick = useCallback(
    (e) => {
      e?.stopPropagation();
      setIsMenuOpen(false);
      onEdit?.(book);
    },
    [book, onEdit]
  );

  const handleDownloadSource = useCallback(
    async (e) => {
      e?.stopPropagation();
      setIsMenuOpen(false);
      if (!book?.id) return;

      setDownloading(true);
      try {
        const res = await librarianService.getSourceFile(book.id);
        const url = res?.data?.downloadUrl || res?.downloadUrl;
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
          AlertToast("تم تجهيز رابط تنزيل ملف الكتاب", "success");
        } else {
          AlertToast(res?.message || "رابط تنزيل الملف غير متوفر", "error");
        }
      } catch (err) {
        console.error("Failed to download book source:", err);
        AlertToast("حدث خطأ أثناء تنزيل ملف الكتاب", "error");
      } finally {
        setDownloading(false);
      }
    },
    [book]
  );

  return {
    isMenuOpen,
    menuRef,
    coverLoaded,
    hasCoverError,
    downloading,
    setCoverLoaded,
    setHasCoverError,
    toggleMenu,
    handleDetailsClick,
    handleEditClick,
    handleDownloadSource,
  };
}

export default useLibrarianBookCard;
