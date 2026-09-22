import React from "react";
import { DeleteConfirmModal } from "@/components/myui";
import { useStaffDeleteModal } from "../../hooks/useStaffDeleteModal";

/**
 * Standard confirmation dialog for removing a staff member from the library organization.
 * Uses the shared unified DeleteConfirmModal across all app roles.
 */
export function StaffDeleteModal({ isOpen, member, onClose, onSuccess }) {
  const { deleting, handleDelete } = useStaffDeleteModal({
    member,
    onClose,
    onSuccess,
  });

  const displayName =
    member?.fullName ||
    [member?.firstName, member?.middleName, member?.lastName].filter(Boolean).join(" ") ||
    member?.email ||
    "الموظف";

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={deleting}
      title="تأكيد استبعاد الموظف من فريق العمل"
      description="هل أنت متأكد من رغبتك في استبعاد"
      highlightText={displayName}
      subDescription="من فريق عمل المكتبة؟ سيتم إلغاء صلاحيات الوصول الخاصة بحسابه إلى لوحة المكتبة فوراً."
      confirmLabel="نعم، استبعد الموظف"
      cancelLabel="إلغاء التراجع"
    />
  );
}

export default StaffDeleteModal;
