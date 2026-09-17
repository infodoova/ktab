import React from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { BookPublishForm, UploadProgressModal } from "../components";
import { useBookPublish } from "../hooks/useBookPublish";
import "./BookPublishView.css";

/**
 * Editorial studio view for publishing new books or updating existing drafts.
 * Renders the unified BookPublishForm directly on the page layout without nested container cards.
 */
export function BookPublishView({ pageName = "نشر كتاب جديد" }) {
  const location = useLocation();
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

  const currentTitle = isEditingDraft ? "تعديل مسودة الكتاب" : pageName;

  // Dynamically resolve breadcrumb based on referrer state (Dashboard vs Library/My-Books)
  const breadcrumb = location.state?.from || {
    parentLabel: "المكتبة",
    parentPath: "/author/my-books",
  };

  return (
    <AppLayout pageName={currentTitle} breadcrumb={breadcrumb} showSearch={false}>
      <div className="book-publish-page">
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
      </div>
    </AppLayout>
  );
}

export default BookPublishView;
