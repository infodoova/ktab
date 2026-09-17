import React from "react";
import { Trash2 } from "lucide-react";
import { useDeleteStoryModal } from "./useDeleteStoryModal";
import "./DeleteStoryModal.css";

/**
 * Pure presentation DeleteStoryModal component.
 */
export function DeleteStoryModal({ isOpen, onClose, onConfirm, storyTitle }) {
  useDeleteStoryModal({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <div
      className="ktab-delete-modal-backdrop"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-story-title"
      aria-describedby="delete-story-desc"
    >
      <div
        className="ktab-delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ktab-delete-modal__icon-wrap">
          <Trash2 size={24} />
        </div>

        <div className="ktab-delete-modal__content">
          <h3 id="delete-story-title" className="ktab-delete-modal__title">
            تأكيد حذف القصة التفاعلية
          </h3>
          <p id="delete-story-desc" className="ktab-delete-modal__desc">
            هل أنت متأكد من رغبتك في حذف{" "}
            <span className="ktab-delete-modal__story-name">"{storyTitle}"</span>؟
            سيتم حذف جميع المشاهد والمسارات المرتبطة بها نهائياً ولا يمكن استرجاعها.
          </p>
        </div>

        <div className="ktab-delete-modal__actions">
          <button
            type="button"
            onClick={onClose}
            className="ktab-delete-modal__btn-cancel"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="ktab-delete-modal__btn-confirm"
          >
            حذف القصة
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteStoryModal;
