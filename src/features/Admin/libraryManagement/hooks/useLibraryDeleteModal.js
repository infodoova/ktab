import { useState, useEffect, useCallback } from "react";
import { libraryService } from "../services/libraryService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating all lifecycle, responsive media query, and deletion logic
 * for the LibraryDeleteModal component.
 */
export function useLibraryDeleteModal({ library, onClose, onSuccess } = {}) {
  const [isMobile, setIsMobile] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Monitor responsive viewport boundary for mobile drawer vs desktop dialog
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Programmatic deletion submission
  const handleDelete = useCallback(async () => {
    if (!library?.id) return;
    setDeleting(true);
    try {
      const res = await libraryService.deleteLibrary(library.id);
      if (res && (res.success || res.status === "OK" || res.statusCode === 200)) {
        AlertToast("تم حذف المكتبة وجميع بياناتها بنجاح", "success");
        onSuccess?.();
        onClose?.();
      } else {
        AlertToast(res?.message || "فشل حذف المكتبة", "error");
      }
    } catch (err) {
      console.error("Delete library failed:", err);
      AlertToast("حدث خطأ أثناء محاولة حذف المكتبة", "error");
    } finally {
      setDeleting(false);
    }
  }, [library?.id, onSuccess, onClose]);

  return {
    isMobile,
    deleting,
    handleDelete,
  };
}

export default useLibraryDeleteModal;
