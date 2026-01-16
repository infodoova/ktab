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
      payload.append("lens", formData.lens);
      payload.append("sceneCount", Number(formData.sceneCount));
      payload.append("constitution", JSON.stringify(formData.constitution));
      payload.append("artStyle", formData.artStyle);
      payload.append("cover", formData.cover);

      const res = await postFormDataHelper({
        url: `${import.meta.env.VITE_API_URL}/stories`,
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
