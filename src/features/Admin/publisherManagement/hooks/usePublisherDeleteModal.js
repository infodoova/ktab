import { useState, useEffect } from "react";
import { publisherService } from "../services/publisherService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating delete confirmation modal logic for publisher accounts.
 */
export function usePublisherDeleteModal({ publisher, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDelete = async () => {
    if (!publisher?.id) return;

    setDeleting(true);
    try {
      const res = await publisherService.removePublisher(publisher.id);
      if (res && (res.success || res.status === "OK" || res.status === 200 || !res.error)) {
        AlertToast("تم حذف حساب الناشر بنجاح", "success");
        onSuccess?.();
        onClose?.();
      } else {
        AlertToast(res?.message || "تعذر حذف حساب الناشر", "error");
      }
    } catch (err) {
      console.error("Failed to delete publisher:", err);
      AlertToast("حدث خطأ أثناء محاولة حذف الحساب", "error");
    } finally {
      setDeleting(false);
    }
  };

  return {
    isMobile,
    deleting,
    handleDelete,
  };
}

export default usePublisherDeleteModal;
