import React from "react";
import { DeleteConfirmModal } from "@/components/myui";
import { useLibraryDeleteModal } from "../../hooks/useLibraryDeleteModal";

/**
 * Standard confirmation dialog for deleting an organization library.
 * Uses the shared unified DeleteConfirmModal across all app roles.
 */
export function LibraryDeleteModal({ isOpen, library, onClose, onSuccess }) {
  const { deleting, handleDelete } = useLibraryDeleteModal({
    library,
    onClose,
    onSuccess,
  });

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={deleting}
      title="تأكيد حذف المنظمة والمكتبة"
      description="هل أنت متأكد من رغبتك في حذف مكتبة"
      highlightText={library?.name}
      subDescription="؟ سيؤدي هذا الإجراء إلى حذف جميع الكتب، المشرف، وطاقم العمل المرتبطين بها نهائياً."
      confirmLabel="نعم، احذف المكتبة"
      cancelLabel="إلغاء التراجع"
    />
  );
}

export default LibraryDeleteModal;
