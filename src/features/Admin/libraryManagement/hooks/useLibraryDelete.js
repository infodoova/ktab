import { useState, useCallback } from "react";
import { libraryService } from "../services/libraryService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook to handle deleting a library with verification loading state.
 */
export function useLibraryDelete({ onSuccess } = {}) {
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = useCallback(
    async (libraryId) => {
      if (!libraryId) return false;
      setDeleting(true);
      try {
        const res = await libraryService.deleteLibrary(libraryId);
        if (res && (res.success || res.status === "OK" || res.statusCode === 200)) {
          AlertToast("تم حذف المكتبة وجميع بياناتها بنجاح", "success");
          onSuccess?.();
          return true;
        } else {
          AlertToast(res?.message || "فشل حذف المكتبة", "error");
          return false;
        }
      } catch (err) {
        console.error("Delete library failed:", err);
        AlertToast("حدث خطأ أثناء محاولة حذف المكتبة", "error");
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [onSuccess]
  );

  return {
    deleting,
    confirmDelete,
  };
}

export default useLibraryDelete;
