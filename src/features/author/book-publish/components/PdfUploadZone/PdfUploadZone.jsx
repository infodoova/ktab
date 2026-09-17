import React, { useRef, useState, memo } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import "./PdfUploadZone.css";

/**
 * Editorial Apple / Eleven Reader PDF upload zone.
 * Features drag-and-drop, real-time page count display, and a clean file removal action.
 */
export const PdfUploadZone = memo(function PdfUploadZone({
  pdfFile,
  existingPdfName,
  pageCount = 0,
  onFileChange,
  onRemoveFile,
  error,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const displayName = pdfFile?.name || existingPdfName;

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveFile();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const fileSizeMB = pdfFile?.size
    ? (pdfFile.size / (1024 * 1024)).toFixed(1)
    : null;

  return (
    <div className="book-pdf-uploader">
      <div className="book-pdf-uploader__header">
        <label className="book-pdf-uploader__label">
          ملف الكتاب (PDF)
          <span className="book-pdf-uploader__required">*</span>
        </label>
        <span className="book-pdf-uploader__hint">حتى 100MB</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleSelect}
        className="book-pdf-uploader__input"
        aria-label="رفع ملف الكتاب بتنسيق PDF"
      />

      {displayName ? (
        /* File card shown once a file is selected or exists */
        <div className="book-pdf-uploader__file-card">
          <div className="book-pdf-uploader__file-icon-wrap">
            <FileText size={22} />
          </div>

          <div className="book-pdf-uploader__file-body">
            <span className="book-pdf-uploader__file-name" title={displayName}>
              {displayName}
            </span>
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
            aria-label="إزالة ملف PDF"
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
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <div className="book-pdf-uploader__icon-badge">
            <UploadCloud size={20} />
          </div>
          <div className="book-pdf-uploader__cta-text">
            <span className="book-pdf-uploader__cta-action">اسحب ملف PDF هنا</span>
            <span className="book-pdf-uploader__cta-sub">أو اضغط للتصفح من جهازك</span>
          </div>
        </div>
      )}

      {error && <span className="book-pdf-uploader__error-text">{error}</span>}
    </div>
  );
});

export default PdfUploadZone;
