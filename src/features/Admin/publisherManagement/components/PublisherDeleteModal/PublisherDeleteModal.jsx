import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/myui/Modal";
import { BottomSheet } from "@/components/myui/BottomSheet";
import { Button } from "@/components/myui/forms/Button";
import { usePublisherDeleteModal } from "../../hooks/usePublisherDeleteModal";
import "./PublisherDeleteModal.css";

/**
 * Responsive confirmation dialog for deleting a publisher account.
 */
export function PublisherDeleteModal({ isOpen, publisher, onClose, onSuccess }) {
  const { isMobile, deleting, handleDelete } = usePublisherDeleteModal({
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

  const bodyContent = (
    <div className="ktab-pub-del-content">
      <div className="ktab-pub-del-icon-box">
        <AlertTriangle size={28} />
      </div>

      <div>
        <h3 className="ktab-pub-del-title">تأكيد حذف حساب الناشر</h3>
        <p className="ktab-pub-del-desc">
          هل أنت متأكد من رغبتك في حذف حساب الناشر{" "}
          <span className="ktab-pub-del-highlight">«{displayName}»</span>؟
          <br />
          سيتم إلغاء صلاحيات النشر وحذف السجل المرتبط بالحساب نهائياً.
        </p>
      </div>

      <div className="ktab-pub-del-actions">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={deleting}
          className="w-full sm:w-auto"
        >
          إلغاء التراجع
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          loading={deleting}
          className="w-full sm:w-auto"
        >
          نعم، احذف الحساب
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="تأكيد الحذف"
        showCloseButton={!deleting}
      >
        {bodyContent}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={!deleting}
      maxWidth="max-w-md"
    >
      {bodyContent}
    </Modal>
  );
}

export default PublisherDeleteModal;
