import { useState, useEffect, useCallback } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing book details fetching, media responsiveness,
 * and ephemeral source file downloading.
 */
export function useBookDetailsModal({ bookId, initialBook, onClose }) {
  const [book, setBook] = useState(initialBook || null);
  const [loading, setLoading] = useState(!initialBook);
  const [downloading, setDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (bookId && (!initialBook || !initialBook.description)) {
      fetchDetails();
    } else if (initialBook) {
      setBook(initialBook);
    }
  }, [bookId, initialBook, fetchDetails]);

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
    isMobile,
    handleDownloadSource,
  };
}

export default useBookDetailsModal;
