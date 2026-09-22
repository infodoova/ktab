import { useState, useEffect, useCallback } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook orchestrating book details fetching, body scroll lock,
 * keyboard accessibility (ESC), and ephemeral source file downloading
 * for BookDetailsDrawer.
 */
export function useBookDetailsDrawer({ isOpen, bookId, initialBook, onClose }) {
  const [book, setBook] = useState(initialBook || null);
  const [loading, setLoading] = useState(Boolean(bookId && !initialBook));
  const [downloading, setDownloading] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch full details if needed
  const fetchDetails = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    try {
      const res = await libraryAdminService.getBookById(bookId);
      if (res && (res.success || res.status === "OK" || res.data)) {
        setBook(res.data || res);
      }
    } catch (err) {
      console.error("Failed to load book details:", err);
      AlertToast("تعذر جلب تفاصيل الكتاب الكاملة", "error");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (isOpen && bookId && (!initialBook || !initialBook.description)) {
      fetchDetails();
    } else if (initialBook) {
      setBook(initialBook);
    }
  }, [isOpen, bookId, initialBook, fetchDetails]);

  // Download book source file
  const handleDownloadSource = useCallback(async () => {
    const id = book?.id || bookId;
    if (!id) return;
    setDownloading(true);
    try {
      const res = await libraryAdminService.getSourceFile(id);
      const url = res?.data?.downloadUrl || res?.downloadUrl;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        AlertToast("تم تجهيز رابط التحميل بنجاح", "success");
      } else {
        AlertToast(res?.message || "رابط تنزيل الملف غير متوفر", "error");
      }
    } catch (err) {
      console.error("Failed to download source file:", err);
      AlertToast("حدث خطأ أثناء استخراج رابط التنزيل", "error");
    } finally {
      setDownloading(false);
    }
  }, [book, bookId]);

  return {
    book,
    loading,
    downloading,
    handleDownloadSource,
  };
}

export default useBookDetailsDrawer;
