import React from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { useNewInteractiveStory } from "../hooks/useNewInteractiveStory";
import { NewInteractiveStoryForm } from "../components";
import "./NewInteractiveStoryView.css";

/**
 * Editorial studio view for drafting and launching new interactive branching stories.
 * Renders the multi-step interactive story form without bulky header banners.
 */
export function NewInteractiveStoryView({ pageName = "إنشاء قصة تفاعلية جديدة" }) {
  const location = useLocation();
  const {
    formData,
    coverPreview,
    currentStep,
    isSubmitting,
    errors,
    genrePresets,
    lensOptions,
    artStyleOptions,
    sceneCountConfig,
    handleInputChange,
    handleCoverSelect,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSubmit,
  } = useNewInteractiveStory();

  // Dynamic breadcrumb navigation in the top bar (mirroring new books)
  const breadcrumb = location.state?.from || {
    parentLabel: "القصص التفاعلية",
    parentPath: "/author/my-stories",
  };

  return (
    <AppLayout pageName={pageName} breadcrumb={breadcrumb} showSearch={false}>
      <div className="new-interactive-story-page">
        <NewInteractiveStoryForm
          formData={formData}
          coverPreview={coverPreview}
          currentStep={currentStep}
          errors={errors}
          isSubmitting={isSubmitting}
          genrePresets={genrePresets}
          lensOptions={lensOptions}
          artStyleOptions={artStyleOptions}
          sceneCountConfig={sceneCountConfig}
          onInputChange={handleInputChange}
          onCoverSelect={handleCoverSelect}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          onStepClick={handleStepClick}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}

export default NewInteractiveStoryView;
