import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { BookPublishForm } from "../components/BookPublishForm";
import { UploadProgressModal } from "../components/UploadProgressModal";
import { useBookPublish } from "../hooks/useBookPublish";

/**
 * Pure presentation view for publishing and editing author books.
 */
export function BookPublishView({ pageName = "نشر كتاب جديد" }) {
  const {
    formData,
    existingData,
    genres,
    subGenres,
    loading,
    progress,
    isEditingDraft,
    handleInputChange,
    handleGenreChange,
    handlePdfChange,
    handleSaveDraft,
    handlePublish,
  } = useBookPublish();

  const title = isEditingDraft ? "تعديل مسودة الكتاب" : pageName;

  return (
    <AppLayout pageName={title} showSearch={false}>
      <BookPublishForm
        formData={formData}
        existingData={existingData}
        genres={genres}
        subGenres={subGenres}
        isEditingDraft={isEditingDraft}
        loading={loading}
        onInputChange={handleInputChange}
        onGenreChange={handleGenreChange}
        onPdfChange={handlePdfChange}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <UploadProgressModal
        isOpen={loading}
        progress={progress}
        title={isEditingDraft ? "جاري تحديث الكتاب..." : "جاري نشر وتجهيز الكتاب..."}
      />
    </AppLayout>
  );
}

export default BookPublishView;

