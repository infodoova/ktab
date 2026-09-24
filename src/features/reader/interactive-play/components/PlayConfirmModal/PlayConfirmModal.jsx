import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./PlayConfirmModal.css";

/**
 * Editorial Confirmation Dialog for Interactive Story Player.
 * Matches the dark glassmorphic stage aesthetic with clean typography,
 * smooth animations, and tactile controls.
 *
 * @param {Object} props
 * @param {string} props.title - Dialog heading
 * @param {string} props.message - Explanation text
 * @param {string} props.confirmText - Primary action button label
 * @param {() => void} props.onConfirm - Primary action handler
 * @param {() => void} props.onCancel - Cancel handler
 * @param {"restart" | "exit" | "danger" | "default"} [props.variant] - Dialog visual variant
 */
export function PlayConfirmModal({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  variant = "restart",
}) {
  /* Close dialog on Escape key */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const isExitVariant = variant === "exit" || title?.includes("خروج");

  return (
    <div
      className="play-confirm-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      dir="rtl"
    >
      <div
        className="play-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top-Left */}
        <button
          type="button"
          className="play-confirm-dialog__close-btn"
          onClick={onCancel}
          aria-label="إلغاء وإغلاق"
        >
          <X size={16} />
        </button>

        {/* Text Content */}
        <h3 className="play-confirm-dialog__title">{title}</h3>
        <p className="play-confirm-dialog__message">{message}</p>

        {/* Balanced Action Buttons */}
        <div className="play-confirm-dialog__actions">
          <button
            type="button"
            className={`play-confirm-dialog__confirm-btn ${
              isExitVariant ? "play-confirm-dialog__confirm-btn--exit" : "play-confirm-dialog__confirm-btn--restart"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="play-confirm-dialog__cancel-btn"
            onClick={onCancel}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayConfirmModal;

