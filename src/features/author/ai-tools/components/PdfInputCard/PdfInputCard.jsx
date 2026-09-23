import React from "react";
import { Select } from "@/components/myui";
import { PdfUploadZone } from "@/components/common";
import { usePdfInputCard } from "./usePdfInputCard";
import "./PdfInputCard.css";

/**
 * Pure presentation card for uploading book PDF, selecting target audience,
 * and configuring word count for AI-driven ending generation.
 */
export function PdfInputCard({ onGenerate, loading = false, showHeader = true }) {
  const {
    file,
    wordCount,
    setWordCount,
    audience,
    setAudience,
    audienceOptions,
    wordCountConfig,
    errors,
    handleFileChange,
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

      {/* PDF Upload Dropzone (matching Author studio unified design) */}
      <div className="ktab-pdf-input-field">
        <PdfUploadZone
          pdfFile={file}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          error={errors.file}
          label="ملف الكتاب (PDF)"
          hint="صيغة PDF فقط (حتى 50MB)"
          required={true}
          dropzoneTitle="اسحب مسودة الكتاب هنا (PDF)"
          dropzoneSub="أو اضغط للتصفح من جهازك"
          compact={true}
        />
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
