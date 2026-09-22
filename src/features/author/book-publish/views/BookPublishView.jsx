import React from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { BookPublishForm, UploadProgressModal } from "../components";
import { PublishConfirmModal } from "@/components/common/PublishConfirmModal";
import { useBookPublish } from "../hooks/useBookPublish";
import "./BookPublishView.css";

/**
 * Editorial studio view for publishing new books or updating existing drafts.
 * Renders the unified BookPublishForm directly on the page layout without nested container cards.
 */
export function BookPublishView({ pageName = "نشر كتاب جديد" }) {
  const location = useLocation();
  const publishHook = useBookPublish();

  const currentTitle = publishHook.isEditingDraft ? "تعديل مسودة الكتاب" : pageName;

  // Dynamically resolve breadcrumb based on referrer state (Dashboard vs Library/My-Books)
  const breadcrumb = location.state?.from || {
    parentLabel: "المكتبة",
    parentPath: "/author/my-books",
  };

  return (
    <AppLayout pageName={currentTitle} breadcrumb={breadcrumb} showSearch={false}>
      <div className="book-publish-page">
        <BookPublishForm
          formData={publishHook.formData}
          existingData={publishHook.existingData}
          categoryOptions={publishHook.categoryOptions}
          subCategoryOptions={publishHook.subCategoryOptions}
          ageGroupOptions={publishHook.ageGroupOptions}
          languageOptions={publishHook.languageOptions}
          isEditingDraft={publishHook.isEditingDraft}
          loading={publishHook.loading}
          handleTitleChange={publishHook.handleTitleChange}
          handleDescriptionChange={publishHook.handleDescriptionChange}
          handleCategoryChange={publishHook.handleCategoryChange}
          handleSubCategoryChange={publishHook.handleSubCategoryChange}
          handleAgeGroupChange={publishHook.handleAgeGroupChange}
          handleLanguageChange={publishHook.handleLanguageChange}
          handleDocumentChange={publishHook.handleDocumentChange}
          handleRemoveDocument={publishHook.handleRemoveDocument}
          handleCoverChange={publishHook.handleCoverChange}
          handleRemoveCover={publishHook.handleRemoveCover}
          handleSaveDraft={publishHook.handleSaveDraft}
          handleFormSubmit={publishHook.handleFormSubmit}
        />

        <PublishConfirmModal
          isOpen={publishHook.isConfirmModalOpen}
          expectedTitle={publishHook.formData.title}
          isAuthor={true}
          loading={publishHook.loading}
          onConfirm={publishHook.handleConfirmPublish}
          onClose={publishHook.closePublishConfirmModal}
        />

        <UploadProgressModal
          isOpen={publishHook.loading}
          progress={publishHook.progress}
          title={publishHook.isEditingDraft ? "جاري تحديث الكتاب..." : "جاري نشر وتجهيز الكتاب..."}
        />
      </div>
    </AppLayout>
  );
}

export default BookPublishView;
