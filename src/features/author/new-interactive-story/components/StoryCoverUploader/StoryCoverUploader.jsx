import React, { useRef, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import "./StoryCoverUploader.css";

/**
 * Editorial Apple / Eleven Reader interactive story cover uploader.
 * Streamlined horizontal dropzone with crisp borders, clean preview, and helper note underneath.
 */
export function StoryCoverUploader({
  coverPreview,
  onCoverSelect,
  error,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
      onCoverSelect(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onCoverSelect(files[0]);
    }
  };

  const handleRemoveCover = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCoverSelect(null);
  };

  const handleTriggerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="new-story-cover-uploader">
      <div className="new-story-cover-uploader__header">
        <label className="new-story-cover-uploader__label">
          غلاف القصة التفاعلية
          <span className="new-story-cover-uploader__required">*</span>
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="new-story-cover-uploader__input"
        onChange={handleFileChange}
        aria-label="رفع صورة غلاف القصة"
      />

      <div
        className={`new-story-cover-uploader__dropzone ${
          coverPreview ? "new-story-cover-uploader__dropzone--has-cover" : ""
        } ${isDragOver ? "new-story-cover-uploader__dropzone--dragover" : ""} ${
          error ? "new-story-cover-uploader__dropzone--error" : ""
        }`}
        onClick={handleTriggerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTriggerClick();
          }
        }}
      >
        {coverPreview ? (
          <div className="new-story-cover-uploader__preview-wrap">
            <img
              src={coverPreview}
              alt="معاينة غلاف القصة"
              className="new-story-cover-uploader__preview-img"
            />
            <div className="new-story-cover-uploader__preview-overlay">
              <button
                type="button"
                className="new-story-cover-uploader__btn-remove"
                onClick={handleRemoveCover}
                title="إزالة الغلاف"
                aria-label="إزالة الغلاف"
              >
                <Trash2 size={16} />
                <span>حذف</span>
              </button>
              <div className="new-story-cover-uploader__change-hint">
                <UploadCloud size={16} />
                <span>انقر للتغيير</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="new-story-cover-uploader__empty">
            <div className="new-story-cover-uploader__icon-badge">
              <ImagePlus size={22} />
            </div>
            <div className="new-story-cover-uploader__cta-text">
              <span className="new-story-cover-uploader__cta-action">اسحب الغلاف هنا</span>
              <span className="new-story-cover-uploader__cta-sub">أو اضغط للتصفح من جهازك</span>
            </div>
          </div>
        )}
      </div>

      {/* Helper note placed underneath */}
      <p className="new-story-cover-uploader__note">
        صيغ الصور المدعومة: PNG، JPG، WebP (حتى 5MB) · النسبة المقترحة: 3:4
      </p>

      {error && <span className="new-story-cover-uploader__error-text">{error}</span>}
    </div>
  );
}

export default StoryCoverUploader;
