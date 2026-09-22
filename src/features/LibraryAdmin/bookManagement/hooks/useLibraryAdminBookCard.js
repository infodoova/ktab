import { useState, useRef, useEffect, useCallback } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing image lifecycle, action menus, and source-file downloads
 * for an individual library book card.
 */
export function useLibraryAdminBookCard({ book, onDetails, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = useCallback((e) => {
    e?.stopPropagation?.();
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

  const handleDeleteClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setIsMenuOpen(false);
      onDelete?.(book);
    },
    [book, onDelete]
  );

  const handleDownloadSource = useCallback(
    async (e) => {
      e?.stopPropagation?.();
      setIsMenuOpen(false);
      if (!book?.id) return;

      setDownloading(true);
      try {
        const res = await libraryAdminService.getSourceFile(book.id);
        const fileUrl = res?.data?.downloadUrl || res?.downloadUrl;
        if (fileUrl) {
          window.open(fileUrl, "_blank", "noopener,noreferrer");
          AlertToast("بدأ تنزيل ملف الكتاب", "success");
        } else {
          AlertToast(res?.message || "رابط تنزيل الملف غير متوفر حالياً", "error");
        }
      } catch (err) {
        console.error("Failed to fetch book source file:", err);
        AlertToast("تعذر استخراج رابط تنزيل ملف الكتاب", "error");
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
    handleDeleteClick,
    handleDownloadSource,
  };
}

export default useLibraryAdminBookCard;
