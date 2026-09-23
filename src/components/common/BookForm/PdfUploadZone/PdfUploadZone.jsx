import React, { memo } from "react";
import { BookOpen, UploadCloud, Trash2 } from "lucide-react";
import { usePdfUploadZone } from "./usePdfUploadZone";
import "./PdfUploadZone.css";

/**
 * Editorial Apple / Eleven Reader book PDF document upload zone.
 * Strictly accepts PDF files with drag-and-drop, real-time page count display,
 * and clean hover overlay actions matching the cover album uploader design.
 * Pure declarative component with state handled in usePdfUploadZone.
 */
export const PdfUploadZone = memo(function PdfUploadZone({
  pdfFile,
  existingPdfName,
  pageCount = 0,
  onFileChange,
  onRemoveFile,
  error,
  label = "ملف الكتاب (PDF)",
  hint = "صيغة PDF فقط (حتى 100MB)",
  required = true,
  dropzoneTitle = "اسحب ملف الكتاب هنا (PDF)",
  dropzoneSub = "أو اضغط للتصفح من جهازك",
  className = "",
  compact = false,
}) {
  const {
    fileInputRef,
    isDragOver,
    displayName,
    fileSizeMB,
    handleSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleClick,
    handleKeyDown,
  } = usePdfUploadZone({
    pdfFile,
    existingPdfName,
    onFileChange,
    onRemoveFile,
  });

  return (
    <div className={`book-pdf-uploader ${compact ? "book-pdf-uploader--compact" : ""} ${className}`}>
      {label && (
        <div className="book-pdf-uploader__header">
          <label className="book-pdf-uploader__label">
            {label}
            {required && <span className="book-pdf-uploader__required">*</span>}
          </label>
          {hint && <span className="book-pdf-uploader__hint">{hint}</span>}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleSelect}
        className="book-pdf-uploader__input"
        aria-label={label || "رفع ملف الكتاب بصيغة PDF"}
      />

      <div
        className={`book-pdf-uploader__dropzone ${
          displayName ? "book-pdf-uploader__dropzone--has-file" : ""
        } ${isDragOver ? "book-pdf-uploader__dropzone--dragover" : ""} ${
          error ? "book-pdf-uploader__dropzone--error" : ""
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {displayName ? (
          /* Book document full card display with hover overlay */
          <div className="book-pdf-uploader__content">
            <div className="book-pdf-uploader__icon-wrap">
              <BookOpen size={30} strokeWidth={1.8} />
            </div>

            <div className="book-pdf-uploader__details">
              <span className="book-pdf-uploader__file-name" title={displayName}>
                {displayName}
              </span>

              <div className="book-pdf-uploader__metrics">
                <span className="book-pdf-uploader__metric-pill">
                  <span className="book-pdf-uploader__metric-label">صيغة:</span>
                  <strong>PDF</strong>
                </span>
                {pageCount > 0 && (
                  <span className="book-pdf-uploader__metric-pill">
                    <span className="book-pdf-uploader__metric-label">الصفحات:</span>
                    <strong>{pageCount} صفحة</strong>
                  </span>
                )}
                {fileSizeMB && (
                  <span className="book-pdf-uploader__metric-pill">
                    <span className="book-pdf-uploader__metric-label">الحجم:</span>
                    <strong>{fileSizeMB} MB</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Hover overlay with action pills */}
            <div className="book-pdf-uploader__hover-overlay">
              <div className="book-pdf-uploader__hover-actions">
                <button
                  type="button"
                  onClick={handleClick}
                  className="book-pdf-uploader__btn-change"
                  title="تغيير الملف"
                  aria-label="تغيير الملف"
                >
                  <UploadCloud size={15} />
                  <span>تغيير الملف</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="book-pdf-uploader__btn-remove"
                  title="إزالة الملف"
                  aria-label="إزالة الملف"
                >
                  <Trash2 size={15} />
                  <span>إزالة</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty dropzone */
          <div className="book-pdf-uploader__empty">
            <div className="book-pdf-uploader__icon-badge">
              <UploadCloud size={24} strokeWidth={2.2} />
            </div>
            <div className="book-pdf-uploader__cta-text">
              <span className="book-pdf-uploader__cta-action">{dropzoneTitle}</span>
              <span className="book-pdf-uploader__cta-sub">{dropzoneSub}</span>
            </div>
          </div>
        )}
      </div>

      {error && <span className="book-pdf-uploader__error-text">{error}</span>}
    </div>
  );
});

export default PdfUploadZone;
