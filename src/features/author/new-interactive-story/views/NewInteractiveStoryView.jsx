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
  const storyHook = useNewInteractiveStory();

  const breadcrumb = location.state?.from || {
    parentLabel: "القصص التفاعلية",
    parentPath: "/author/my-stories",
  };

  return (
    <AppLayout pageName={pageName} breadcrumb={breadcrumb} showSearch={false}>
      <div className="new-interactive-story-page">
        <NewInteractiveStoryForm
          formData={storyHook.formData}
          coverPreview={storyHook.coverPreview}
          currentStep={storyHook.currentStep}
          errors={storyHook.errors}
          isSubmitting={storyHook.isSubmitting}
          genrePresets={storyHook.genrePresets}
          lensOptions={storyHook.lensOptions}
          artStyleOptions={storyHook.artStyleOptions}
          sceneCountConfig={storyHook.sceneCountConfig}
          constitutionFields={storyHook.constitutionFields}
          maxLengths={storyHook.maxLengths}
          selectedGenreLabel={storyHook.selectedGenreLabel}
          selectedLensLabel={storyHook.selectedLensLabel}
          selectedStyleLabel={storyHook.selectedStyleLabel}
          filledConstitutionCount={storyHook.filledConstitutionCount}
          handleTitleChange={storyHook.handleTitleChange}
          handleGenreClick={storyHook.handleGenreClick}
          handleStepBtnClick={storyHook.handleStepBtnClick}
          handleConstitutionChange={storyHook.handleConstitutionChange}
          handleLensChange={storyHook.handleLensChange}
          handleSceneCountChange={storyHook.handleSceneCountChange}
          handleVisualStyleChange={storyHook.handleVisualStyleChange}
          handleVisualStyleNotesChange={storyHook.handleVisualStyleNotesChange}
          handleCoverSelect={storyHook.handleCoverSelect}
          goToNextStep={storyHook.goToNextStep}
          goToPrevStep={storyHook.goToPrevStep}
          handleSubmit={storyHook.handleSubmit}
        />
      </div>
    </AppLayout>
  );
}

export default NewInteractiveStoryView;
