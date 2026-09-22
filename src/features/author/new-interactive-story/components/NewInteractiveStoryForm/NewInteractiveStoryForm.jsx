import React, { memo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Eye,
  Palette,
} from "lucide-react";
import { Select, Input, Textarea } from "@/components/myui/forms";
import { StoryStepper } from "../StoryStepper/StoryStepper";
import { StoryCoverUploader } from "../StoryCoverUploader/StoryCoverUploader";
import { FieldTooltip } from "../FieldTooltip/FieldTooltip";
import "./NewInteractiveStoryForm.css";

/**
 * Editorial Multi-Step Interactive Story Studio Form.
 * Structured into 3 stages adhering strictly to the backend schema:
 * Step 1: الهوية والغلاف (Title, Genre, Cover Image)
 * Step 2: دستور وقوانين العالم (The 8 Constitution Fields)
 * Step 3: المنظور والإخراج والإطلاق (Lens, Scene Count, Visual Style & Notes, Review)
 * 
 * Pure declarative component without inline calculations or business logic.
 */
export const NewInteractiveStoryForm = memo(function NewInteractiveStoryForm({
  formData,
  coverPreview,
  currentStep = 1,
  errors = {},
  isSubmitting = false,
  genrePresets = [],
  lensOptions = [],
  artStyleOptions = [],
  sceneCountConfig,
  constitutionFields = [],
  maxLengths = { TITLE: 100, CONSTITUTION_FIELD: 300, VISUAL_STYLE_NOTES: 300 },
  selectedGenreLabel = "",
  selectedLensLabel = "",
  selectedStyleLabel = "",
  filledConstitutionCount = 0,
  handleTitleChange,
  handleGenreClick,
  handleStepBtnClick,
  handleConstitutionChange,
  handleLensChange,
  handleSceneCountChange,
  handleVisualStyleChange,
  handleVisualStyleNotesChange,
  handleCoverSelect,
  goToNextStep,
  goToPrevStep,
  handleSubmit,
}) {
  return (
    <form className="new-story-form" onSubmit={handleSubmit} noValidate>
      {/* ── Fixed Sticky Stepper Bar on Top ── */}
      <div className="new-story-form__stepper-bar">
        <div className="new-story-form__stepper-bar-inner">
          <StoryStepper currentStep={currentStep} onStepClick={handleStepBtnClick} />
        </div>
      </div>

      <div className="new-story-form__container">
        {/* ════════════════════════════════════════════════════════════
            STEP 1: الهوية الأساسية والغلاف
            ════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="new-story-form__step-content">
            {/* Title with Modern Floating Label & Global Input */}
            <div className="new-story-form__field">
              <Input
                id="story-title-input"
                name="title"
                label="عنوان القصة التفاعلية"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="مثال: سر الغرفة رقم 404"
                maxLength={maxLengths?.TITLE || 100}
                error={errors.title}
                disabled={isSubmitting}
                autoComplete="off"
              />
            </div>

            {/* Genre Presets */}
            <div className="new-story-form__field">
              <div className="new-story-form__label-row">
                <label className="new-story-form__label">
                  <span>تصنيف القصة</span>
                  <span className="new-story-form__required">*</span>
                </label>
                <span className="new-story-form__subtle-hint">اختر نوع المغامرة</span>
              </div>
              <div
                className="new-story-form__genre-grid"
                role="radiogroup"
                aria-label="تصنيف القصة"
              >
                {genrePresets.map((preset) => {
                  const isSelected = formData.genre === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="radio"
                      data-id={preset.id}
                      aria-checked={isSelected}
                      onClick={handleGenreClick}
                      className={`new-story-form__genre-chip ${
                        isSelected ? "new-story-form__genre-chip--selected" : ""
                      }`}
                      disabled={isSubmitting}
                    >
                      <span className="new-story-form__genre-text">
                        {preset.label || preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cover Image Uploader */}
            <div className="new-story-form__field">
              <StoryCoverUploader
                coverPreview={coverPreview}
                onCoverSelect={handleCoverSelect}
                error={errors.cover}
              />
            </div>

            {/* Step 1 Actions */}
            <div className="new-story-form__actions new-story-form__actions--end">
              <button
                type="button"
                onClick={goToNextStep}
                className="new-story-form__btn-primary"
              >
                <span>متابعة لدستور القصة</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            STEP 2: دستور وقوانين العالم (The 8 Constitution Fields)
            ════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="new-story-form__step-content">
            <div className="new-story-form__constitution-grid">
              {constitutionFields.map((field) => {
                const errorKey = `constitution_${field.key}`;

                return (
                  <div
                    key={field.key}
                    className={`new-story-form__field ${
                      field.key === "mainConflict" || field.key === "coreTheme"
                        ? "new-story-form__field--span-2"
                        : ""
                    }`}
                  >
                    <Textarea
                      id={`constitution-${field.key}`}
                      name={field.key}
                      label={field.label}
                      required={field.required}
                      labelExtra={
                        field.hint ? (
                          <FieldTooltip text={field.hint} label={field.label} />
                        ) : null
                      }
                      rows={2}
                      value={formData.constitution[field.key] || ""}
                      onChange={handleConstitutionChange}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength || maxLengths?.CONSTITUTION_FIELD || 300}
                      error={errors[errorKey]}
                      disabled={isSubmitting}
                    />
                  </div>
                );
              })}
            </div>

            {/* Step 2 Actions */}
            <div className="new-story-form__actions">
              <button
                type="button"
                onClick={goToPrevStep}
                className="new-story-form__btn-secondary"
              >
                <ArrowRight size={16} />
                <span>السابق</span>
              </button>

              <button
                type="button"
                onClick={goToNextStep}
                className="new-story-form__btn-primary"
              >
                <span>متابعة للمنظور والإخراج</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            STEP 3: المنظور والإخراج الفني والإطلاق
            ════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="new-story-form__step-content">
            {/* Narrative Lens (lens) */}
            <div className="new-story-form__field">
              <Select
                label="منظور القصة"
                labelExtra={
                  <FieldTooltip
                    text="يحدد نوع العواقب والمخاطر التي تتغير عند كل قرار وخيار يتخذه القارئ"
                    label="معلومات المنظور"
                  />
                }
                required
                options={lensOptions}
                value={formData.lens}
                onChange={handleLensChange}
                error={errors.lens}
                icon={<Eye size={15} />}
              />
            </div>

            {/* Max Scenes Slider */}
            <div className="new-story-form__field">
              <div className="new-story-form__label-row">
                <label
                  htmlFor="story-scene-count-slider"
                  className="new-story-form__label"
                >
                  <span>طول المسار التفاعلي</span>
                </label>
                <span className="new-story-form__scene-count-text">
                  {formData.sceneCount} مشاهد
                </span>
              </div>

              <div className="new-story-form__slider-wrap">
                <input
                  id="story-scene-count-slider"
                  type="range"
                  min={sceneCountConfig.MIN}
                  max={sceneCountConfig.MAX}
                  step={sceneCountConfig.STEP}
                  value={formData.sceneCount}
                  onChange={handleSceneCountChange}
                  className="new-story-form__slider"
                  aria-valuemin={sceneCountConfig.MIN}
                  aria-valuemax={sceneCountConfig.MAX}
                  aria-valuenow={formData.sceneCount}
                  aria-label="عدد المشاهد المقترحة"
                />
                <div className="new-story-form__slider-ticks">
                  <span>{sceneCountConfig.MIN} مشاهد (سريعة)</span>
                  <span>{sceneCountConfig.MAX} مشاهد (ملحمية)</span>
                </div>
              </div>
            </div>

            {/* Visual Art Style */}
            <div className="new-story-form__field">
              <Select
                label="النمط البصري"
                required
                options={artStyleOptions}
                value={formData.visualStyle}
                onChange={handleVisualStyleChange}
                error={errors.visualStyle}
                icon={<Palette size={15} />}
              />
            </div>

            {/* Visual Style Notes */}
            <div className="new-story-form__field">
              <Textarea
                id="story-art-notes-input"
                name="visualStyleNotes"
                label="ملاحظات الرؤية البصرية"
                required
                rows={2}
                value={formData.visualStyleNotes}
                onChange={handleVisualStyleNotesChange}
                placeholder="مثال: إضاءة خافتة وأجواء سينمائية غامضة"
                maxLength={maxLengths?.VISUAL_STYLE_NOTES || 300}
                error={errors.visualStyleNotes}
                disabled={isSubmitting}
              />
            </div>

            {/* Quick Summary Review Card */}
            <div className="new-story-form__review-card">
              <div className="new-story-form__review-header">
                <span className="new-story-form__review-title">
                  ملخص القصة التفاعلية قبل الإطلاق
                </span>
              </div>

              <div className="new-story-form__review-body">
                {coverPreview && (
                  <div className="new-story-form__review-cover">
                    <img src={coverPreview} alt={formData.title} />
                  </div>
                )}

                <div className="new-story-form__review-info">
                  <h3 className="new-story-form__review-story-title">
                    {formData.title || "بدون عنوان"}
                  </h3>
                  <div className="new-story-form__review-specs">
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">التصنيف:</span>
                      <span className="new-story-form__review-val">
                        {selectedGenreLabel}
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">المنظور:</span>
                      <span className="new-story-form__review-val">
                        {selectedLensLabel}
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">المسار:</span>
                      <span className="new-story-form__review-val">
                        {formData.sceneCount} مشاهد
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">النمط البصري:</span>
                      <span className="new-story-form__review-val">
                        {selectedStyleLabel}
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">الدستور:</span>
                      <span className="new-story-form__review-val">
                        {filledConstitutionCount} / 8 حقول مكتملة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="new-story-form__actions">
              <button
                type="button"
                onClick={goToPrevStep}
                className="new-story-form__btn-secondary"
                disabled={isSubmitting}
              >
                <ArrowRight size={16} />
                <span>السابق</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="new-story-form__btn-publish"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="new-story-form__spinner" />
                    <span>جاري إطلاق القصة...</span>
                  </>
                ) : (
                  <span>إطلاق القصة التفاعلية</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
});

export default NewInteractiveStoryForm;
