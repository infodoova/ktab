import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2, Check } from "lucide-react";
import { Modal } from "../Modal";
import { BottomSheet } from "../BottomSheet";
import "./DeleteConfirmModal.css";

/**
 * Normalizes text for comparison by trimming and collapsing multiple whitespace characters.
 */
function normalizeText(str) {
  return (str || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Unified, strict delete confirmation modal used across ALL app roles.
 * Requires the user to explicitly type the name/title of the item to be deleted,
 * preventing accidental destructive operations and ensuring strong frontend validation.
 */
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد من رغبتك في الحذف؟",
  highlightText = "",
  subDescription = "",
  confirmLabel = "نعم، احذف",
  cancelLabel = "إلغاء التراجع",
  loading = false,
  requireMatch = true,
}) {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  const cleanExpected = (highlightText || "").trim();
  const isVerificationRequired = Boolean(requireMatch && cleanExpected);
  const isMatch =
    !isVerificationRequired || normalizeText(inputText) === normalizeText(cleanExpected);

  // Reset input and focus on modal open
  useEffect(() => {
    if (isOpen) {
      setInputText("");
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 90);
      return () => clearTimeout(timer);
    }
  }, [isOpen, cleanExpected]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMatch && !loading) {
      onConfirm?.();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className="ktab-confirm-del-card" dir="rtl">
      {/* Explicit Close Button at top corner */}
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="ktab-confirm-del__close-btn"
        aria-label="إغلاق"
        title="إغلاق"
      >
        <X size={16} strokeWidth={2.2} />
      </button>

      {/* Red Alert Icon Box */}
      <div className="ktab-confirm-del__icon-box">
        <AlertTriangle size={28} strokeWidth={2.2} />
      </div>

      {/* Body Content */}
      <div className="ktab-confirm-del__body">
        <h3 className="ktab-confirm-del__title">{title}</h3>
        <p className="ktab-confirm-del__desc">
          {description}{" "}
          {cleanExpected && (
            <span className="ktab-confirm-del__highlight">«{cleanExpected}»</span>
          )}
          {subDescription && (
            <span className="ktab-confirm-del__warning-note">{subDescription}</span>
          )}
        </p>
      </div>

      {/* Form with Strict Verification & Actions */}
      <form onSubmit={handleSubmit} className="ktab-confirm-del__form">
        {isVerificationRequired && (
          <div className="ktab-confirm-del__verify-block">
            <label htmlFor="ktab-del-confirm-input" className="ktab-confirm-del__verify-label">
              <span>لتأكيد الحذف نهائياً، يرجى كتابة اسم العنصر:</span>
              <strong className="ktab-confirm-del__verify-target" dir="auto">
                {cleanExpected}
              </strong>
            </label>

            <div className="ktab-confirm-del__input-wrapper">
              <input
                id="ktab-del-confirm-input"
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`اكتب "${cleanExpected}" للتأكيد...`}
                className={`ktab-confirm-del__input ${
                  isMatch && inputText.trim() ? "ktab-confirm-del__input--matched" : ""
                }`}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                dir="auto"
              />
              {isMatch && inputText.trim() && (
                <span
                  className="ktab-confirm-del__matched-icon"
                  aria-label="الاسم متطابق"
                  title="الاسم متطابق"
                >
                  <Check size={16} strokeWidth={2.6} />
                </span>
              )}
            </div>

            {!isMatch && inputText.trim().length > 0 && (
              <span className="ktab-confirm-del__mismatch-hint">
                الاسم المدخل غير متطابق مع اسم العنصر المطلوب
              </span>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="ktab-confirm-del__actions">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="ktab-confirm-del__btn-cancel"
          >
            {cancelLabel}
          </button>

          <button
            type="submit"
            disabled={!isMatch || loading}
            className="ktab-confirm-del__btn-confirm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>{loading ? "جاري الحذف..." : confirmLabel}</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} showCloseButton={false}>
        <div className="p-2" dir="rtl">
          {content}
        </div>
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="ktab-confirm-del-modal"
    >
      {content}
    </Modal>
  );
}

export default DeleteConfirmModal;
