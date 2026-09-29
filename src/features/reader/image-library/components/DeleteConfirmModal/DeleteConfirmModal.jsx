import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import "./DeleteConfirmModal.css";

/**
 * Editorial confirmation dialog for image deletion.
 * Communicates that deleting will permanently remove the record and the R2 artifact.
 */
export function DeleteConfirmModal({
  image,
  isOpen = false,
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen || !image) return null;

  return (
    <div
      className="ktab-del-modal-overlay"
      onClick={!isDeleting ? onCancel : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ktab-del-modal-title"
      dir="rtl"
    >
      <div
        className="ktab-del-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ktab-del-modal-icon-wrap">
          <AlertTriangle size={24} strokeWidth={2} />
        </div>

        <h3 id="ktab-del-modal-title" className="ktab-del-modal-title">
          تأكيد حذف الصورة
        </h3>

        <p className="ktab-del-modal-desc">
          هل أنت متأكد من رغبتك في حذف هذه الصورة التوليدية الخاصة بكتاب{" "}
          <strong className="ktab-del-modal-book-name">
            "{image.bookTitle || "الكتاب"}"
          </strong>
          ؟ سيتم حذف سجل الصورة والملف الفعلي المخزن سحابياً بشكل نهائي.
        </p>

        <div className="ktab-del-modal-actions">
          <button
            type="button"
            className="ktab-del-modal-btn ktab-del-modal-btn--confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="ktab-del-modal-spinner" />
                <span>جاري الحذف...</span>
              </>
            ) : (
              <span>نعم، حذف نهائي</span>
            )}
          </button>

          <button
            type="button"
            className="ktab-del-modal-btn ktab-del-modal-btn--cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
