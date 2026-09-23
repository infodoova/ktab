import React from "react";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Input, Textarea, Select } from "@/components/myui/forms";
import { CoverImageUploader, PdfUploadZone } from "@/components/common/BookForm";
import { PublishConfirmModal } from "@/components/common/PublishConfirmModal";
import { useLibrarianBookForm } from "../hooks/useLibrarianBookForm";
import "./LibrarianBookCreateView.css";

/**
 * Dedicated Page to Add or Edit a Book in the Librarian module.
 * Fully mirrors the Author Book Publish Studio in design, layout,
 * dynamic enums, and upload zones.
 */
export default function LibrarianBookCreateView() {
  const {
    formData,
    existingData,
    categoryOptions,
    subCategoryOptions,
    ageGroupOptions,
    languageOptions,
    genresLoading,
    loadingInitial,
    errors,
    submitting,
    isEdit,
    navigate,
    handleTitleChange,
    handleCustomAuthorNameChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleAgeGroupChange,
    handleLanguageChange,
    handleCoverChange,
    handleRemoveCover,
    handleDocumentChange,
    handleRemoveDocument,
    handleSubmit,
    isConfirmModalOpen,
    closeConfirmModal,
    handleConfirmedSubmit,
  } = useLibrarianBookForm();

  const breadcrumb = {
    parentLabel: "إدارة الكتب",
    parentPath: "/librarian/books",
  };

  const pageTitle = isEdit ? "تعديل بيانات الكتاب" : "إضافة كتاب جديد للمكتبة";

  if (loadingInitial) {
    return (
      <AppLayout pageName={pageTitle} breadcrumb={breadcrumb} showSearch={false}>
        <div className="ktab-librarian-book-create-view" dir="rtl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "360px",
            }}
          >
            <Loader2
              size={36}
              className="ktab-book-publish-form__spinner"
              style={{ color: "var(--brand-teal, #4ed4ab)" }}
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageName={pageTitle} breadcrumb={breadcrumb} showSearch={false}>
      <div className="ktab-librarian-book-create-view" dir="rtl">
        <form className="ktab-book-publish-form" onSubmit={handleSubmit} noValidate>
          <div className="ktab-book-publish-form__body">
            {/* 1. Book Title & Author Row */}
            <div className="ktab-book-publish-form__selects-grid">
              <div className="ktab-book-publish-form__select-field">
                <Input
                  id="librarian-book-title-input"
                  name="title"
                  label="عنوان الكتاب"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="أدخل عنوان الكتاب الأدبي أو المعرفي..."
                  maxLength={200}
                  disabled={submitting}
                  error={errors.title}
                  autoComplete="off"
                />
              </div>

              <div className="ktab-book-publish-form__select-field">
                <Input
                  id="librarian-book-author-input"
                  name="customAuthorName"
                  label="اسم المؤلف"
                  required
                  value={formData.customAuthorName}
                  onChange={handleCustomAuthorNameChange}
                  placeholder="مثال: د. نجيب محفوظ"
                  maxLength={150}
                  disabled={submitting}
                  error={errors.customAuthorName}
                  autoComplete="off"
                />
              </div>
            </div>



            {/* 2. Book Description */}
            <div className="ktab-book-publish-form__field">
              <Textarea
                id="librarian-book-desc-input"
                name="description"
                label="نبذة عن الكتاب"
                required
                rows={4}
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="اكتب نبذة شيقة وموجزة توضح فكرة الكتاب وأهم محاوره للقراء..."
                maxLength={5000}
                disabled={submitting}
                error={errors.description}
              />
            </div>

            {/* 3. Text Metadata (2x2 Grid with Global Selects) */}
            <div className="ktab-book-publish-form__selects-grid">
              <div className="ktab-book-publish-form__select-field">
                <Select
                  label="التصنيف الأساسي"
                  required
                  options={categoryOptions}
                  value={formData.category}
                  onChange={handleCategoryChange}
                  disabled={genresLoading || submitting}
                  placeholder={genresLoading ? "جاري تحميل التصنيفات..." : "اختر التصنيف الأساسي"}
                  error={errors.category}
                />
              </div>

              <div className="ktab-book-publish-form__select-field">
                <Select
                  label="التصنيف الفرعي"
                  options={subCategoryOptions}
                  value={formData.subCategory}
                  onChange={handleSubCategoryChange}
                  disabled={submitting || !formData.category || subCategoryOptions.length === 0}
                  placeholder={
                    subCategoryOptions.length > 0
                      ? "اختر التصنيف الفرعي"
                      : "لا يوجد تصنيف فرعي"
                  }
                />
              </div>

              <div className="ktab-book-publish-form__select-field">
                <Select
                  label="الفئة العمرية المستهدفة"
                  required
                  options={ageGroupOptions}
                  value={formData.ageGroup}
                  onChange={handleAgeGroupChange}
                  disabled={submitting}
                  placeholder="اختر الفئة العمرية"
                  error={errors.ageGroup}
                />
              </div>

              <div className="ktab-book-publish-form__select-field">
                <Select
                  label="لغة الكتاب"
                  required
                  options={languageOptions}
                  value={formData.language}
                  onChange={handleLanguageChange}
                  disabled={submitting}
                  placeholder="اختر لغة الكتاب"
                  error={errors.language}
                />
              </div>
            </div>

            {/* 4 & 5. Upload Grid: Book PDF Document + Cover Image */}
            <div className="ktab-book-publish-form__upload-grid">
              <PdfUploadZone
                pdfFile={formData.pdfFile}
                existingPdfName={existingData.pdfName}
                pageCount={formData.pageCount}
                onFileChange={handleDocumentChange}
                onRemoveFile={handleRemoveDocument}
                error={errors.pdf}
              />
              <CoverImageUploader
                coverFile={formData.coverFile}
                coverUrl={existingData.coverUrl}
                onFileChange={handleCoverChange}
                onRemoveFile={handleRemoveCover}
                error={errors.cover}
              />
            </div>

            {/* 6. Action Buttons */}
            <div className="ktab-book-publish-form__actions">
              <button
                type="button"
                onClick={() => navigate("/librarian/books")}
                disabled={submitting}
                className="ktab-book-publish-form__btn-draft"
              >
                إلغاء التراجع
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ktab-book-publish-form__btn-publish"
              >
                {submitting && (
                  <Loader2 size={16} className="ktab-book-publish-form__spinner" />
                )}
                <span>
                  {isEdit ? "حفظ وتحديث بيانات الكتاب" : "حفظ وإضافة الكتاب للمكتبة"}
                </span>
              </button>
            </div>
          </div>
        </form>

        <PublishConfirmModal
          isOpen={isConfirmModalOpen}
          expectedTitle={formData.title}
          isAuthor={false}
          loading={submitting}
          onConfirm={handleConfirmedSubmit}
          onClose={closeConfirmModal}
        />
      </div>
    </AppLayout>
  );
}
