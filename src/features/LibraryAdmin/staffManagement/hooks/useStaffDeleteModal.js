import { useState, useCallback, useEffect } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook managing the removal of a staff member.
 */
export function useStaffDeleteModal({ member, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!member) return;
    const userId = member.userId || member.id;
    if (!userId) {
      AlertToast("معرف الموظف غير صالح", "error");
      return;
    }

    setDeleting(true);
    try {
      const res = await libraryAdminService.removeStaff(userId);
      if (res && (res.success || res.status === "OK" || res.statusCode === 200)) {
        AlertToast("تم استبعاد الموظف من فريق العمل بنجاح", "success");
        onSuccess?.();
        onClose?.();
      } else {
        AlertToast(res?.message || "تعذر إزالة الموظف، يرجى المحاولة لاحقاً", "error");
      }
    } catch (err) {
      console.error("Failed to remove staff member:", err);
      AlertToast("حدث خطأ أثناء محاولة إزالة الموظف", "error");
    } finally {
      setDeleting(false);
    }
  }, [member, onClose, onSuccess]);

  return {
    isMobile,
    deleting,
    handleDelete,
  };
}

export default useStaffDeleteModal;
