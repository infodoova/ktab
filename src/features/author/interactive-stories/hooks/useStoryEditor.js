import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createStory } from "../services/authorStoriesService";
import { AlertToast } from "@/components/myui/AlertToast";

export const GENRE_PRESETS = [
  { id: "adventure", name: "مغامرة", desc: "رحلات شيقة وتحديات غير متوقعة" },
  { id: "fantasy", name: "خيال وأساطير", desc: "عوالم سحرية ومخلوقات أسطورية" },
  { id: "mystery", name: "غموض وتحقيق", desc: "ألغاز وأسرار تبحث عن حلول" },
  { id: "scifi", name: "خيال علمي", desc: "تكنولوجيا مستقبلية وفضاء شاسع" },
  { id: "horror", name: "رعب وتشويق", desc: "أجواء مرعبة وأحداث غامضة" },
  { id: "drama", name: "دراما وواقعي", desc: "قصص إنسانية وعلاقات عميقة" },
];

export const LENS_OPTIONS = [
  { id: "second_person", label: "أنت (المخاطب)", desc: "تجربة القارئ المباشرة كبطل للرواية" },
  { id: "first_person", label: "أنا (المتكلم)", desc: "السرد بصوت الشخصية الرئيسية" },
  { id: "third_person", label: "هو / هي (الغائب)", desc: "الراوي العليم الذي يراقب كل شيء" },
];

export const ART_STYLES = [
  { id: "cinematic", label: "سينمائي واقعي" },
  { id: "anime", label: "أنمي ورسوم متحركة" },
  { id: "digital_art", label: "فن رقمي عصري" },
  { id: "oil_painting", label: "رسم زيتي كلاسيكي" },
  { id: "watercolor", label: "ألوان مائية فنية" },
];

const LOCAL_STORY_DRAFT_KEY = "ktab_interactive_story_draft";

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
 * Hook for managing the interactive story creator wizard form.
 */
export function useStoryEditor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const cached = getCachedStoryDraft();
    if (cached) {
      return {
        title: cached.title || "",
        genre: cached.genre || "adventure",
        lens: cached.lens || "second_person",
        sceneCount: cached.sceneCount || 5,
        constitution: cached.constitution || "",
        artStyle: cached.artStyle || "cinematic",
        description: cached.description || "",
        cover: null,
      };
    }
    return {
      title: "",
      genre: "adventure",
      lens: "second_person",
      sceneCount: 5,
      constitution: "",
      artStyle: "cinematic",
      description: "",
      cover: null,
    };
  });

  const [coverPreview, setCoverPreview] = useState(null);
  const coverPreviewRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Ignored
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [formData]);

  // Protect against accidental tab close or page reload when dirty
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

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (coverPreviewRef.current) {
        URL.revokeObjectURL(coverPreviewRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    const objUrl = URL.createObjectURL(file);
    coverPreviewRef.current = objUrl;
    setFormData((prev) => ({ ...prev, cover: file }));
    setCoverPreview(objUrl);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (!formData.title.trim()) {
        AlertToast("يرجى إدخال عنوان القصة.", "ERROR");
        return;
      }

      if (!formData.constitution.trim()) {
        AlertToast("يرجى كتابة تمهيد أو حبكة القصة.", "ERROR");
        return;
      }

      if (!formData.cover) {
        AlertToast("يرجى اختيار صورة غلاف للقصة.", "ERROR");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = new FormData();
        const storyMeta = {
          title: formData.title,
          genre: formData.genre,
          lens: formData.lens,
          maxScenes: Number(formData.sceneCount),
          constitution: formData.constitution,
          visualStyle: formData.artStyle,
          visualStyleNotes: formData.description,
        };

        payload.append(
          "story",
          new Blob([JSON.stringify(storyMeta)], { type: "application/json" })
        );
        payload.append("coverImage", formData.cover);

        const res = await createStory(payload);

        if (res?.messageStatus === "SUCCESS" || res?.status === 200 || res?.data) {
          try {
            localStorage.removeItem(LOCAL_STORY_DRAFT_KEY);
          } catch {
            // Ignored
          }
          AlertToast("تم إنشاء القصة التفاعلية بنجاح!", "SUCCESS");
          navigate("/author/my-stories");
        } else {
          AlertToast(res?.message || "فشل إنشاء القصة", "ERROR");
        }
      } catch (err) {
        console.error("Create interactive story failed:", err);
        AlertToast("حدث خطأ أثناء إنشاء القصة", "ERROR");
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
    handleInputChange,
    handleCoverSelect,
    handleSubmit,
  };
}

export default useStoryEditor;

