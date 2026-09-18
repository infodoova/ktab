import { useState, useEffect, useCallback, useMemo } from "react";

export const CONSTITUTION_LABELS = {
  settingTime: "الزمان والأفق التاريخي",
  settingPlace: "المكان وبيئة العالم",
  coreTheme: "الفكرة والرسالة الجوهرية",
  tone: "النبرة والأسلوب",
  philosophy: "فلسفة العالم وقوانينه",
  mainConflict: "الصراع والدافع الرئيسي",
  forbiddenElements: "المحظورات في المسار",
  pacing: "إيقاع السرد",
};

export const ARABIC_TAG_MAP = {
  second_person: "المخاطب",
  first_person: "المتكلم",
  third_person: "الغائب",
  psychological: "نفسي",
  PSYCHOLOGICAL: "نفسي",
  survival: "بقاء",
  SURVIVAL: "بقاء",
  political: "سياسي",
  POLITICAL: "سياسي",
  moral: "أخلاقي",
  MORAL: "أخلاقي",
  cinematic_storybook: "سينمائي قصصي",
  CINEMATIC_STORYBOOK: "سينمائي قصصي",
  digital_art: "فن رقمي",
  DIGITAL_ART: "فن رقمي",
  dark_graphic_novel: "رواية مصورة",
  DARK_GRAPHIC_NOVEL: "رواية مصورة",
  watercolor: "ألوان مائية",
  WATERCOLOR: "ألوان مائية",
  oil_painting: "رسم زيتي",
  OIL_PAINTING: "رسم زيتي",
  adventure: "مغامرة",
  ADVENTURE: "مغامرة",
  fantasy: "خيال",
  FANTASY: "خيال",
  scifi: "خيال علمي",
  SCIFI: "خيال علمي",
  mystery: "غموض",
  MYSTERY: "غموض",
  horror: "رعب",
  HORROR: "رعب",
  drama: "دراما",
  DRAMA: "دراما",
  cinematic: "سينمائي",
  CINEMATIC: "سينمائي",
  anime: "أنمي",
  ANIME: "أنمي",
};

export const ARABIC_MODAL_TAG_MAP = {
  second_person: "أنت (المخاطب)",
  first_person: "أنا (المتكلم)",
  third_person: "هو / هي (الغائب)",
  ...ARABIC_TAG_MAP,
};

/**
 * Custom hook encapsulating modal lifecycle, image loading, and constitution entries.
 */
export function useStoryDetailsModal({
  isOpen,
  onClose,
  story,
  onStartSession,
} = {}) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  const coverUrl = story?.coverImageUrl || story?.coverImage || story?.cover || null;

  useEffect(() => {
    setCoverLoaded(false);
    setHasCoverError(false);
  }, [coverUrl]);

  const handleCoverLoad = useCallback(() => {
    setCoverLoaded(true);
  }, []);

  const handleCoverError = useCallback(() => {
    setHasCoverError(true);
    setCoverLoaded(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const title = story?.title || "قصة تفاعلية";
  const rawGenre = story?.genre || story?.visualStyle || "مغامرة";
  const genreLabel = ARABIC_MODAL_TAG_MAP[rawGenre] || rawGenre;
  const author = story?.authorName || story?.author || "مؤلف كِتَاب";

  const rawLens = story?.moralLens || story?.lens;
  const lensLabel = rawLens ? ARABIC_MODAL_TAG_MAP[rawLens] || rawLens : null;

  const rawStyle = story?.visualStyle || story?.genre;
  const styleLabel = rawStyle ? ARABIC_MODAL_TAG_MAP[rawStyle] || rawStyle : null;

  const scenes = story?.maxScenes ?? story?.sceneCount ?? story?.scenesCount ?? 0;

  const constitutionEntries = useMemo(() => {
    if (!story?.constitution) return [];

    let parsed = story.constitution;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        return [{ label: "الدستور السردي", value: story.constitution }];
      }
    }

    if (typeof parsed !== "object" || parsed === null) {
      return [];
    }

    return Object.entries(parsed)
      .filter(([_, val]) => val && String(val).trim().length > 0)
      .map(([key, value]) => ({
        key,
        label: CONSTITUTION_LABELS[key] || key,
        value: Array.isArray(value) ? value.join("، ") : String(value),
      }));
  }, [story?.constitution]);

  const handleStart = useCallback(() => {
    if (story?.id && typeof onStartSession === "function") {
      onStartSession(story.id);
    }
  }, [onStartSession, story?.id]);

  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return {
    coverUrl,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    title,
    genreLabel,
    author,
    lensLabel,
    styleLabel,
    scenes,
    constitutionEntries,
    handleStart,
    handleContentClick,
  };
}

export default useStoryDetailsModal;
