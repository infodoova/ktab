import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/myui/Modal";
import { BottomSheet } from "@/components/myui/BottomSheet";
import { Button } from "@/components/myui/forms/Button";
import { useLibraryDeleteModal } from "../../hooks/useLibraryDeleteModal";
import "./LibraryDeleteModal.css";

/**
 * Pure Declarative View: Responsive verification dialog for deleting a library.
 * All logic, media query checks, and state handling reside exclusively in useLibraryDeleteModal.
 */
export function LibraryDeleteModal({ isOpen, library, onClose, onSuccess }) {
  const { isMobile, deleting, handleDelete } = useLibraryDeleteModal({
    library,
    onClose,
    onSuccess,
  });

  const bodyContent = (
    <div className="ktab-lib-del-content">
      <div className="ktab-lib-del-icon-box">
        <AlertTriangle size={28} />
      </div>

      <div>
        <h3 className="ktab-lib-del-title">تأكيد حذف المنظمة والمكتبة</h3>
        <p className="ktab-lib-del-desc">
          هل أنت متأكد من رغبتك في حذف مكتبة{" "}
          <span className="ktab-lib-del-highlight">«{library?.name}»</span>؟
          <br />
          سيؤدي هذا الإجراء إلى حذف جميع الكتب، المشرف، وطاقم العمل المرتبطين بها نهائياً.
        </p>
      </div>

      <div className="ktab-lib-del-actions">
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
          نعم، احذف المكتبة
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

export default LibraryDeleteModal;
