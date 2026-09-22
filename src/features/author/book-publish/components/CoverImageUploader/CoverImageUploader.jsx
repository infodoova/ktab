import React, { memo } from "react";
import { UploadCloud, ImagePlus, Trash2 } from "lucide-react";
import { useCoverImageUploader } from "./useCoverImageUploader";
import "./CoverImageUploader.css";

/**
 * Editorial Apple / Eleven Reader cover image uploader.
 * Supports drag-and-drop, book ratio preview, and clean object URL disposal.
 * Pure declarative JSX using useCoverImageUploader hook for all state and DOM logic.
 */
export const CoverImageUploader = memo(function CoverImageUploader({
  coverFile,
  coverUrl,
  onFileChange,
  onRemoveFile,
  error,
}) {
  const {
    fileInputRef,
    isDragOver,
    previewSrc,
    handleSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleClick,
    handleKeyDown,
  } = useCoverImageUploader({
    coverFile,
    coverUrl,
    onFileChange,
    onRemoveFile,
  });

  return (
    <div className="book-cover-uploader">
      <div className="book-cover-uploader__header">
        <label className="book-cover-uploader__label">
          صورة الغلاف
          <span className="book-cover-uploader__required">*</span>
        </label>
        <span className="book-cover-uploader__hint">النسبة المطلوبة 1:1.6 (حتى 10MB)</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="book-cover-uploader__input"
        aria-label="رفع صورة غلاف الكتاب"
      />

      <div
        className={`book-cover-uploader__dropzone ${
          previewSrc ? "book-cover-uploader__dropzone--has-cover" : ""
        } ${isDragOver ? "book-cover-uploader__dropzone--dragover" : ""} ${
          error ? "book-cover-uploader__dropzone--error" : ""
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {previewSrc ? (
          /* Book cover preview mockup */
          <div className="book-cover-uploader__preview-wrap">
            <img
              src={previewSrc}
              alt="معاينة غلاف الكتاب"
              className="book-cover-uploader__preview-img"
            />
            <div className="book-cover-uploader__preview-overlay">
              <button
                type="button"
                onClick={handleRemove}
                className="book-cover-uploader__btn-remove"
                title="إزالة الغلاف"
                aria-label="إزالة الغلاف"
              >
                <Trash2 size={16} />
                <span>حذف</span>
              </button>
              <div className="book-cover-uploader__change-hint">
                <UploadCloud size={16} />
                <span>انقر لتغيير الصورة</span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty dropzone state */
          <div className="book-cover-uploader__empty">
            <div className="book-cover-uploader__icon-badge">
              <ImagePlus size={24} />
            </div>
            <div className="book-cover-uploader__cta-text">
              <span className="book-cover-uploader__cta-action">اسحب صورة الغلاف هنا</span>
              <span className="book-cover-uploader__cta-sub">أو اضغط للتصفح من جهازك (JPG, PNG, WebP)</span>
            </div>
          </div>
        )}
      </div>

      {error && <span className="book-cover-uploader__error-text">{error}</span>}
    </div>
  );
});

export default CoverImageUploader;
