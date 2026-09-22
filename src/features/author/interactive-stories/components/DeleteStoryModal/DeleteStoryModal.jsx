import React from "react";
import { DeleteConfirmModal } from "@/components/myui";

/**
 * Standard confirmation dialog for deleting an interactive story.
 * Uses the shared unified DeleteConfirmModal with strict title verification.
 */
export function DeleteStoryModal({ isOpen, onClose, onConfirm, storyTitle, loading = false }) {
  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title="تأكيد حذف القصة التفاعلية"
      description="هل أنت متأكد من رغبتك في حذف"
      highlightText={storyTitle}
      subDescription="سيتم حذف جميع المشاهد والمسارات المرتبطة بها نهائياً ولا يمكن استرجاعها."
      confirmLabel="نعم، احذف القصة"
      cancelLabel="إلغاء التراجع"
    />
  );
}

export default DeleteStoryModal;
