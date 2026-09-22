import React from "react";
import { Upload, FileText, Sparkles, X, Loader2 } from "lucide-react";
import { Select } from "@/components/myui";
import { usePdfInputCard } from "./usePdfInputCard";
import "./PdfInputCard.css";

/**
 * Pure presentation card for uploading book PDF, selecting target audience,
 * and configuring word count for AI-driven ending generation.
 */
export function PdfInputCard({ onGenerate, loading = false, showHeader = true }) {
  const {
    file,
    fileInputRef,
    wordCount,
    setWordCount,
    audience,
    setAudience,
    audienceOptions,
    wordCountConfig,
    isDragging,
    formattedFileSize,
    errors,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    handleTrigger,
  } = usePdfInputCard({ onGenerate, loading });

  return (
    <form
      onSubmit={handleTrigger}
      className="ktab-pdf-input-card"
      dir="rtl"
      aria-label="نموذج توليد الخاتمة"
    >
      {showHeader && (
        <div className="ktab-pdf-input-card__title-group">
          <h3 className="ktab-pdf-input-card__title">إعدادات التحليل والتوليد</h3>
          <p className="ktab-pdf-input-card__subtitle">
            ارفع مسودة الكتاب وحدد الخصائص لصياغة خاتمة احترافية
          </p>
        </div>
      )}

      {/* PDF Upload Dropzone */}
      <div className="ktab-pdf-input-field">
        <div className="ktab-pdf-input-label-row">
          <span className="ktab-pdf-input-label">
            ملف الكتاب (PDF) <span className="ktab-pdf-input-required">*</span>
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-label="اختيار ملف PDF"
        />

        {file ? (
          <div className="ktab-pdf-file-card">
            <div className="ktab-pdf-file-card__meta">
              <div className="ktab-pdf-file-card__icon" aria-hidden="true">
                <FileText size={18} strokeWidth={2} />
              </div>
              <div className="ktab-pdf-file-card__text">
                <span className="ktab-pdf-file-card__name" title={file.name}>
                  {file.name}
                </span>
                <span className="ktab-pdf-file-card__size">{formattedFileSize}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="ktab-pdf-file-card__remove-btn"
              aria-label="حذف الملف المختار"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`ktab-pdf-dropzone ${
              isDragging ? "ktab-pdf-dropzone--dragging" : ""
            } ${errors.file ? "ktab-pdf-dropzone--error" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="انقر أو اسحب ملف PDF للرفع"
          >
            <div className="ktab-pdf-dropzone__icon-wrap" aria-hidden="true">
              <Upload size={20} strokeWidth={2} />
            </div>
            <span className="ktab-pdf-dropzone__prompt">اسحب مسودة الكتاب هنا أو تصفح</span>
            <span className="ktab-pdf-dropzone__hint">صيغة PDF فقط • حتى 20 ميغابايت</span>
          </div>
        )}

        {errors.file && (
          <span className="ktab-pdf-field-error" role="alert">
            {errors.file}
          </span>
        )}
      </div>

      {/* Audience Profile with Global Select */}
      <div className="ktab-pdf-input-field">
        <div className="ktab-pdf-input-label-row">
          <span className="ktab-pdf-input-label">الفئة والأسلوب المستهدف</span>
        </div>
        <Select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          options={audienceOptions}
          placeholder="اختر الفئة المستهدفة"
        />
        {errors.audience && (
          <span className="ktab-pdf-field-error" role="alert">
            {errors.audience}
          </span>
        )}
      </div>

      {/* Word Count Range Slider */}
      <div className="ktab-pdf-input-field">
        <div className="ktab-pdf-input-label-row">
          <span className="ktab-pdf-input-label">طول الخاتمة التقريبي</span>
          <span className="ktab-pdf-word-count-badge">
            {wordCount} كلمة
          </span>
        </div>
        <input
          type="range"
          min={wordCountConfig.MIN}
          max={wordCountConfig.MAX}
          step={wordCountConfig.STEP}
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className="ktab-pdf-slider"
          aria-label="عدد الكلمات التقريبي للخاتمة"
        />
      </div>

      {/* Submit Action Button - No icon, no AI mention */}
      <button
        type="submit"
        disabled={loading}
        className="ktab-pdf-submit-btn"
      >
        <span>{loading ? "جاري التوليد..." : "توليد الخاتمة"}</span>
      </button>
    </form>
  );
}

export default PdfInputCard;
