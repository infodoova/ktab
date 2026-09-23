import React, { memo } from "react";
import { Loader2 } from "lucide-react";
import { Input, Textarea, Select } from "@/components/myui/forms";
import { CoverImageUploader } from "../CoverImageUploader";
import { PdfUploadZone } from "../PdfUploadZone";
import "./BookPublishForm.css";

/**
 * Unified Editorial Book Publishing Form.
 * Sequential flow: Title -> Description -> Metadata -> PDF Document -> Cover Image -> Actions.
 * 
 * Pure declarative component without inline calculations or business logic.
 */
export const BookPublishForm = memo(function BookPublishForm({
  formData,
  existingData,
  categoryOptions = [],
  subCategoryOptions = [],
  ageGroupOptions = [],
  languageOptions = [],
  isEditingDraft = false,
  loading = false,
  handleTitleChange,
  handleDescriptionChange,
  handleCategoryChange,
  handleSubCategoryChange,
  handleAgeGroupChange,
  handleLanguageChange,
  handleDocumentChange,
  handleRemoveDocument,
  handleCoverChange,
  handleRemoveCover,
  handleSaveDraft,
  handleFormSubmit,
}) {
  return (
    <form className="book-publish-form" onSubmit={handleFormSubmit} noValidate>
      <div className="book-publish-form__body">
        {/* 1. Book Title */}
        <div className="book-publish-form__field">
          <Input
            id="book-title-input"
            name="title"
            label="عنوان الكتاب"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="أدخل عنوان الكتاب الأدبي أو المعرفي..."
            maxLength={200}
            disabled={loading}
            autoComplete="off"
          />
        </div>

        {/* 2. Book Description */}
        <div className="book-publish-form__field">
          <Textarea
            id="book-desc-input"
            name="description"
            label="نبذة عن الكتاب"
            required
            rows={4}
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="اكتب نبذة شيقة وموجزة توضح فكرة الكتاب وأهم محاوره للقراء..."
            maxLength={5000}
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
              onChange={handleCategoryChange}
              disabled={loading}
              placeholder="اختر التصنيف الرئيسي"
            />
          </div>

          <div className="book-publish-form__select-field">
            <Select
              label="التصنيف الفرعي"
              options={subCategoryOptions}
              value={formData.subCategory}
              onChange={handleSubCategoryChange}
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
              onChange={handleAgeGroupChange}
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
              onChange={handleLanguageChange}
              disabled={loading}
              placeholder="اختر لغة الكتاب"
            />
          </div>
        </div>

        {/* 4 & 5. Upload Grid: Book Document (PDF) + Cover Image */}
        <div className="book-publish-form__upload-grid">
          <PdfUploadZone
            pdfFile={formData.pdfFile}
            existingPdfName={existingData?.pdfName}
            pageCount={existingData?.pageCount}
            onFileChange={handleDocumentChange}
            onRemoveFile={handleRemoveDocument}
          />
          <CoverImageUploader
            coverFile={formData.coverFile}
            coverUrl={existingData?.coverUrl}
            onFileChange={handleCoverChange}
            onRemoveFile={handleRemoveCover}
          />
        </div>

        {/* 6. Action Buttons */}
        <div className="book-publish-form__actions">
          <button
            type="button"
            onClick={handleSaveDraft}
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
