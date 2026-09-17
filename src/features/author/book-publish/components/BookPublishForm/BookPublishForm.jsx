import React, { memo } from "react";
import { Loader2 } from "lucide-react";
import { Select } from "@/components/myui/forms/Select";
import { CoverImageUploader } from "../CoverImageUploader";
import { PdfUploadZone } from "../PdfUploadZone";
import { AGE_GROUPS, LANG_OPTIONS } from "../../hooks/useBookPublish";
import "./BookPublishForm.css";

/**
 * Unified Editorial Book Publishing Form.
 * Sequential single-column flow: Title -> Description -> Metadata -> PDF -> Cover Image -> Actions.
 */
export const BookPublishForm = memo(function BookPublishForm({
  formData,
  existingData,
  genres = [],
  subGenres = [],
  isEditingDraft = false,
  loading = false,
  onInputChange,
  onGenreChange,
  onPdfChange,
  onSaveDraft,
  onPublish,
}) {
  // Normalize genres for global Select
  const categoryOptions = genres.map((g) => ({
    value: String(g.id),
    label: g.name || g.arabicName || g.nameAr || String(g.id),
  }));

  // Normalize subgenres for global Select
  const subCategoryOptions = subGenres.map((sg) => ({
    value: String(sg.id),
    label: sg.name || sg.arabicName || sg.nameAr || String(sg.id),
  }));

  // Normalize age groups for global Select
  const ageGroupOptions = AGE_GROUPS.map((ag) => ({
    value: ag,
    label: ag,
  }));

  // Normalize language options for global Select
  const languageOptions = LANG_OPTIONS.map((lang) => ({
    value: lang.id,
    label: lang.label,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onPublish();
  };

  return (
    <form className="book-publish-form" onSubmit={handleSubmit} noValidate>
      <div className="book-publish-form__body">
        {/* 1. Book Title */}
        <div className="book-publish-form__field">
          <label htmlFor="book-title-input" className="book-publish-form__label">
            عنوان الكتاب
            <span className="book-publish-form__required">*</span>
          </label>
          <input
            id="book-title-input"
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="أدخل عنوان الكتاب الأدبي أو المعرفي..."
            className="book-publish-form__input"
            disabled={loading}
            autoComplete="off"
          />
        </div>

        {/* 2. Book Description */}
        <div className="book-publish-form__field">
          <label htmlFor="book-desc-input" className="book-publish-form__label">
            نبذة عن الكتاب
            <span className="book-publish-form__required">*</span>
          </label>
          <textarea
            id="book-desc-input"
            rows={4}
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="اكتب نبذة شيقة وموجزة توضح فكرة الكتاب وأهم محاوره للقراء..."
            className="book-publish-form__textarea"
            disabled={loading}
          />
        </div>

        {/* 3. Text Metadata (2x2 Grid with Global Selects) */}
        <div className="book-publish-form__selects-grid">
          <div className="book-publish-form__select-field">
            <Select
              label="التصنيف الرئيسي"
              required
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => onGenreChange(e.target.value)}
              disabled={loading}
              placeholder="اختر التصنيف الرئيسي"
            />
          </div>

          <div className="book-publish-form__select-field">
            <Select
              label="التصنيف الفرعي"
              options={subCategoryOptions}
              value={formData.subCategory}
              onChange={(e) => onInputChange("subCategory", e.target.value)}
              disabled={loading || subCategoryOptions.length === 0}
              placeholder={
                subCategoryOptions.length > 0 ? "اختر التصنيف الفرعي" : "لا يوجد تصنيف فرعي"
              }
            />
          </div>

          <div className="book-publish-form__select-field">
            <Select
              label="الفئة العمرية المستهدفة"
              required
              options={ageGroupOptions}
              value={formData.ageGroup}
              onChange={(e) => onInputChange("ageGroup", e.target.value)}
              disabled={loading}
              placeholder="اختر الفئة العمرية"
            />
          </div>

          <div className="book-publish-form__select-field">
            <Select
              label="لغة الكتاب"
              required
              options={languageOptions}
              value={formData.language}
              onChange={(e) => onInputChange("language", e.target.value)}
              disabled={loading}
              placeholder="اختر لغة الكتاب"
            />
          </div>
        </div>

        {/* 4. Book PDF Data */}
        <div className="book-publish-form__field">
          <PdfUploadZone
            pdfFile={formData.pdfFile}
            existingPdfName={existingData?.pdfName}
            pageCount={existingData?.pageCount}
            onFileChange={onPdfChange}
            onRemoveFile={() => onPdfChange(null)}
          />
        </div>

        {/* 5. Book Cover Image (Directly UNDER PDF input) */}
        <div className="book-publish-form__field">
          <CoverImageUploader
            coverFile={formData.coverFile}
            coverUrl={existingData?.coverUrl}
            onFileChange={(file) => onInputChange("coverFile", file)}
            onRemoveFile={() => onInputChange("coverFile", null)}
          />
        </div>

        {/* 6. Action Buttons */}
        <div className="book-publish-form__actions">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={loading}
            className="book-publish-form__btn-draft"
          >
            حفظ كمسودة
          </button>

          <button
            type="submit"
            disabled={loading}
            className="book-publish-form__btn-publish"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="book-publish-form__spinner" />
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <span>{isEditingDraft ? "تحديث ونشر الكتاب" : "نشر الكتاب الآن"}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
});

export default BookPublishForm;
