import React from "react";
import { DeleteConfirmModal } from "@/components/myui";

/**
 * Standard confirmation dialog for deleting an author book.
 * Uses the shared unified DeleteConfirmModal with strict title verification.
 */
export function DeleteBookModal({ isOpen, onClose, onConfirm, bookTitle, loading = false }) {
  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title="تأكيد حذف الكتاب"
      description="هل أنت متأكد من رغبتك في حذف كتاب"
      highlightText={bookTitle}
      subDescription="لا يمكن التراجع عن هذا الإجراء لاحقاً وسيتم حذف جميع النسخ والبيانات المرتبطة به."
      confirmLabel="نعم، احذف الكتاب"
      cancelLabel="إلغاء التراجع"
    />
  );
}

export default DeleteBookModal;
