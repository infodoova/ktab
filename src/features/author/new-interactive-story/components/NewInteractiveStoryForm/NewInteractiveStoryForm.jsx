import React, { memo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Eye,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Select } from "@/components/myui/forms/Select";
import { StoryStepper } from "../StoryStepper/StoryStepper";
import { StoryCoverUploader } from "../StoryCoverUploader/StoryCoverUploader";
import "./NewInteractiveStoryForm.css";

/**
 * Editorial Multi-Step Interactive Story Studio Form.
 * Sequenced into 3 focused stages:
 * Step 1: الهوية والغلاف (Title, Genre, Cover Image)
 * Step 2: قوانين العالم (Constitution, Narrative Lens, Scene Count)
 * Step 3: الإخراج والإطلاق (Art Style, Visual Notes, Final Review & Launch)
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
  sceneCountConfig = { MIN: 3, MAX: 10, STEP: 1 },
  onInputChange,
  onCoverSelect,
  goToNextStep,
  goToPrevStep,
  onStepClick,
  onSubmit,
}) {
  // Find readable labels for the review card
  const selectedGenreObj = genrePresets.find((g) => g.id === formData.genre);
  const selectedLensObj = lensOptions.find((l) => l.value === formData.lens);
  const selectedStyleObj = artStyleOptions.find((s) => s.value === formData.artStyle);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="new-story-form" onSubmit={handleSubmit} noValidate>
      {/* ── Fixed Sticky Stepper Bar on Top ── */}
      <div className="new-story-form__stepper-bar">
        <div className="new-story-form__stepper-bar-inner">
          <StoryStepper currentStep={currentStep} onStepClick={onStepClick} />
        </div>
      </div>

      <div className="new-story-form__container">
        {/* ════════════════════════════════════════════════════════════
            STEP 1: الهوية الأساسية والغلاف
            ════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="new-story-form__step-content">
            {/* Title */}
            <div className="new-story-form__field">
              <label htmlFor="story-title-input" className="new-story-form__label">
                عنوان القصة التفاعلية
                <span className="new-story-form__required">*</span>
              </label>
              <input
                id="story-title-input"
                type="text"
                value={formData.title}
                onChange={(e) => onInputChange("title", e.target.value)}
                placeholder="مثال: سر المخطوطة الأندلسية..."
                className={`new-story-form__input ${
                  errors.title ? "new-story-form__input--error" : ""
                }`}
                disabled={isSubmitting}
                autoComplete="off"
              />
              {errors.title && (
                <span className="new-story-form__error-text">{errors.title}</span>
              )}
            </div>

            {/* Genre Presets */}
            <div className="new-story-form__field">
              <div className="new-story-form__label-row">
                <label className="new-story-form__label">تصنيف القصة</label>
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
                      aria-checked={isSelected}
                      onClick={() => onInputChange("genre", preset.id)}
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
                onCoverSelect={onCoverSelect}
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
                <span>متابعة لقوانين العالم</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            STEP 2: دستور وقوانين العالم والسرد
            ════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="new-story-form__step-content">
            {/* World Constitution Textarea */}
            <div className="new-story-form__field">
              <div className="new-story-form__label-row">
                <label
                  htmlFor="story-constitution-input"
                  className="new-story-form__label"
                >
                  دستور وقوانين عالم القصة
                  <span className="new-story-form__required">*</span>
                </label>
                <span className="new-story-form__subtle-hint">
                  {formData.constitution.length} حرف
                </span>
              </div>
              <p className="new-story-form__field-desc">
                عرّف المحرك التفاعلي على القواعد الثابتة لعالمك، شخصية البطل، والأسرار التي
                ستتكشف مع خيارات القارئ.
              </p>
              <textarea
                id="story-constitution-input"
                rows={6}
                value={formData.constitution}
                onChange={(e) => onInputChange("constitution", e.target.value)}
                placeholder="أنت مستكشف آثار شاب يعثر في قبو مكتبة قديمة على صندوق نقوش لا يفتح إلا بحل ألغاز تاريخية..."
                className={`new-story-form__textarea ${
                  errors.constitution ? "new-story-form__textarea--error" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.constitution && (
                <span className="new-story-form__error-text">
                  {errors.constitution}
                </span>
              )}
            </div>

            {/* Narrative Lens (Perspective) */}
            <div className="new-story-form__field">
              <Select
                label="منظور السرد"
                required
                options={lensOptions}
                value={formData.lens}
                onChange={(e) => onInputChange("lens", e.target.value)}
                error={errors.lens}
                icon={<Eye size={15} />}
              />
            </div>

            {/* Scene Count Slider */}
            <div className="new-story-form__field">
              <div className="new-story-form__label-row">
                <label
                  htmlFor="story-scene-count-slider"
                  className="new-story-form__label"
                >
                  طول المسار التفاعلي (عدد المشاهد)
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
                  onChange={(e) =>
                    onInputChange("sceneCount", Number(e.target.value))
                  }
                  className="new-story-form__slider"
                  aria-valuemin={sceneCountConfig.MIN}
                  aria-valuemax={sceneCountConfig.MAX}
                  aria-valuenow={formData.sceneCount}
                  aria-label="عدد المشاهد المقترحة"
                />
                <div className="new-story-form__slider-ticks">
                  <span>{sceneCountConfig.MIN} مشاهد (قصيرة)</span>
                  <span>{sceneCountConfig.MAX} مشاهد (ملحمية)</span>
                </div>
              </div>
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
                <span>متابعة للإخراج الفني</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            STEP 3: الإخراج الفني والمراجعة والإطلاق
            ════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="new-story-form__step-content">
            {/* Visual Art Style */}
            <div className="new-story-form__field">
              <Select
                label="النمط البصري للمشاهد"
                required
                options={artStyleOptions}
                value={formData.artStyle}
                onChange={(e) => onInputChange("artStyle", e.target.value)}
                error={errors.artStyle}
                icon={<Sparkles size={15} />}
              />
            </div>

            {/* Visual Style Notes */}
            <div className="new-story-form__field">
              <label
                htmlFor="story-art-notes-input"
                className="new-story-form__label"
              >
                ملاحظات الرؤية البصرية (اختياري)
              </label>
              <textarea
                id="story-art-notes-input"
                rows={3}
                value={formData.description}
                onChange={(e) => onInputChange("description", e.target.value)}
                placeholder="أضف تفاصيل بصرية: إضاءة المشاهد، درجات الألوان، ملامح الشخصيات..."
                className="new-story-form__textarea"
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
                        {selectedGenreObj?.label || selectedGenreObj?.name || formData.genre}
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">المنظور:</span>
                      <span className="new-story-form__review-val">
                        {selectedLensObj?.label || formData.lens}
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">المسار:</span>
                      <span className="new-story-form__review-val">
                        {formData.sceneCount} مشاهد
                      </span>
                    </div>
                    <div className="new-story-form__review-row">
                      <span className="new-story-form__review-key">النمط:</span>
                      <span className="new-story-form__review-val">
                        {selectedStyleObj?.label || formData.artStyle}
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
                  <>
                    <Sparkles size={17} />
                    <span>إطلاق القصة التفاعلية</span>
                  </>
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
