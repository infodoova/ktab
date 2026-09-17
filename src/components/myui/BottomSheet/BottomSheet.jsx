import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./BottomSheet.css";

/**
 * Global Editorial Apple-style BottomSheet Component.
 * Supports smooth slide-up, backdrop blur, swipe-down to dismiss, and body scroll lock.
 */
export function BottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = "",
  maxHeight = "90vh",
  scrollable = true,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ktab-bottom-sheet-overlay" dir="rtl">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="ktab-bottom-sheet-backdrop"
          />

          {/* Bottom Sheet Container with Drag-to-Dismiss */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 350,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 400) {
                onClose?.();
              }
            }}
            style={{ maxHeight: scrollable ? maxHeight : "none" }}
            className={`ktab-bottom-sheet-container ${
              !scrollable ? "ktab-bottom-sheet-container--no-scroll" : ""
            } ${className}`}
          >
            {/* Grab Handle Pill */}
            <div className="ktab-bottom-sheet__handle-wrapper">
              <div className="ktab-bottom-sheet__handle" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <header className="ktab-bottom-sheet__header">
                <div className="ktab-bottom-sheet__header-text">
                  {title && <h3 className="ktab-bottom-sheet__title">{title}</h3>}
                  {description && (
                    <p className="ktab-bottom-sheet__desc">{description}</p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="ktab-bottom-sheet__close-btn"
                    aria-label="إغلاق"
                  >
                    <X size={18} />
                  </button>
                )}
              </header>
            )}

            {/* Content Body */}
            <div
              className={`ktab-bottom-sheet__body ${
                !scrollable ? "ktab-bottom-sheet__body--no-scroll" : ""
              }`}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;
