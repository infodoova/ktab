import React, { useRef } from "react";
import { AppLayout } from "@/components/myui/layout";
import {
  useStoryEditor,
  GENRE_PRESETS,
  LENS_OPTIONS,
  ART_STYLES,
} from "../hooks/useStoryEditor";
import { Upload, Send, Loader2, X } from "lucide-react";
import "./NewInteractiveStoryView.css";

/**
 * Pure presentation view for creating new interactive stories.
 * Styled with Ktab's Eleven Reader + Apple design system.
 */
export function NewInteractiveStoryView({ pageName = "قصة تفاعلية جديدة" }) {
  const {
    formData,
    coverPreview,
    isSubmitting,
    handleInputChange,
    handleCoverSelect,
    handleSubmit,
  } = useStoryEditor();

  const fileInputRef = useRef(null);

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <form onSubmit={handleSubmit} className="ktab-story-editor-page" dir="rtl">
        <div className="ktab-story-form-card">
          <h2 className="ktab-story-form-title">
            إعداد وتأسيس عالم القصة التفاعلية
          </h2>

          {/* Title */}
          <div className="ktab-form-group">
            <label className="ktab-form-label">
              عنوان القصة <span className="ktab-form-required">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="مثال: سر الكهف المفقود..."
              className="ktab-form-input"
              required
            />
          </div>

          {/* Genre Selection Grid */}
          <div className="ktab-form-group">
            <label className="ktab-form-label">
              نوع القصة والتصنيف <span className="ktab-form-required">*</span>
            </label>
            <div className="ktab-genre-grid">
              {GENRE_PRESETS.map((g) => {
                const active = formData.genre === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleInputChange("genre", g.id)}
                    className={`ktab-genre-card ${
                      active ? "ktab-genre-card--active" : ""
                    }`}
                  >
                    <span className="ktab-genre-card__name">{g.name}</span>
                    <span className="ktab-genre-card__desc">{g.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narrative Lens & Art Style */}
          <div className="ktab-form-row">
            {/* Lens */}
            <div className="ktab-form-group">
              <label className="ktab-form-label">
                منظور السرد <span className="ktab-form-required">*</span>
              </label>
              <select
                value={formData.lens}
                onChange={(e) => handleInputChange("lens", e.target.value)}
                className="ktab-form-select"
              >
                {LENS_OPTIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} - {l.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Art Style */}
            <div className="ktab-form-group">
              <label className="ktab-form-label">
                النمط البصري لتوليد المشاهد <span className="ktab-form-required">*</span>
              </label>
              <select
                value={formData.artStyle}
                onChange={(e) => handleInputChange("artStyle", e.target.value)}
                className="ktab-form-select"
              >
                {ART_STYLES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Scenes Slider */}
          <div className="ktab-form-group">
            <div className="ktab-slider-header">
              <label className="ktab-form-label">
                أقصى عدد لمشاهد المسار الواحد
              </label>
              <span className="ktab-slider-badge">
                {formData.sceneCount} مشاهد
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={formData.sceneCount}
              onChange={(e) => handleInputChange("sceneCount", Number(e.target.value))}
              className="ktab-range-slider"
            />
          </div>

          {/* Constitution / Narrative Setup */}
          <div className="ktab-form-group">
            <label className="ktab-form-label">
              تمهيد القصة وقوانين العالم <span className="ktab-form-required">*</span>
            </label>
            <textarea
              rows={5}
              value={formData.constitution}
              onChange={(e) => handleInputChange("constitution", e.target.value)}
              placeholder="اكتب تمهيد القصة، الشخصيات الرئيسية، والأحداث التأسيسية التي يبدأ منها القارئ رحلته..."
              className="ktab-form-textarea"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="ktab-form-group">
            <label className="ktab-form-label">
              صورة غلاف القصة <span className="ktab-form-required">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleCoverSelect(e.target.files?.[0])}
              className="hidden"
            />

            {coverPreview ? (
              <div className="ktab-cover-preview-wrap">
                <img src={coverPreview} alt="غلاف القصة" className="ktab-cover-preview-img" />
                <button
                  type="button"
                  onClick={() => handleCoverSelect(null)}
                  className="ktab-cover-preview-remove"
                  title="حذف الغلاف"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="ktab-cover-dropzone"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="ktab-cover-dropzone__icon-wrap">
                  <Upload size={24} strokeWidth={1.8} />
                </div>
                <span className="ktab-cover-dropzone__primary-text">رفع صورة الغلاف</span>
                <span className="ktab-cover-dropzone__secondary-text">JPG أو PNG (حتى 5MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="ktab-form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ktab-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>جاري بناء القصة...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>إنشاء ونشر القصة التفاعلية</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}

export default NewInteractiveStoryView;
