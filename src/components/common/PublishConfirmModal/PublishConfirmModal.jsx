import React from "react";
import { UploadCloud, AlertTriangle, CheckCircle, Check, X, Info } from "lucide-react";
import { Button } from "@/components/myui/forms/Button";
import { usePublishConfirmModal } from "./usePublishConfirmModal";
import "./PublishConfirmModal.css";

/**
 * Editorial Apple-style confirmation modal required before publishing any book.
 * - Forces strict title typing verification to prevent accidental publication.
 * - Displays an explicit warning that books cannot be edited once published.
 * - For authors: clearly states that the book will be submitted under review before public release.
 */
export function PublishConfirmModal({
  isOpen,
  expectedTitle = "",
  isAuthor = true,
  loading = false,
  onConfirm,
  onClose,
}) {
  const {
    confirmTitle,
    setConfirmTitle,
    isTitleMatched,
    inputRef,
    handleSubmit,
    isSubmitDisabled,
  } = usePublishConfirmModal({
    isOpen,
    expectedTitle,
    onConfirm,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="ktab-publish-modal-backdrop" onClick={onClose} dir="rtl">
      <div
        className="ktab-publish-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Drag Handle */}
        <div className="ktab-publish-modal-handle" />

        {/* Header */}
        <div className="ktab-publish-modal-header">
          <div className="ktab-publish-modal-header-info">
            <div className="ktab-publish-modal-icon-badge">
              <UploadCloud size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="ktab-publish-modal-title">تأكيد نشر الكتاب</h3>
              <p className="ktab-publish-modal-subtitle">
                الكتاب: «{expectedTitle || "بدون عنوان"}»
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ktab-publish-modal-close-btn"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="ktab-publish-modal-form">
          {/* Editorial Warning & Information Notices */}
          <div className="ktab-publish-modal-alert">
            <div className="ktab-publish-modal-alert-item">
              <AlertTriangle
                size={17}
                className="ktab-publish-modal-alert-icon ktab-publish-modal-alert-icon--warning"
              />
              <p className="ktab-publish-modal-alert-text">
                <strong>تنبيه نهائي:</strong> لن تتمكن من تعديل بيانات أو ملفات هذا الكتاب بعد النشر نهائياً.
              </p>
            </div>

            {isAuthor && (
              <div className="ktab-publish-modal-alert-item">
                <Info
                  size={17}
                  className="ktab-publish-modal-alert-icon ktab-publish-modal-alert-icon--info"
                />
                <p className="ktab-publish-modal-alert-text">
                  <strong>ملاحظة للمؤلفين:</strong> سيتم إرسال هذا الكتاب ليكون <strong>قيد المراجعة والتدقيق (Under Review)</strong>، وسيتم نشره رسمياً في المنصة فور اعتماده والموافقة عليه من قبل إدارة النشر.
                </p>
              </div>
            )}
          </div>

          {/* Strict Title Verification Input */}
          <div className="ktab-publish-modal-verify-group">
            <label htmlFor="publish-title-confirm" className="ktab-publish-modal-verify-label">
              <span>لتأكيد نشر هذا الكتاب، يرجى كتابة اسم الكتاب أدناه:</span>
              <strong className="ktab-publish-modal-verify-target" dir="auto">
                {expectedTitle}
              </strong>
            </label>

            <div className="ktab-publish-modal-input-wrapper">
              <input
                id="publish-title-confirm"
                ref={inputRef}
                type="text"
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
                placeholder={`اكتب "${expectedTitle}" للتأكيد...`}
                className={`ktab-publish-modal-input ${
                  isTitleMatched && confirmTitle.trim()
                    ? "ktab-publish-modal-input--matched"
                    : ""
                }`}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                dir="auto"
              />
              {isTitleMatched && confirmTitle.trim() && (
                <span className="ktab-publish-modal-matched-icon" title="الاسم متطابق">
                  <Check size={16} strokeWidth={2.6} />
                </span>
              )}
            </div>

            {!isTitleMatched && confirmTitle.trim().length > 0 && (
              <span className="ktab-publish-modal-mismatch-hint">
                اسم الكتاب المدخل غير متطابق مع اسم الكتاب المطلوب
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="ktab-publish-modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitDisabled || loading}
              icon={<CheckCircle size={15} />}
            >
              {loading
                ? "جاري المعالجة..."
                : isAuthor
                ? "تأكيد وإرسال للمراجعة"
                : "تأكيد النشر الآن"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PublishConfirmModal;
