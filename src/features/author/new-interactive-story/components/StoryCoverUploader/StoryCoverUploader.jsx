import React from "react";
import { Trash2, UploadCloud } from "lucide-react";
import { useStoryCoverUploader } from "./useStoryCoverUploader";
import "./StoryCoverUploader.css";

/**
 * Editorial Apple / Eleven Reader interactive story cover uploader.
 * Harmonized with book PDF and cover upload zones across the platform.
 * Pure declarative JSX using useStoryCoverUploader hook for all DOM and state operations.
 */
export function StoryCoverUploader({
  coverPreview,
  onCoverSelect,
  error,
}) {
  const {
    fileInputRef,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleRemoveCover,
    handleTriggerClick,
    handleKeyDown,
  } = useStoryCoverUploader({ onCoverSelect });

  return (
    <div className="new-story-cover-uploader">
      <div className="new-story-cover-uploader__header">
        <label className="new-story-cover-uploader__label">
          غلاف القصة التفاعلية
          <span className="new-story-cover-uploader__required">*</span>
        </label>
        <span className="new-story-cover-uploader__hint">
          صيغ PNG, JPG, WebP (حتى 5MB) · النسبة المطلوبة: 1:1 (مربعة)
        </span>
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
        onKeyDown={handleKeyDown}
      >
        {coverPreview ? (
          <div className="new-story-cover-uploader__showcase">
            <div
              className="new-story-cover-uploader__ambient"
              style={{ backgroundImage: `url(${coverPreview})` }}
              aria-hidden="true"
            />
            <div className="new-story-cover-uploader__cover-wrap">
              <img
                src={coverPreview}
                alt="معاينة غلاف القصة"
                className="new-story-cover-uploader__cover-img"
              />
            </div>
            <div className="new-story-cover-uploader__hover-overlay">
              <div className="new-story-cover-uploader__hover-actions">
                <button
                  type="button"
                  onClick={handleTriggerClick}
                  className="new-story-cover-uploader__btn-change"
                  title="تغيير الغلاف"
                  aria-label="تغيير الغلاف"
                >
                  <UploadCloud size={15} />
                  <span>تغيير الغلاف</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="new-story-cover-uploader__btn-remove"
                  title="إزالة الغلاف"
                  aria-label="إزالة الغلاف"
                >
                  <Trash2 size={15} />
                  <span>إزالة</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="new-story-cover-uploader__empty">
            <div className="new-story-cover-uploader__icon-badge">
              <UploadCloud size={24} strokeWidth={2.2} />
            </div>
            <div className="new-story-cover-uploader__cta-text">
              <span className="new-story-cover-uploader__cta-action">
                اسحب غلاف القصة هنا
              </span>
              <span className="new-story-cover-uploader__cta-sub">
                أو اضغط للتصفح من جهازك
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <span className="new-story-cover-uploader__error-text">{error}</span>}
    </div>
  );
}

export default StoryCoverUploader;
