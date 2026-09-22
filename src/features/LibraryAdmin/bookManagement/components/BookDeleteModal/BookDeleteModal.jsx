import React from "react";
import { DeleteConfirmModal } from "@/components/myui";
import { useBookDeleteModal } from "../../hooks/useBookDeleteModal";

/**
 * Standard confirmation dialog for deleting a book from the library organization.
 * Uses the shared unified DeleteConfirmModal across all app roles.
 */
export function BookDeleteModal({ isOpen, book, onClose, onSuccess }) {
  const { deleting, handleDelete } = useBookDeleteModal({
    book,
    onClose,
    onSuccess,
  });

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={deleting}
      title="تأكيد حذف الكتاب من المكتبة"
      description="هل أنت متأكد من رغبتك في حذف كتاب"
      highlightText={book?.title}
      subDescription="نهائياً من المكتبة؟ لن يتمكن المستعيرون أو القراء من تصفح أو تنزيل هذا الكتاب بعد الحذف."
      confirmLabel="نعم، احذف الكتاب"
      cancelLabel="إلغاء التراجع"
    />
  );
}

export default BookDeleteModal;
