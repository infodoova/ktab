import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./Modal.css";

/**
 * Custom Zero-Dependency Liquid Glass Modal / Dialog Component
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  maxWidth = "max-w-lg", // "max-w-md" | "max-w-lg" | "max-w-xl" | "max-w-2xl"
  showCloseButton = true,
  closeOnBackdrop = true,
  className = "",
}) {
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Map or sanitize maxWidth class
  const widthClass = maxWidth.startsWith("max-w-")
    ? `ktab-modal-container--${maxWidth}`
    : "ktab-modal-container--max-w-lg";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ktab-modal-overlay" dir="rtl">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="ktab-modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`ktab-modal-container ${widthClass} ${className}`}
          >
            {/* Top Highlight */}
            <div className="ktab-modal-top-highlight" />

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="ktab-modal-header">
                <div>
                  {title && <h3 className="ktab-modal-title">{title}</h3>}
                  {description && <p className="ktab-modal-desc">{description}</p>}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="ktab-modal-close-btn"
                    aria-label="إغلاق النافذة"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalHeader({ children, className = "" }) {
  return <div className={`ktab-modal-header ${className}`}>{children}</div>;
}

export function ModalBody({ children, className = "" }) {
  return <div className={`ktab-modal-body ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }) {
  return <div className={`ktab-modal-footer ${className}`}>{children}</div>;
}

export default Modal;
