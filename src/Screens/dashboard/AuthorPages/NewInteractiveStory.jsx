import React from "react";
import NewInteractiveStoryForm from "../../../components/myui/Users/AuthorPages/interactivestory/newinteractivestoryform";
import { postFormDataHelper } from "../../../../apis/apiHelpers";

function NewInteractiveStory() {
  /**
   * @param {Object} formData
   * @returns {Promise<boolean>} success
   */
  const handleCreateStory = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("genre", formData.genre);
      payload.append("ageRange", formData.ageRange);
      payload.append("sceneNum", Number(formData.sceneNum));
      payload.append("optionNum", Number(formData.optionNum));
      if (formData.artStyle) payload.append("artStyle", formData.artStyle);
      if (formData.positivePrompt)
        payload.append("positivePrompt", formData.positivePrompt);
      if (formData.negativePrompt)
        payload.append("negativePrompt", formData.negativePrompt);
      if (formData.cover) payload.append("cover", formData.cover);

      const res = await postFormDataHelper({
        url: `${import.meta.env.VITE_API_URL}/interactive-stories`,
        formData: payload,
      });

      return !!res;
    } catch (error) {
      console.error("Create story failed:", error);
      return false;
    }
  };

  return <NewInteractiveStoryForm onSubmit={handleCreateStory} />;
}

export default NewInteractiveStory;
