import { useState, useEffect } from "react";
import { useLibraryForm } from "./useLibraryForm";

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "نشط" },
  { value: "INACTIVE", label: "غير نشط" },
  { value: "SUSPENDED", label: "معلق" },
];

/**
 * Custom hook encapsulating all lifecycle, media query and form handling
 * for the LibraryEditModal component.
 */
export function useLibraryEditModal({ library, onClose, onSuccess } = {}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const form = useLibraryForm({
    initialData: library,
    onSuccess: () => {
      onSuccess?.();
      onClose?.();
    },
  });

  return {
    isMobile,
    statusOptions: STATUS_OPTIONS,
    ...form,
  };
}

export default useLibraryEditModal;
