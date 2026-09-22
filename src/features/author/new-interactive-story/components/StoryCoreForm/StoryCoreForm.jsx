import React from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import "./StoryCoreForm.css";

/**
 * Main narrative core form containing the story title, compact genre chips,
 * world rules constitution textarea, and action buttons.
 */
export function StoryCoreForm({
  title,
  genre,
  constitution,
  genrePresets = [],
  isSubmitting = false,
  errors = {},
  onInputChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="new-story-core-form" onSubmit={onSubmit} noValidate>
      {/* 1. Title Input */}
      <div className="new-story-core-form__group">
        <div className="new-story-core-form__label-row">
          <label htmlFor="story-title-input" className="new-story-core-form__label">
            عنوان القصة التفاعلية
            <span className="new-story-core-form__required">*</span>
          </label>
        </div>
        <input
          id="story-title-input"
          type="text"
          value={title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="مثال: سر المخطوطة الأندلسية..."
          className={`new-story-core-form__input ${
            errors.title ? "new-story-core-form__input--error" : ""
          }`}
          disabled={isSubmitting}
          autoComplete="off"
        />
        {errors.title && (
          <span className="new-story-core-form__error">{errors.title}</span>
        )}
      </div>

      {/* 2. Genre Selector - Compact Chips */}
      <div className="new-story-core-form__group">
        <div className="new-story-core-form__label-row">
          <label className="new-story-core-form__label">تصنيف القصة</label>
          <span className="new-story-core-form__subtle-hint">حدد نوع المغامرة</span>
        </div>
        <div className="new-story-core-form__genre-grid" role="radiogroup" aria-label="تصنيف القصة">
          {genrePresets.map((preset) => {
            const isSelected = genre === preset.id;
            const Icon = preset.icon;

            return (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onInputChange("genre", preset.id)}
                className={`new-story-core-form__genre-chip ${
                  isSelected ? "new-story-core-form__genre-chip--selected" : ""
                }`}
                disabled={isSubmitting}
              >
                {Icon && <Icon size={16} className="new-story-core-form__genre-icon" />}
                <span className="new-story-core-form__genre-text">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Constitution & World Premise */}
      <div className="new-story-core-form__group new-story-core-form__group--expand">
        <div className="new-story-core-form__label-row">
          <label
            htmlFor="story-constitution-input"
            className="new-story-core-form__label"
          >
            دستور وقوانين عالم القصة
            <span className="new-story-core-form__required">*</span>
          </label>
          <span className="new-story-core-form__subtle-hint">
            {constitution.length} حرف
          </span>
        </div>
        <p className="new-story-core-form__description">
          عرّف الذكاء الاصطناعي على القواعد الثابتة لعالمك، شخصية البطل، والأسرار التي
          ستتكشف مع خيارات القارئ.
        </p>
        <textarea
          id="story-constitution-input"
          rows={7}
          value={constitution}
          onChange={(e) => onInputChange("constitution", e.target.value)}
          placeholder="أنت مستكشف آثار شاب يعثر في قبو مكتبة قديمة على صندوق نقوش لا يفتح إلا بحل ألغاز تاريخية. قواعد العالم: لا توجد تعاويذ سحرية، كل لغز يعتمد على علم الفلك والرياضيات القديمة. الهدف: الوصول إلى كنز الإسكندر قبل الفجر..."
          className={`new-story-core-form__textarea ${
            errors.constitution ? "new-story-core-form__textarea--error" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.constitution && (
          <span className="new-story-core-form__error">{errors.constitution}</span>
        )}
      </div>

      {/* 4. Action Buttons */}
      <div className="new-story-core-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="new-story-core-form__btn-cancel"
          disabled={isSubmitting}
        >
          <ArrowRight size={16} />
          <span>إلغاء والعودة</span>
        </button>

        <button
          type="submit"
          className="new-story-core-form__btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={17} className="new-story-core-form__spinner" />
              <span>جاري تشييد القصة...</span>
            </>
          ) : (
            <span>إنشاء القصة وبدء المشاهد</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default StoryCoreForm;
