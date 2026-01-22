import React from "react";
import NewInteractiveStoryForm from "../../../components/myui/Users/AuthorPages/interactivestory/newinteractivestoryform";
import { postFormDataHelper } from "../../../../apis/apiHelpers";
import { AlertToast } from "../../../components/myui/AlertToast";
function NewInteractiveStory() {
  /**
   * @param {Object} formData
   * @returns {Promise<boolean>} success
   */
  const handleCreateStory = async (formData) => {
    try {
      const payload = new FormData();

      const story = {
        title: formData.title,
        genre: formData.genre,
        lens: formData.lens,
        maxScenes: Number(formData.sceneCount),
        constitution: formData.constitution,
        visualStyle: formData.artStyle, // This maps to visualStyle in API
        visualStyleNotes: formData.description, // Mapping description to style notes
      };

      // The API expects 'story' as a JSON blob and 'coverImage' as a file
      payload.append(
        "story",
        new Blob([JSON.stringify(story)], { type: "application/json" }),
      );
      payload.append("coverImage", formData.cover);

      const res = await postFormDataHelper({
        url: `${import.meta.env.VITE_API_URL}/stories`,
        formData: payload,
      });

      if (res?.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Create story failed:", error);
      return false;
    }
  };

  return <NewInteractiveStoryForm onSubmit={handleCreateStory} />;
}

export default NewInteractiveStory;
