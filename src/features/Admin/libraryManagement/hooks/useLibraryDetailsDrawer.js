import { useEffect, useCallback } from "react";

/**
 * Custom hook encapsulating lifecycle and keyboard accessibility for LibraryDetailsDrawer.
 */
export function useLibraryDetailsDrawer({ isOpen, onClose } = {}) {
  // Lock body scroll when open
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

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return {
    handleClose: onClose,
  };
}

export default useLibraryDetailsDrawer;
