import React, { useRef, useMemo, useEffect, useState, memo } from "react";
import { UploadCloud, ImagePlus, Trash2 } from "lucide-react";
import "./CoverImageUploader.css";

/**
 * Editorial Apple / Eleven Reader cover image uploader.
 * Supports drag-and-drop, book ratio preview, and clean object URL disposal.
 */
export const CoverImageUploader = memo(function CoverImageUploader({
  coverFile,
  coverUrl,
  onFileChange,
  onRemoveFile,
  error,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Generate preview URL safely
  const previewSrc = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }
    return coverUrl || null;
  }, [coverFile, coverUrl]);

  // Clean up object URL when changed or unmounted to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

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

  return (
    <div className="book-cover-uploader">
      <div className="book-cover-uploader__header">
        <label className="book-cover-uploader__label">
          غلاف الكتاب
          <span className="book-cover-uploader__required">*</span>
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
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
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {previewSrc ? (
          <div className="book-cover-uploader__preview-wrap">
            <img
              src={previewSrc}
              alt="معاينة غلاف الكتاب"
              className="book-cover-uploader__preview-img"
            />
            <div className="book-cover-uploader__preview-overlay">
              <button
                type="button"
                className="book-cover-uploader__btn-remove"
                onClick={handleRemove}
                title="حذف الغلاف"
                aria-label="حذف الغلاف"
              >
                <Trash2 size={16} />
                <span>حذف</span>
              </button>
              <div className="book-cover-uploader__change-hint">
                <UploadCloud size={16} />
                <span>انقر للتغيير</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="book-cover-uploader__empty">
            <div className="book-cover-uploader__icon-badge">
              <ImagePlus size={22} />
            </div>
            <div className="book-cover-uploader__cta-text">
              <span className="book-cover-uploader__cta-action">اسحب الغلاف هنا</span>
              <span className="book-cover-uploader__cta-sub">أو اضغط لتصفح الملفات</span>
            </div>
          </div>
        )}
      </div>

      {/* Format note under the dropzone */}
      <p className="book-cover-uploader__note">
        صيغ الصور المدعومة: JPG، PNG، WebP (حتى 10MB) · النسبة المقترحة: 1.6:1
      </p>

      {error && <span className="book-cover-uploader__error-text">{error}</span>}
    </div>
  );
});

export default CoverImageUploader;
