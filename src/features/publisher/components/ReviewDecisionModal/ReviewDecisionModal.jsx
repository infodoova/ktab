import React, { useRef, useEffect } from "react";
import { CheckCircle, XCircle, X, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/myui/forms/Button";
import { useReviewDecisionModal } from "../../hooks/useReviewDecisionModal";
import "./ReviewDecisionModal.css";

/**
 * Editorial Decision Modal (Approve / Reject with Note & Strict Title Verification).
 * Pure declarative presentation powered by useReviewDecisionModal.
 */
export function ReviewDecisionModal({
  isOpen,
  book,
  actionType,
  onClose,
  onSuccess,
}) {
  const {
    note,
    setNote,
    confirmTitle,
    setConfirmTitle,
    isTitleMatched,
    expectedTitle,
    isSubmitDisabled,
    submitting,
    isApprove,
    handleSubmit,
  } = useReviewDecisionModal({
    book,
    actionType,
    onClose,
    onSuccess,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 90);
      return () => clearTimeout(timer);
    }
  }, [isOpen, actionType]);

  if (!isOpen || !book) return null;

  return (
    <div className="ktab-review-modal-backdrop" onClick={onClose} dir="rtl">
      <div
        className="ktab-review-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Grab Handle */}
        <div className="ktab-review-modal-handle" />

        {/* Header */}
        <div className="ktab-review-modal-header">
          <div className="ktab-review-modal-header-info">
            <div
              className={`ktab-review-modal-icon-badge ${
                isApprove
                  ? "ktab-review-modal-icon-badge--approve"
                  : "ktab-review-modal-icon-badge--reject"
              }`}
            >
              {isApprove ? (
                <CheckCircle size={20} strokeWidth={2.4} />
              ) : (
                <AlertTriangle size={20} strokeWidth={2.4} />
              )}
            </div>
            <div>
              <h3 className="ktab-review-modal-title">
                {isApprove ? "اعتماد وقبول الكتاب للنشر" : "إعادة الكتاب كمسودة"}
              </h3>
              <p className="ktab-review-modal-subtitle">
                الكتاب: «{expectedTitle || "بدون عنوان"}»
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ktab-review-modal-close-btn"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="ktab-review-modal-form">
          {/* Strict Title Verification Input */}
          <div className="ktab-review-modal-verify-group">
            <label htmlFor="review-title-confirm" className="ktab-review-modal-verify-label">
              <span>
                لتأكيد {isApprove ? "اعتماد وقبول" : "رفض وإعادة"} الكتاب، يرجى كتابة اسم الكتاب:
              </span>
              <strong className="ktab-review-modal-verify-target" dir="auto">
                {expectedTitle}
              </strong>
            </label>

            <div className="ktab-review-modal-input-wrapper">
              <input
                id="review-title-confirm"
                ref={inputRef}
                type="text"
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
                placeholder={`اكتب "${expectedTitle}" للتأكيد...`}
                className={`ktab-review-modal-input ${
                  isTitleMatched && confirmTitle.trim()
                    ? "ktab-review-modal-input--matched"
                    : ""
                }`}
                disabled={submitting}
                autoComplete="off"
                spellCheck={false}
                dir="auto"
              />
              {isTitleMatched && confirmTitle.trim() && (
                <span className="ktab-review-modal-matched-icon" title="الاسم متطابق">
                  <Check size={16} strokeWidth={2.6} />
                </span>
              )}
            </div>

            {!isTitleMatched && confirmTitle.trim().length > 0 && (
              <span className="ktab-review-modal-mismatch-hint">
                اسم الكتاب المدخل غير متطابق مع اسم الكتاب المطلوب
              </span>
            )}
          </div>

          {/* Editorial Note Field */}
          <div className="ktab-review-modal-field">
            <label htmlFor="review-editorial-note" className="ktab-review-modal-label">
              {isApprove
                ? "ملاحظات تحريرية للمؤلف (اختياري):"
                : "سبب الرفض والتعديلات المطلوبة من المؤلف (مطلوب):"}
            </label>
            <textarea
              id="review-editorial-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isApprove
                  ? "أضف أي إشادة أو تعليق تحريري للمؤلف..."
                  : "حدد بدقة النقاط التي تحتاج إلى تعديل أو سبب عدم مطابقة معايير النشر..."
              }
              className="ktab-review-modal-textarea"
              disabled={submitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="ktab-review-modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant={isApprove ? "teal" : "danger"}
              disabled={isSubmitDisabled}
              icon={isApprove ? <CheckCircle size={15} /> : <XCircle size={15} />}
            >
              {submitting
                ? "جاري المعالجة..."
                : isApprove
                ? "تأكيد القبول والنشر"
                : "تأكيد إعادة الكتاب"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewDecisionModal;
