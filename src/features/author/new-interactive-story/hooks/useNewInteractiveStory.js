import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createNewInteractiveStory } from "../services/newStoryService";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  GENRE_PRESETS,
  LENS_OPTIONS,
  LENS_SELECT_OPTIONS,
  ART_STYLES,
  ART_STYLE_SELECT_OPTIONS,
  SCENE_COUNT_CONFIG,
  LOCAL_STORY_DRAFT_KEY,
  MAX_COVER_SIZE_BYTES,
  INITIAL_CONSTITUTION,
  CONSTITUTION_FIELDS,
} from "../constants/newStoryConstants";

function getCachedStoryDraft() {
  try {
    const cached = localStorage.getItem(LOCAL_STORY_DRAFT_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Custom hook managing interactive story creation, autosave, file handling,
 * and multipart submission strictly adhering to the schema:
 * {
 *   title, genre, lens, maxScenes, visualStyle, visualStyleNotes,
 *   constitution: { settingTime, settingPlace, coreTheme, tone, philosophy, mainConflict, forbiddenElements, pacing }
 * }
 */
export function useNewInteractiveStory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const cached = getCachedStoryDraft();
    const constitutionDraft = {
      ...INITIAL_CONSTITUTION,
      ...(cached?.constitution || {}),
    };

    return {
      title: cached?.title || "",
      genre: cached?.genre || "fantasy",
      lens: cached?.lens || "SURVIVAL",
      sceneCount: cached?.sceneCount || cached?.maxScenes || SCENE_COUNT_CONFIG.DEFAULT,
      visualStyle: cached?.visualStyle || "CINEMATIC_STORYBOOK",
      visualStyleNotes: cached?.visualStyleNotes || "",
      constitution: constitutionDraft,
      cover: null,
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState(null);
  const coverPreviewRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Clean error when field updates
  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Handlers for inputs - pure event consumption
  const handleTitleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setFormData((prev) => ({ ...prev, title: val }));
      clearFieldError("title");
    },
    [clearFieldError]
  );

  const handleGenreClick = useCallback((e) => {
    const id = e.currentTarget.dataset.id;
    if (id) {
      setFormData((prev) => ({ ...prev, genre: id }));
    }
  }, []);

  const handleConstitutionChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        constitution: {
          ...prev.constitution,
          [name]: value,
        },
      }));
      clearFieldError(`constitution_${name}`);
    },
    [clearFieldError]
  );

  const handleLensChange = useCallback((e) => {
    const val = typeof e === "string" ? e : e?.target?.value;
    setFormData((prev) => ({ ...prev, lens: val }));
  }, []);

  const handleSceneCountChange = useCallback((e) => {
    const val = Number(e?.target?.value ?? e);
    setFormData((prev) => ({ ...prev, sceneCount: val }));
  }, []);

  const handleVisualStyleChange = useCallback((e) => {
    const val = typeof e === "string" ? e : e?.target?.value;
    setFormData((prev) => ({ ...prev, visualStyle: val }));
  }, []);

  const handleVisualStyleNotesChange = useCallback((e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, visualStyleNotes: val }));
  }, []);

  const handleCoverSelect = useCallback(
    (file) => {
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

      clearFieldError("cover");
      const objUrl = URL.createObjectURL(file);
      coverPreviewRef.current = objUrl;
      setFormData((prev) => ({ ...prev, cover: file }));
      setCoverPreview(objUrl);
    },
    [clearFieldError]
  );

  // Step validation
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
        if (!formData.constitution.settingTime.trim()) {
          stepErrors.constitution_settingTime = "يرجى تحديد زمن القصة.";
        }
        if (!formData.constitution.settingPlace.trim()) {
          stepErrors.constitution_settingPlace = "يرجى تحديد مكان القصة وبيئتها.";
        }
        if (!formData.constitution.coreTheme.trim()) {
          stepErrors.constitution_coreTheme = "يرجى كتابة الفكرة الجوهرية للقصة.";
        }
        if (!formData.constitution.mainConflict.trim()) {
          stepErrors.constitution_mainConflict = "يرجى توضيح الصراع الأساسي.";
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

  const handleStepBtnClick = useCallback(
    (e) => {
      const step = Number(e.currentTarget.dataset.step);
      if (step) {
        handleStepClick(step);
      }
    },
    [handleStepClick]
  );

  // Autosave to localStorage
  useEffect(() => {
    const hasContent =
      Boolean(formData.title.trim()) ||
      Boolean(formData.constitution.coreTheme.trim()) ||
      Boolean(formData.constitution.settingPlace.trim());

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
            visualStyle: formData.visualStyle,
            visualStyleNotes: formData.visualStyleNotes,
            constitution: formData.constitution,
          })
        );
      } catch {
        // Handled silently
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [formData]);

  // Prevent navigation loss
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isDirty =
        formData.title.trim() ||
        formData.constitution.coreTheme.trim() ||
        formData.cover;
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, isSubmitting]);

  // Clean preview URL on unmount
  useEffect(() => {
    return () => {
      if (coverPreviewRef.current) {
        URL.revokeObjectURL(coverPreviewRef.current);
      }
    };
  }, []);

  // Submit Handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const newErrors = {};
      if (!formData.title.trim()) {
        newErrors.title = "يرجى إدخال عنوان القصة.";
      }
      if (!formData.cover) {
        newErrors.cover = "يرجى اختيار صورة غلاف للقصة.";
      }
      if (!formData.constitution.settingTime.trim()) {
        newErrors.constitution_settingTime = "يرجى إدخال الزمان.";
      }
      if (!formData.constitution.settingPlace.trim()) {
        newErrors.constitution_settingPlace = "يرجى إدخال المكان.";
      }
      if (!formData.constitution.coreTheme.trim()) {
        newErrors.constitution_coreTheme = "يرجى إدخال الفكرة الجوهرية.";
      }
      if (!formData.constitution.mainConflict.trim()) {
        newErrors.constitution_mainConflict = "يرجى إدخال الصراع الأساسي.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        AlertToast(Object.values(newErrors)[0], "ERROR");
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
          visualStyle: formData.visualStyle,
          visualStyleNotes: formData.visualStyleNotes.trim(),
          constitution: {
            settingTime: formData.constitution.settingTime.trim(),
            settingPlace: formData.constitution.settingPlace.trim(),
            coreTheme: formData.constitution.coreTheme.trim(),
            tone: formData.constitution.tone.trim(),
            philosophy: formData.constitution.philosophy.trim(),
            mainConflict: formData.constitution.mainConflict.trim(),
            forbiddenElements: formData.constitution.forbiddenElements.trim(),
            pacing: formData.constitution.pacing.trim(),
          },
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
            // Handled
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

  // Pre-calculated labels to keep JSX 100% declarative with zero logic
  const selectedGenreLabel = useMemo(() => {
    const found = GENRE_PRESETS.find((g) => g.id === formData.genre);
    return found?.label || formData.genre;
  }, [formData.genre]);

  const selectedLensLabel = useMemo(() => {
    const found = LENS_OPTIONS.find((l) => l.id === formData.lens);
    return found?.label || formData.lens;
  }, [formData.lens]);

  const selectedStyleLabel = useMemo(() => {
    const found = ART_STYLES.find((s) => s.id === formData.visualStyle);
    return found?.label || formData.visualStyle;
  }, [formData.visualStyle]);

  const filledConstitutionCount = useMemo(() => {
    return Object.values(formData.constitution).filter((v) => Boolean(v && v.trim())).length;
  }, [formData.constitution]);

  return {
    formData,
    coverPreview,
    isSubmitting,
    errors,
    currentStep,
    genrePresets: GENRE_PRESETS,
    lensOptions: LENS_SELECT_OPTIONS,
    artStyleOptions: ART_STYLE_SELECT_OPTIONS,
    sceneCountConfig: SCENE_COUNT_CONFIG,
    constitutionFields: CONSTITUTION_FIELDS,
    selectedGenreLabel,
    selectedLensLabel,
    selectedStyleLabel,
    filledConstitutionCount,
    handleTitleChange,
    handleGenreClick,
    handleStepBtnClick,
    handleConstitutionChange,
    handleLensChange,
    handleSceneCountChange,
    handleVisualStyleChange,
    handleVisualStyleNotesChange,
    handleCoverSelect,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSubmit,

  };
}

export default useNewInteractiveStory;
