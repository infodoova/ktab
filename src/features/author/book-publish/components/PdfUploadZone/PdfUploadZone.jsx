import React, { memo } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { usePdfUploadZone } from "./usePdfUploadZone";
import "./PdfUploadZone.css";

/**
 * Editorial Apple / Eleven Reader book PDF document upload zone.
 * Strictly accepts PDF files with drag-and-drop, real-time page count display,
 * and clean file removal action.
 * Pure declarative component with state handled in usePdfUploadZone.
 */
export const PdfUploadZone = memo(function PdfUploadZone({
  pdfFile,
  existingPdfName,
  pageCount = 0,
  onFileChange,
  onRemoveFile,
  error,
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
    <div className="book-pdf-uploader">
      <div className="book-pdf-uploader__header">
        <label className="book-pdf-uploader__label">
          ملف الكتاب (PDF)
          <span className="book-pdf-uploader__required">*</span>
        </label>
        <span className="book-pdf-uploader__hint">صيغة PDF فقط (حتى 100MB)</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleSelect}
        className="book-pdf-uploader__input"
        aria-label="رفع ملف الكتاب بصيغة PDF"
      />

      {displayName ? (
        /* File card shown once a file is selected or exists */
        <div className="book-pdf-uploader__file-card">
          <div className="book-pdf-uploader__file-icon-wrap">
            <FileText size={22} />
          </div>

          <div className="book-pdf-uploader__file-body">
            <div className="book-pdf-uploader__file-title-row">
              <span className="book-pdf-uploader__file-name" title={displayName}>
                {displayName}
              </span>
              <span className="book-pdf-uploader__type-badge">PDF</span>
            </div>
            <div className="book-pdf-uploader__file-meta">
              {pageCount > 0 && (
                <span className="book-pdf-uploader__meta-item">{pageCount} صفحة</span>
              )}
              {fileSizeMB && (
                <span className="book-pdf-uploader__meta-item">{fileSizeMB} MB</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="book-pdf-uploader__btn-remove"
            title="إزالة الملف"
            aria-label="إزالة ملف الكتاب"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        /* Empty dropzone */
        <div
          className={`book-pdf-uploader__dropzone ${
            isDragOver ? "book-pdf-uploader__dropzone--dragover" : ""
          } ${error ? "book-pdf-uploader__dropzone--error" : ""}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="book-pdf-uploader__icon-badge">
            <UploadCloud size={20} />
          </div>
          <div className="book-pdf-uploader__cta-text">
            <span className="book-pdf-uploader__cta-action">اسحب ملف الكتاب هنا (PDF)</span>
            <span className="book-pdf-uploader__cta-sub">أو اضغط للتصفح من جهازك (.pdf)</span>
          </div>
        </div>
      )}

      {error && <span className="book-pdf-uploader__error-text">{error}</span>}
    </div>
  );
});

export default PdfUploadZone;
