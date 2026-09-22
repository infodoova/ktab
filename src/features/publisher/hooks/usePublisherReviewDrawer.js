import { useState, useEffect, useCallback } from "react";
import { publisherEditorialService } from "../services/publisherEditorialService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing book details fetching and ephemeral download actions for the editorial drawer.
 *
 * @param {Object} params
 * @param {boolean} params.isOpen
 * @param {string|number} params.bookId
 * @param {Object} [params.initialBook]
 */
export function usePublisherReviewDrawer({ isOpen, bookId, initialBook }) {
  const [book, setBook] = useState(initialBook || null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen || !bookId) return;

    let isMounted = true;

    async function fetchBookDetails() {
      try {
        setLoading(true);
        const res = await publisherEditorialService.getBookById(bookId);
        if (isMounted && res?.data) {
          setBook(res.data);
        }
      } catch (err) {
        // Fall back to initialBook if full details fetch fails
        if (isMounted && initialBook) {
          setBook(initialBook);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBookDetails();

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookId, initialBook]);

  const handleDownloadSource = useCallback(async () => {
    if (!bookId) return;

    try {
      setDownloading(true);
      const res = await publisherEditorialService.getSourceFile(bookId);
      const downloadUrl = res?.data?.downloadUrl;
      if (!downloadUrl) {
        AlertToast("لم يتوفر رابط تنزيل مباشر للملف الأصلي.", "WARNING");
        return;
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      AlertToast("تعذر الحصول على رابط التنزيل، يرجى المحاولة لاحقاً.", "ERROR");
    } finally {
      setDownloading(false);
    }
  }, [bookId]);

  return {
    book,
    loading,
    downloading,
    handleDownloadSource,
  };
}

export default usePublisherReviewDrawer;
