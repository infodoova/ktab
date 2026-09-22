import React from "react";
import { Modal } from "@/components/myui/Modal";
import { BottomSheet } from "@/components/myui/BottomSheet";
import { Input } from "@/components/myui/forms/Input";
import { Textarea } from "@/components/myui/forms/Textarea";
import { Select } from "@/components/myui/forms/Select";
import { Button } from "@/components/myui/forms/Button";
import { useLibraryEditModal } from "../../hooks/useLibraryEditModal";
import "./LibraryEditModal.css";

/**
 * Pure Declarative View: Responsive Modal / BottomSheet for editing existing library organization details.
 * All state, event handlers, and media-query logic reside in useLibraryEditModal.
 */
export function LibraryEditModal({ isOpen, library, onClose, onSuccess }) {
  const {
    isMobile,
    statusOptions,
    formData,
    errors,
    submitting,
    handleFieldChange,
    handleSubmit,
  } = useLibraryEditModal({
    library,
    onClose,
    onSuccess,
  });

  const bodyContent = (
    <form onSubmit={handleSubmit} className="ktab-lib-edit-form">
      <Input
        label="اسم المكتبة / المنظمة"
        value={formData.name}
        onChange={(e) => handleFieldChange("name", e.target.value)}
        error={errors.name}
        required
      />

      <Textarea
        label="الوصف"
        value={formData.description}
        onChange={(e) => handleFieldChange("description", e.target.value)}
        rows={2}
      />

      <div className="ktab-lib-edit-grid">
        <Input
          label="المدينة"
          value={formData.city}
          onChange={(e) => handleFieldChange("city", e.target.value)}
          error={errors.city}
          required
        />
        <Input
          label="الدولة"
          value={formData.country}
          onChange={(e) => handleFieldChange("country", e.target.value)}
          error={errors.country}
          required
        />
      </div>

      <div className="ktab-lib-edit-grid">
        <Input
          label="العنوان التفصيلي"
          value={formData.address}
          onChange={(e) => handleFieldChange("address", e.target.value)}
        />
        <Input
          label="رقم الهاتف"
          value={formData.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
        />
      </div>

      <div className="ktab-lib-edit-grid">
        <Input
          label="البريد الإلكتروني"
          type="email"
          value={formData.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
        />
        <Select
          label="الحالة"
          options={statusOptions}
          value={formData.status}
          onChange={(e) => handleFieldChange("status", e.target.value)}
        />
      </div>

      <div className="ktab-lib-edit-actions">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={submitting}
          type="button"
        >
          إلغاء
        </Button>
        <Button
          variant="primary"
          type="submit"
          loading={submitting}
        >
          حفظ التعديلات
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="تعديل بيانات المكتبة"
        showCloseButton={!submitting}
      >
        {bodyContent}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل بيانات المكتبة"
      description={`تعديل معلومات منظمة «${library?.name}»`}
      showCloseButton={!submitting}
      maxWidth="max-w-xl"
    >
      {bodyContent}
    </Modal>
  );
}

export default LibraryEditModal;
