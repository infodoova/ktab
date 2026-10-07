import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertToast } from "@/components/myui/AlertToast";
import { storyBooksService } from "../services/storyBooksService";
import { STORYBOOK_VALIDATION } from "../constants/storyBooksConstants";

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

  // Child Data (Restored appearance structure for story generator, image is optional)
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
    image: null,
  });

  // Blueprints State (kept for optional reference)
  const [blueprints, setBlueprints] = useState([]);
  const [loadingBlueprints, setLoadingBlueprints] = useState(false);

  // Story Specifications Form Data
  const [storyData, setStoryData] = useState({
    storyIdea: "",
    interests: [],
    place: "",
    setting: "GENERIC_CITY",
    theme: "الصداقة والتعاون",
    storyTone: "مغامرة وتشويق",
    timeOfDay: "DAYTIME",
    style: "SOFT_WATERCOLOR",
    pageCount: 16,
    variety: "MSA",
    tashkeelLevel: "PARTIAL",
    dedication: "",
    photoConsent: true,
    hasCompanion: false,
    companion: {
      type: "CAT",
      nameAr: "",
      petColor: "ORANGE",
    },
    lesson: "",
    thingsToAvoidText: "",
  });

  // Fetch children on mount
  const fetchChildren = useCallback(async () => {
    setLoadingChildren(true);
    try {
      const res = await storyBooksService.getChildren();
      if (res?.success && Array.isArray(res.data)) {
        setChildren(res.data);
      }
    } catch {
      AlertToast("تعذر جلب ملفات الأطفال", "ERROR");
    } finally {
      setLoadingChildren(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // Selected child object
  const selectedChild = useMemo(() => {
    return children.find((c) => c.id === selectedChildId) || null;
  }, [children, selectedChildId]);

  // Helper to extract primitive scalar values from synthetic events or primitives
  const unwrapVal = (v) => {
    if (v && typeof v === "object" && "target" in v && !Array.isArray(v)) {
      return v.target?.value;
    }
    if (v && typeof v === "object" && "value" in v && !Array.isArray(v)) {
      return v.value;
    }
    return v;
  };

  // Handle New Child Field Changes
  const handleNewChildChange = useCallback((field, rawValue) => {
    const value = unwrapVal(rawValue);
    if (field === "nameAr" && selectedChildId) {
      setSelectedChildId(null);
    }
    setNewChildData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "gender" && value === "BOY") {
        updated.appearance = {
          ...updated.appearance,
          hijab: false,
          hairColor: updated.appearance?.hairColor || "BLACK",
          hairStyle: updated.appearance?.hairStyle || "SHORT_STRAIGHT",
        };
      }
      return updated;
    });
  }, [selectedChildId]);

  const handleAppearanceChange = useCallback((field, rawValue) => {
    const value = unwrapVal(rawValue);
    setNewChildData((prev) => {
      const updatedAppearance = {
        ...prev.appearance,
        [field]: value,
      };
      if (field === "hijab" && !value) {
        if (!updatedAppearance.hairColor) updatedAppearance.hairColor = "BLACK";
        if (!updatedAppearance.hairStyle) {
          updatedAppearance.hairStyle = prev.gender === "GIRL" ? "LONG_STRAIGHT" : "SHORT_STRAIGHT";
        }
      }
      return {
        ...prev,
        appearance: updatedAppearance,
      };
    });
  }, []);

  const handleSelectChild = useCallback((childInput) => {
    const raw = unwrapVal(childInput);
    const childId = raw !== undefined && raw !== null ? String(raw).trim() : "";

    if (!childId || childId === "NEW" || childId === "null" || childId === "undefined") {
      setSelectedChildId(null);
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
        image: null,
      });
      return;
    }

    const found = children.find(
      (c) => String(c.id) === childId || c.id === Number(childId)
    );
    if (found) {
      setSelectedChildId(found.id);
      const isGirl = found.gender === "GIRL";
      const isHijab = Boolean(found.appearance?.hijab);
      setNewChildData({
        nameAr: found.nameAr || "",
        gender: found.gender || "BOY",
        ageBand: found.ageBand || "AGE_3_5",
        appearance: {
          skinTone: found.appearance?.skinTone || "LIGHT",
          hairColor: found.appearance?.hairColor || (isHijab ? null : "BLACK"),
          hairStyle: found.appearance?.hairStyle || (isHijab ? null : (isGirl ? "LONG_STRAIGHT" : "SHORT_STRAIGHT")),
          eyeColor: found.appearance?.eyeColor || "BROWN",
          hijab: isHijab,
          glasses: Boolean(found.appearance?.glasses),
        },
        image: null,
      });
    }
  }, [children]);

  // Save New Child
  const handleSaveChild = useCallback(async () => {
    const name = newChildData.nameAr?.trim();
    if (!name || name.length < 2) {
      AlertToast("يرجى إدخال اسم الطفل باللغة العربية (حرفان على الأقل)", "WARNING");
      return;
    }

    // Backend Arabic name regex validation
    if (!STORYBOOK_VALIDATION.ARABIC_NAME_REGEX.test(name)) {
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
  const handleStoryChange = useCallback((field, rawValue) => {
    const value = unwrapVal(rawValue);
    setStoryData((prev) => {
      const updated = { ...prev, [field]: value };
      // If language variety is changed to a dialect, force tashkeelLevel to NONE
      if (field === "variety") {
        const isDialect = ["LEBANESE", "EGYPTIAN", "GULF"].includes(value);
        if (isDialect) {
          updated.tashkeelLevel = "NONE";
        } else if (prev.tashkeelLevel === "NONE") {
          updated.tashkeelLevel = "PARTIAL";
        }
      }
      return updated;
    });
  }, []);

  const handleCompanionChange = useCallback((field, rawValue) => {
    const value = unwrapVal(rawValue);
    setStoryData((prev) => ({
      ...prev,
      companion: {
        ...prev.companion,
        [field]: value,
      },
    }));
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
      const name = newChildData.nameAr?.trim();
      if (!name || name.length < 2) {
        AlertToast("يرجى إدخال اسم الطفل باللغة العربية (حرفان على الأقل)", "WARNING");
        return;
      }
    }

    if (currentStep === 2) {
      if (!storyData.storyIdea?.trim()) {
        AlertToast("يرجى كتابة فكرة ومخطط الحكاية للمتابعة", "WARNING");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, [currentStep, newChildData.nameAr, storyData.storyIdea]);

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
    if (!newChildData.nameAr?.trim()) {
      AlertToast("يرجى إدخال اسم الطفل أولاً", "WARNING");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedInterests = storyData.interestsText
        ? storyData.interestsText.split(/[،,]+/).map((s) => s.trim()).filter(Boolean)
        : (storyData.interests || []);

      const isDialect = ["LEBANESE", "EGYPTIAN", "GULF"].includes(storyData.variety);
      const attachedFile = newChildData.image?.file || null;

      let companionPayload = undefined;
      if (storyData.hasCompanion && storyData.companion?.nameAr?.trim()) {
        const isPet = ["CAT", "DOG", "RABBIT", "PARROT"].includes(storyData.companion.type);
        companionPayload = {
          type: storyData.companion.type || "CAT",
          nameAr: storyData.companion.nameAr.trim(),
          petColor: isPet ? (storyData.companion.petColor || "ORANGE") : undefined,
        };
      }

      const thingsToAvoidList = storyData.thingsToAvoidText
        ? storyData.thingsToAvoidText.split(/[،,]+/).map((s) => s.trim()).filter(Boolean)
        : undefined;

      /** @type {import("@/types/storybook").CreateStorybookRequest} */
      const payload = {
        childProfileId: selectedChildId ? Number(selectedChildId) : undefined,
        child: {
          nameAr: newChildData.nameAr.trim(),
          gender: newChildData.gender,
          ageBand: newChildData.ageBand,
          appearance: {
            skinTone: newChildData.appearance.skinTone,
            hairColor: newChildData.appearance.hijab ? undefined : newChildData.appearance.hairColor,
            hairStyle: newChildData.appearance.hijab ? undefined : newChildData.appearance.hairStyle,
            eyeColor: newChildData.appearance.eyeColor,
            glasses: Boolean(newChildData.appearance.glasses),
            hijab: Boolean(newChildData.appearance.hijab),
          },
        },
        companion: companionPayload,
        pageCount: Math.min(Math.max(Number(storyData.pageCount) || 16, 15), 20),
        style: "SOFT_WATERCOLOR",
        orientation: "SQUARE",
        variety: storyData.variety || "MSA",
        tashkeelLevel: isDialect ? "NONE" : (storyData.tashkeelLevel || "PARTIAL"),
        interests: Array.isArray(storyData.interests) ? storyData.interests.slice(0, 3) : [],
        setting: storyData.setting || "GENERIC_CITY",
        place: storyData.place?.trim() || undefined,
        theme: (storyData.theme || "الصداقة والتعاون").trim(),
        storyTone: (storyData.storyTone || "مغامرة وتشويق").trim(),
        timeOfDay: storyData.timeOfDay || "DAYTIME",
        storyIdea: storyData.storyIdea?.trim() || undefined,
        lesson: storyData.lesson?.trim() || undefined,
        thingsToAvoid: thingsToAvoidList,
        dedication: storyData.dedication?.trim() || undefined,
        photoConsent: Boolean(attachedFile || storyData.photoConsent),
      };

      const res = await storyBooksService.createStoryBook(payload, {
        childPhoto: attachedFile,
      });

      AlertToast(
        res?.message || "بدأنا برحلة إعداد القصة، وأرسلنا إليك تفاصيل الخطوات عبر البريد الإلكتروني.",
        "SUCCESS"
      );
      navigate("/reader/story-books");
    } catch (err) {
      AlertToast(err.message || "حدث خطأ أثناء إطلاق تأليف القصة", "ERROR");
    } finally {
      setIsSubmitting(false);
    }
  }, [newChildData, storyData, navigate, selectedChildId]);

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
    handleSelectChild,

    // Story Data
    storyData,
    handleStoryChange,
    handleCompanionChange,
    handleInterestToggle,
  };
}

export default useNewStoryBook;
