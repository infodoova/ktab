import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertToast } from "@/components/myui/AlertToast";
import { storyBooksService } from "../services/storyBooksService";

/**
 * Custom hook managing the multi-step interactive children story creation wizard.
 */
export function useNewStoryBook() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    heroName: "",
    ageGroup: "3-6",
    category: "مغامرات وخيال",
    theme: "magic_forest",
    artStyle: "3d_pixar",
    summary: "",
    firstSceneIntro: "",
    choiceA: "يتبع المسار اللامع باتجاه وادي الأشجار العتيقة",
    choiceB: "يصعد التلة الخضراء لمقابلة طائر الحكمة",
  });

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const goToNextStep = useCallback(() => {
    if (currentStep === 1 && !formData.title.trim()) {
      AlertToast("يرجى كتابة عنوان للحكاية أولاً", "WARNING");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, [currentStep, formData.title]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStepClick = useCallback((stepId) => {
    setCurrentStep(stepId);
  }, []);

  const handleSaveAndPublish = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await storyBooksService.createStoryBook(formData);
      AlertToast("تم حفظ ونشر قصة الأطفال التفاعلية بنجاح", "SUCCESS");
      navigate("/reader/story-books");
    } catch {
      AlertToast("حدث خطأ أثناء حفظ القصة، يرجى المحاولة ثانية", "ERROR");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate]);

  return {
    currentStep,
    formData,
    isSubmitting,
    handleFieldChange,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSaveAndPublish,
  };
}

export default useNewStoryBook;
