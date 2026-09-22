import React from "react";
import { DeleteConfirmModal } from "@/components/myui";
import { usePublisherDeleteModal } from "../../hooks/usePublisherDeleteModal";

/**
 * Standard confirmation dialog for deleting a publisher account.
 * Uses the shared unified DeleteConfirmModal across all app roles.
 */
export function PublisherDeleteModal({ isOpen, publisher, onClose, onSuccess }) {
  const { deleting, handleDelete } = usePublisherDeleteModal({
    publisher,
    onClose,
    onSuccess,
  });

  const displayName =
    publisher?.fullName ||
    [publisher?.firstName, publisher?.middleName, publisher?.lastName]
      .filter(Boolean)
      .join(" ") ||
    publisher?.email ||
    "الناشر";

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={deleting}
      title="تأكيد حذف حساب الناشر"
      description="هل أنت متأكد من رغبتك في حذف حساب الناشر"
      highlightText={displayName}
      subDescription="؟ سيتم إلغاء صلاحيات النشر وحذف السجل المرتبط بالحساب نهائياً."
      confirmLabel="نعم، احذف الحساب"
      cancelLabel="إلغاء التراجع"
    />
  );
}

export default PublisherDeleteModal;
