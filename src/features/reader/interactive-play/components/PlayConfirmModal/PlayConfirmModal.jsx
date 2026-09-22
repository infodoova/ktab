import React from "react";
import "./PlayConfirmModal.css";

/**
 * Reusable confirmation dialog for exit / restart actions.
 *
 * @param {string} title - Dialog heading
 * @param {string} message - Explanation text
 * @param {string} confirmText - Primary action button label
 * @param {() => void} onConfirm - Primary action handler
 * @param {() => void} onCancel - Cancel handler
 */
export function PlayConfirmModal({ title, message, confirmText, onConfirm, onCancel }) {
  return (
    <div className="play-confirm-overlay" onClick={onCancel}>
      <div className="play-confirm-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Mobile BottomSheet Drag Handle */}
        <div className="play-confirm-dialog__handle" />
        <h3 className="play-confirm-dialog__title">{title}</h3>
        <p className="play-confirm-dialog__message">{message}</p>
        <div className="play-confirm-dialog__actions">
          <button className="play-confirm-dialog__cancel-btn" onClick={onCancel}>
            إلغاء
          </button>
          <button className="play-confirm-dialog__confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayConfirmModal;
