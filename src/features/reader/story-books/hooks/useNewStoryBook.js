import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertToast } from "@/components/myui/AlertToast";
import { storyBooksService } from "../services/storyBooksService";

/**
 * Hook driving the live personalized storybook creation wizard.
 * Completely based on real backend endpoints and validation models:
 * - Real child profiles CRUD and inline creation
 * - Real age-band blueprints
 * - Real story parameters (interests, setting, time of day, page count, variety, tashkeel)
 */
export function useNewStoryBook() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Child Profiles State
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [showNewChildForm, setShowNewChildForm] = useState(false);
  const [isSavingChild, setIsSavingChild] = useState(false);

  // New Child Profile Form Data (Strictly matches CreateChildProfileRequest)
  const [newChildData, setNewChildData] = useState({
    nameAr: "",
    gender: "BOY",
    ageBand: "AGE_3_5",
    appearance: {
      skinTone: "LIGHT",
      hairColor: "BLACK",
      hairStyle: "SHORT_STRAIGHT",
      eyeColor: "BROWN",
      hijab: false,
      glasses: false,
    },
  });

  // Blueprints State
  const [blueprints, setBlueprints] = useState([]);
  const [loadingBlueprints, setLoadingBlueprints] = useState(false);

  // Story Specifications Form Data (Strictly matches CreateStorybookRequest)
  const [storyData, setStoryData] = useState({
    blueprintKey: "",
    interests: [],
    setting: "GENERIC_CITY",
    timeOfDay: "DAYTIME",
    style: "SOFT_WATERCOLOR",
    pageCount: 10,
    variety: "MSA",
    tashkeelLevel: "FULL",
    dedication: "",
  });

  // Dynamic Filters & Options from Backend (/storybook/filters)
  const [filters, setFilters] = useState(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const fetchFilters = useCallback(async () => {
    setLoadingFilters(true);
    try {
      const res = await storyBooksService.getFilters();
      if (res?.success && res.data) {
        setFilters(res.data);
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  // Fetch children on mount
  const fetchChildren = useCallback(async () => {
    setLoadingChildren(true);
    try {
      const res = await storyBooksService.getChildren();
      if (res?.success && Array.isArray(res.data)) {
        setChildren(res.data);
        if (res.data.length > 0 && !selectedChildId) {
          setSelectedChildId(res.data[0].id);
        } else if (res.data.length === 0) {
          setShowNewChildForm(true);
        }
      }
    } catch {
      AlertToast("تعذر جلب ملفات الأطفال", "ERROR");
    } finally {
      setLoadingChildren(false);
    }
  }, [selectedChildId]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // Selected child object
  const selectedChild = useMemo(() => {
    return children.find((c) => c.id === selectedChildId) || null;
  }, [children, selectedChildId]);

  // Fetch blueprints when selected child's ageBand changes
  useEffect(() => {
    const ageBand = selectedChild?.ageBand;
    if (!ageBand) {
      setBlueprints([]);
      return;
    }

    let isMounted = true;
    async function loadBlueprints() {
      setLoadingBlueprints(true);
      try {
        const res = await storyBooksService.getBlueprints(ageBand);
        if (res?.success && Array.isArray(res.data) && isMounted) {
          setBlueprints(res.data);
          if (res.data.length > 0) {
            setStoryData((prev) => ({
              ...prev,
              blueprintKey: res.data[0].key,
              setting: res.data[0].allowedSettings?.[0] || "GENERIC_CITY",
            }));
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setLoadingBlueprints(false);
      }
    }

    loadBlueprints();
    return () => {
      isMounted = false;
    };
  }, [selectedChild?.ageBand]);

  // Handle New Child Field Changes
  const handleNewChildChange = useCallback((field, value) => {
    setNewChildData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAppearanceChange = useCallback((field, value) => {
    setNewChildData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: value,
      },
    }));
  }, []);

  // Save New Child
  const handleSaveChild = useCallback(async () => {
    const name = newChildData.nameAr?.trim();
    if (!name || name.length < 2) {
      AlertToast("يرجى إدخال اسم الطفل باللغة العربية (حرفان على الأقل)", "WARNING");
      return;
    }

    // Backend Arabic name regex validation
    const arabicRegex = /^[\u0621-\u063A\u0641-\u064A\u0671-\u06D3][\u0621-\u063A\u0641-\u064A\u064B-\u0652\u0670\u0671-\u06D3 ]{1,29}$/;
    if (!arabicRegex.test(name)) {
      AlertToast("يجب أن يحتوي اسم الطفل على أحرف عربية فقط بدون أرقام أو رموز", "WARNING");
      return;
    }

    setIsSavingChild(true);
    try {
      const res = await storyBooksService.createChild(newChildData);
      if (res?.success && res.data) {
        AlertToast(`تم حفظ الملف التعريفي للبطل «${res.data.nameAr}»`, "SUCCESS");
        await fetchChildren();
        setSelectedChildId(res.data.id);
        setShowNewChildForm(false);
        setNewChildData({
          nameAr: "",
          gender: "BOY",
          ageBand: "AGE_3_5",
          appearance: {
            skinTone: "LIGHT",
            hairColor: "BLACK",
            hairStyle: "SHORT_STRAIGHT",
            eyeColor: "BROWN",
            hijab: false,
            glasses: false,
          },
        });
      }
    } catch (err) {
      AlertToast(err.message || "تعذر حفظ ملف الطفل، يرجى التحقق من المدخلات", "ERROR");
    } finally {
      setIsSavingChild(false);
    }
  }, [newChildData, fetchChildren]);

  // Story Data Change Handlers
  const handleStoryChange = useCallback((field, value) => {
    setStoryData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleInterestToggle = useCallback((interestValue) => {
    setStoryData((prev) => {
      const current = prev.interests || [];
      if (current.includes(interestValue)) {
        return { ...prev, interests: current.filter((i) => i !== interestValue) };
      }
      if (current.length >= 3) {
        AlertToast("يمكنك اختيار ٣ اهتمامات كحد أقصى للقصة", "WARNING");
        return prev;
      }
      return { ...prev, interests: [...current, interestValue] };
    });
  }, []);

  // Step Navigation & Validations
  const goToNextStep = useCallback(() => {
    if (currentStep === 1) {
      if (!selectedChildId && !showNewChildForm) {
        AlertToast("يرجى اختيار بطل للقصة أو إضافة ملف طفل جديد", "WARNING");
        return;
      }
      if (showNewChildForm) {
        AlertToast("يرجى الضغط على زر «حفظ ومتابعة» لحفظ ملف الطفل أولاً", "WARNING");
        return;
      }
    }

    if (currentStep === 2) {
      if (!storyData.blueprintKey) {
        AlertToast("يرجى اختيار مخطط أو فكرة الحكاية للمتابعة", "WARNING");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, [currentStep, selectedChildId, showNewChildForm, storyData.blueprintKey]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleStepClick = useCallback((stepId) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  }, [currentStep]);

  // Final Submission to Backend: POST /api/v1/storybook/books
  const handleSaveAndPublish = useCallback(async () => {
    if (!selectedChildId) {
      AlertToast("لم يتم تحديد طفل للقصة", "ERROR");
      return;
    }
    if (!storyData.blueprintKey) {
      AlertToast("لم يتم تحديد مخطط القصة", "ERROR");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        childProfileId: selectedChildId,
        blueprintKey: storyData.blueprintKey,
        interests: storyData.interests,
        setting: storyData.setting,
        timeOfDay: storyData.timeOfDay,
        style: storyData.style || "SOFT_WATERCOLOR",
        pageCount: Number(storyData.pageCount) || 10,
        variety: storyData.variety || "MSA",
        tashkeelLevel: storyData.tashkeelLevel || "FULL",
        dedication: storyData.dedication?.trim() || null,
      };

      const res = await storyBooksService.createStoryBook(payload);
      if (res?.success) {
        AlertToast("تم بدء توليد القصة التفاعلية بنجاح!", "SUCCESS");
        navigate("/reader/story-books");
      }
    } catch (err) {
      AlertToast(err.message || "حدث خطأ أثناء إطلاق توليد القصة", "ERROR");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedChildId, storyData, navigate]);

  return {
    currentStep,
    isSubmitting,
    goToNextStep,
    goToPrevStep,
    handleStepClick,
    handleSaveAndPublish,

    // Children
    children,
    loadingChildren,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    showNewChildForm,
    setShowNewChildForm,
    isSavingChild,
    newChildData,
    handleNewChildChange,
    handleAppearanceChange,
    handleSaveChild,

    // Blueprints & Story Data
    blueprints,
    loadingBlueprints,
    storyData,
    handleStoryChange,
    handleInterestToggle,

    // Backend Dynamic Filters
    filters,
    loadingFilters,
  };
}

export default useNewStoryBook;
