import React, { memo } from "react";
import { Loader2 } from "lucide-react";
import "./UploadProgressModal.css";

/**
 * Editorial frosted glass upload and processing modal with live progress indicator.
 */
export const UploadProgressModal = memo(function UploadProgressModal({
  isOpen,
  progress = 0,
  title = "جاري حفظ وتجهيز الكتاب...",
}) {
  if (!isOpen) return null;

  return (
    <div className="book-upload-modal-overlay" role="dialog" aria-modal="true" dir="rtl">
      <div className="book-upload-modal-card">
        <div className="book-upload-modal-icon">
          <Loader2 size={28} className="book-upload-modal-spinner" />
        </div>

        <div className="book-upload-modal-text">
          <h3 className="book-upload-modal-title">{title}</h3>
          <p className="book-upload-modal-sub">يرجى الانتظار حتى اكتمال رفع الملفات والمعالجة</p>
        </div>

        <div className="book-upload-modal-progress-wrap">
          <div className="book-upload-modal-track">
            <div
              className="book-upload-modal-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <span className="book-upload-modal-percentage">{progress}%</span>
        </div>
      </div>
    </div>
  );
});

export default UploadProgressModal;
