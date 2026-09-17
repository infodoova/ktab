import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createNewInteractiveStory } from "../services/newStoryService";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  GENRE_PRESETS,
  LENS_SELECT_OPTIONS,
  ART_STYLE_SELECT_OPTIONS,
  SCENE_COUNT_CONFIG,
  LOCAL_STORY_DRAFT_KEY,
  MAX_COVER_SIZE_BYTES,
} from "../constants/newStoryConstants";

function getCachedStoryDraft() {
  try {
    const cached = localStorage.getItem(LOCAL_STORY_DRAFT_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/**
 * Custom hook managing interactive story creation, autosave, file handling,
 * and multipart submission.
 */
export function useNewInteractiveStory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const cached = getCachedStoryDraft();
    if (cached) {
      return {
        title: cached.title || "",
        genre: cached.genre || GENRE_PRESETS[0].id,
        lens: cached.lens || LENS_SELECT_OPTIONS[0].value,
        sceneCount: cached.sceneCount || SCENE_COUNT_CONFIG.DEFAULT,
        constitution: cached.constitution || "",
        artStyle: cached.artStyle || ART_STYLE_SELECT_OPTIONS[0].value,
        description: cached.description || "",
        cover: null,
      };
    }
    return {
      title: "",
      genre: GENRE_PRESETS[0].id,
      lens: LENS_SELECT_OPTIONS[0].value,
      sceneCount: SCENE_COUNT_CONFIG.DEFAULT,
      constitution: "",
      artStyle: ART_STYLE_SELECT_OPTIONS[0].value,
      description: "",
      cover: null,
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverPreviewRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep = useCallback(
    (step) => {
      const stepErrors = {};
      if (step === 1) {
        if (!formData.title.trim()) {
          stepErrors.title = "يرجى إدخال عنوان القصة.";
        }
        if (!formData.cover) {
          stepErrors.cover = "يرجى اختيار صورة غلاف للقصة.";
        }
      } else if (step === 2) {
        if (!formData.constitution.trim()) {
          stepErrors.constitution = "يرجى كتابة تمهيد وقوانين عالم القصة.";
        }
      }

      if (Object.keys(stepErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...stepErrors }));
        AlertToast(Object.values(stepErrors)[0], "ERROR");
        return false;
      }
      return true;
    },
    [formData]
  );

  const goToNextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStepClick = useCallback(
    (step) => {
      if (step < currentStep) {
        setCurrentStep(step);
      } else if (step > currentStep) {
        if (validateStep(currentStep)) {
          setCurrentStep(step);
        }
      }
    },
    [currentStep, validateStep]
  );

  // Debounced autosave story fields to localStorage
  useEffect(() => {
    const hasContent = Boolean(formData.title.trim()) || Boolean(formData.constitution.trim());
    if (!hasContent) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          LOCAL_STORY_DRAFT_KEY,
          JSON.stringify({
            title: formData.title,
            genre: formData.genre,
            lens: formData.lens,
            sceneCount: formData.sceneCount,
            constitution: formData.constitution,
            artStyle: formData.artStyle,
            description: formData.description,
          })
        );
      } catch {
        // LocalStorage quota or access error handled gracefully
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [formData]);

  // Protect against accidental tab close or page reload when unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isDirty =
        formData.title.trim() || formData.constitution.trim() || formData.cover;
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, isSubmitting]);

  // Cleanup object URL on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      if (coverPreviewRef.current) {
        URL.revokeObjectURL(coverPreviewRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleCoverSelect = useCallback((file) => {
    if (coverPreviewRef.current) {
      URL.revokeObjectURL(coverPreviewRef.current);
      coverPreviewRef.current = null;
    }

    if (!file) {
      setFormData((prev) => ({ ...prev, cover: null }));
      setCoverPreview(null);
      return;
    }

    if (file.size > MAX_COVER_SIZE_BYTES) {
      const msg = "الحد الأقصى لحجم صورة الغلاف هو 5 ميغابايت.";
      setErrors((prev) => ({ ...prev, cover: msg }));
      AlertToast(msg, "ERROR");
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.cover;
      return next;
    });

    const objUrl = URL.createObjectURL(file);
    coverPreviewRef.current = objUrl;
    setFormData((prev) => ({ ...prev, cover: file }));
    setCoverPreview(objUrl);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const newErrors = {};
      if (!formData.title.trim()) {
        newErrors.title = "يرجى إدخال عنوان القصة.";
      }
      if (!formData.constitution.trim()) {
        newErrors.constitution = "يرجى كتابة تمهيد وقوانين عالم القصة.";
      }
      if (!formData.cover) {
        newErrors.cover = "يرجى اختيار صورة غلاف للقصة.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        AlertToast(newErrors.title || newErrors.constitution || newErrors.cover, "ERROR");
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        const payload = new FormData();
        const storyMeta = {
          title: formData.title.trim(),
          genre: formData.genre,
          lens: formData.lens,
          maxScenes: Number(formData.sceneCount),
          constitution: formData.constitution.trim(),
          visualStyle: formData.artStyle,
          visualStyleNotes: formData.description,
        };

        payload.append(
          "story",
          new Blob([JSON.stringify(storyMeta)], { type: "application/json" })
        );
        payload.append("coverImage", formData.cover);

        const res = await createNewInteractiveStory(payload);

        if (res?.messageStatus === "SUCCESS" || res?.status === 200 || res?.data) {
          try {
            localStorage.removeItem(LOCAL_STORY_DRAFT_KEY);
          } catch {
            // LocalStorage error handled gracefully
          }
          AlertToast("تم إنشاء القصة التفاعلية بنجاح!", "SUCCESS");
          navigate("/author/my-stories");
        } else {
          AlertToast(res?.message || "فشل إنشاء القصة", "ERROR");
        }
      } catch (err) {
        AlertToast("حدث خطأ غير متوقع أثناء إنشاء القصة", "ERROR");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  return {
    formData,
    coverPreview,
    isSubmitting,
    errors,
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    genrePresets: GENRE_PRESETS,
    lensOptions: LENS_SELECT_OPTIONS,
    artStyleOptions: ART_STYLE_SELECT_OPTIONS,
    sceneCountConfig: SCENE_COUNT_CONFIG,
    handleInputChange,
    handleCoverSelect,
    handleSubmit,
  };
}

export default useNewInteractiveStory;
