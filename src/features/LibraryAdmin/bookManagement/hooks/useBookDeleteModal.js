import { useState, useEffect, useCallback } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating delete confirmation logic, media query checks,
 * and API execution for removing a book from the library organization.
 */
export function useBookDeleteModal({ book, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!book?.id) return;
    setDeleting(true);
    try {
      const res = await libraryAdminService.deleteBook(book.id);
      if (res && (res.success || res.status === "OK" || res.statusCode === 200)) {
        AlertToast(`تم حذف كتاب «${book.title || "الكتاب"}» من المكتبة بنجاح`, "success");
        onSuccess?.();
        onClose?.();
      } else {
        AlertToast(res?.message || "تعذر حذف الكتاب، يرجى المحاولة لاحقاً", "error");
      }
    } catch (err) {
      console.error("Failed to delete library book:", err);
      AlertToast("حدث خطأ في الخادم أثناء حذف الكتاب", "error");
    } finally {
      setDeleting(false);
    }
  }, [book, onClose, onSuccess]);

  return {
    isMobile,
    deleting,
    handleDelete,
  };
}

export default useBookDeleteModal;
