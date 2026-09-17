import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useDeleteBookModal } from "./useDeleteBookModal";
import "./DeleteBookModal.css";

/**
 * Pure presentation DeleteBookModal component.
 * Uses useDeleteBookModal for keyboard events and scroll locks.
 */
export function DeleteBookModal({ isOpen, onClose, onConfirm, bookTitle }) {
  useDeleteBookModal({ isOpen, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ktab-delete-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="ktab-delete-modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ktab-delete-modal-title"
          >
            <div className="ktab-delete-modal-icon-wrap">
              <Trash2 size={24} />
            </div>

            <div className="ktab-delete-modal-text-group">
              <h3 id="ktab-delete-modal-title" className="ktab-delete-modal-title">
                تأكيد حذف الكتاب
              </h3>
              <p className="ktab-delete-modal-desc">
                هل أنت متأكد من رغبتك في حذف{" "}
                <span className="ktab-delete-modal-highlight">"{bookTitle}"</span>؟
                لا يمكن التراجع عن هذا الإجراء لاحقاً.
              </p>
            </div>

            <div className="ktab-delete-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="ktab-delete-modal-btn ktab-delete-modal-btn--cancel"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="ktab-delete-modal-btn ktab-delete-modal-btn--confirm"
              >
                حذف الكتاب
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DeleteBookModal;
