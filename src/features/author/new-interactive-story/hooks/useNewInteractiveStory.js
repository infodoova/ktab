import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createNewInteractiveStory } from "../services/newStoryService";
import { AlertToast } from "@/components/myui/AlertToast";
import { useEnumStore } from "@/core/store";
import { validateStoryStep, validateFullStory } from "../validation/storyWizardValidation";
import {
  GENRE_PRESETS,
  LENS_SELECT_OPTIONS,
  ART_STYLE_SELECT_OPTIONS,
  SCENE_COUNT_CONFIG,
  MAX_COVER_SIZE_BYTES,
  INITIAL_CONSTITUTION,
  CONSTITUTION_FIELDS,
  STORY_MAX_LENGTHS,
} from "../constants/newStoryConstants";

/**
 * Custom hook managing interactive story creation, file handling,
 * and multipart submission strictly adhering to the schema:
 * {
 *   title, genre, lens, maxScenes, visualStyle, visualStyleNotes,
 *   constitution: { settingTime, settingPlace, coreTheme, tone, philosophy, mainConflict, forbiddenElements, pacing }
 * }
 */
export function useNewInteractiveStory() {
  const navigate = useNavigate();

  const {
    storyGenres,
    storyLenses,
    visualStyles,
    uploadSpecs,
    fetchStoryEnums,
  } = useEnumStore();

  useEffect(() => {
    fetchStoryEnums();
    try {
      localStorage.removeItem("ktab_new_interactive_story_draft");
    } catch {
      // Ignored
    }
  }, [fetchStoryEnums]);

  const [formData, setFormData] = useState({
    title: "",
    genre: "fantasy",
    lens: "SURVIVAL",
    sceneCount: SCENE_COUNT_CONFIG.DEFAULT,
    visualStyle: "CINEMATIC_STORYBOOK",
    visualStyleNotes: "",
    constitution: { ...INITIAL_CONSTITUTION },
    cover: null,
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

  const handleVisualStyleNotesChange = useCallback(
    (e) => {
      const val = e.target.value;
      setFormData((prev) => ({ ...prev, visualStyleNotes: val }));
      clearFieldError("visualStyleNotes");
    },
    [clearFieldError]
  );

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

      const spec = uploadSpecs?.storyCover || {};
      const maxBytes = spec.maxSizeBytes || MAX_COVER_SIZE_BYTES;
      const maxSizeMb = spec.maxSizeMb || 5;

      if (file.size > maxBytes) {
        const msg = `الحد الأقصى لحجم صورة الغلاف هو ${maxSizeMb} ميغابايت.`;
        setErrors((prev) => ({ ...prev, cover: msg }));
        AlertToast(msg, "ERROR");
        return;
      }

      // Validate aspect ratio dynamically based on uploadSpecs (target 1.0, tolerance 0.2)
      const targetRatio = typeof spec.targetRatio === "number" ? spec.targetRatio : 1.0;
      const tolerance = typeof spec.tolerance === "number" ? spec.tolerance : 0.2;
      const minRatio = targetRatio - tolerance;
      const maxRatio = targetRatio + tolerance;

      const tempUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const ratio = naturalWidth / naturalHeight;
        const isAcceptableRatio = ratio >= minRatio && ratio <= maxRatio;

        if (!isAcceptableRatio) {
          URL.revokeObjectURL(tempUrl);
          const ratioDesc = spec.aspectRatio || "1:1";
          const msg = `يجب أن تكون صورة الغلاف قريبة من النسبة ${ratioDesc} (أبعاد صورتك الحالية: ${naturalWidth}×${naturalHeight}).`;
          setErrors((prev) => ({ ...prev, cover: msg }));
          AlertToast(msg, "ERROR");
          setFormData((prev) => ({ ...prev, cover: null }));
          setCoverPreview(null);
          return;
        }

        clearFieldError("cover");
        coverPreviewRef.current = tempUrl;
        setFormData((prev) => ({ ...prev, cover: file }));
        setCoverPreview(tempUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        const msg = "تعذر قراءة ملف الصورة. يرجى اختيار صورة صالحة.";
        setErrors((prev) => ({ ...prev, cover: msg }));
        AlertToast(msg, "ERROR");
      };

      // Assign src to trigger image loading and aspect ratio check
      img.src = tempUrl;
    },
    [clearFieldError, uploadSpecs]
  );

  // Step validation
  const validateStep = useCallback(
    (step) => {
      const stepErrors = validateStoryStep(step, formData);

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

      const newErrors = validateFullStory(formData);

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
          AlertToast("تم إنشاء القصة التفاعلية بنجاح!", "SUCCESS");
          navigate("/author/my-stories");
        } else {
          AlertToast(res?.message || "فشل إنشاء القصة", "ERROR");
        }
      } catch {
        AlertToast("حدث خطأ غير متوقع أثناء إنشاء القصة", "ERROR");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  // Dynamically derived options from backend enums
  const dynamicGenrePresets = useMemo(() => {
    if (storyGenres && storyGenres.length > 0) {
      return storyGenres.map((g) => ({
        id: g.key,
        name: g.labelAr,
        label: g.labelAr,
        desc: g.labelEn || "",
      }));
    }
    return GENRE_PRESETS;
  }, [storyGenres]);

  const dynamicLensOptions = useMemo(() => {
    if (storyLenses && storyLenses.length > 0) {
      return storyLenses.map((l) => ({
        value: l.key,
        label: l.labelAr,
      }));
    }
    return LENS_SELECT_OPTIONS;
  }, [storyLenses]);

  const dynamicArtStyleOptions = useMemo(() => {
    if (visualStyles && visualStyles.length > 0) {
      return visualStyles.map((v) => ({
        value: v.key,
        label: v.labelAr,
      }));
    }
    return ART_STYLE_SELECT_OPTIONS;
  }, [visualStyles]);

  // Pre-calculated labels to keep JSX 100% declarative with zero logic
  const selectedGenreLabel = useMemo(() => {
    const found = dynamicGenrePresets.find(
      (g) => g.id?.toLowerCase() === formData.genre?.toLowerCase() || g.id === formData.genre
    );
    return found?.label || formData.genre;
  }, [dynamicGenrePresets, formData.genre]);

  const selectedLensLabel = useMemo(() => {
    const found = dynamicLensOptions.find(
      (l) => l.value?.toLowerCase() === formData.lens?.toLowerCase() || l.value === formData.lens
    );
    return found?.label || formData.lens;
  }, [dynamicLensOptions, formData.lens]);

  const selectedStyleLabel = useMemo(() => {
    const found = dynamicArtStyleOptions.find(
      (s) => s.value?.toLowerCase() === formData.visualStyle?.toLowerCase() || s.value === formData.visualStyle
    );
    return found?.label || formData.visualStyle;
  }, [dynamicArtStyleOptions, formData.visualStyle]);

  const filledConstitutionCount = useMemo(() => {
    return Object.values(formData.constitution).filter((v) => Boolean(v && v.trim())).length;
  }, [formData.constitution]);

  return {
    formData,
    coverPreview,
    isSubmitting,
    errors,
    currentStep,
    genrePresets: dynamicGenrePresets,
    lensOptions: dynamicLensOptions,
    artStyleOptions: dynamicArtStyleOptions,
    sceneCountConfig: SCENE_COUNT_CONFIG,
    constitutionFields: CONSTITUTION_FIELDS,
    maxLengths: STORY_MAX_LENGTHS,
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
