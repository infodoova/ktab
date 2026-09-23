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
 * Generates an engaging, cohesive editorial narrative synopsis from the story's
 * background constitution (setting, conflict, core theme) instead of dumping raw
 * technical rubric prompts to the reader.
 */
export function generateStorySynopsis(story) {
  // If story has explicit human description and is not a JSON dump
  const rawDesc = story?.description || story?.synopsis || story?.summary;
  if (
    rawDesc &&
    typeof rawDesc === "string" &&
    !rawDesc.trim().startsWith("{") &&
    rawDesc.trim().length > 15
  ) {
    return rawDesc.trim();
  }

  let constitution = story?.constitution;
  if (typeof constitution === "string") {
    try {
      constitution = JSON.parse(constitution);
    } catch {
      if (!constitution.trim().startsWith("{")) {
        return constitution.trim();
      }
    }
  }

  if (!constitution || typeof constitution !== "object") {
    return rawDesc || "استعد لخوض تجربة تفاعلية فريدة ومثيرة، حيث تؤثر قراراتك واختياراتك على مصير الشخصيات ومسار الأحداث.";
  }

  const clean = (val) => {
    if (!val) return "";
    return String(val)
      .trim()
      .replace(/[،,.\s]+$/, "");
  };

  const ensurePunctuation = (str) => {
    if (!str) return "";
    const trimmed = str.trim();
    if (/[.!؟?]$/.test(trimmed)) return trimmed;
    return `${trimmed}.`;
  };

  const settingTime = clean(
    constitution.settingTime || constitution.time || constitution["الزمان والأفق التاريخي"]
  );
  const settingPlace = clean(
    constitution.settingPlace || constitution.place || constitution["المكان وبيئة العالم"]
  );
  const mainConflict = clean(
    constitution.mainConflict || constitution.conflict || constitution["الصراع والدافع الرئيسي"]
  );
  const coreTheme = clean(
    constitution.coreTheme || constitution.theme || constitution["الفكرة والرسالة الجوهرية"]
  );
  const philosophy = clean(
    constitution.philosophy || constitution["فلسفة العالم وقوانينه"]
  );

  const sentences = [];

  // 1. Setting context (Time and Place)
  if (settingPlace && settingTime) {
    const placePrefix = /^(في|داخل|ضمن|على)\s+/i.test(settingPlace) ? "" : "في ";
    sentences.push(ensurePunctuation(`تدور الأحداث ${placePrefix}${settingPlace}، خلال ${settingTime}`));
  } else if (settingPlace) {
    const placePrefix = /^(في|داخل|ضمن|على)\s+/i.test(settingPlace) ? "" : "في ";
    sentences.push(ensurePunctuation(`تدور الأحداث ${placePrefix}${settingPlace}`));
  } else if (settingTime) {
    sentences.push(ensurePunctuation(`تدور الأحداث خلال ${settingTime}`));
  }

  // 2. Main Narrative Conflict
  if (mainConflict) {
    sentences.push(ensurePunctuation(mainConflict));
  }

  // 3. Central Philosophical Question or Message
  if (coreTheme) {
    sentences.push(ensurePunctuation(coreTheme));
  } else if (philosophy) {
    sentences.push(ensurePunctuation(philosophy));
  }

  if (sentences.length > 0) {
    return sentences.join(" ");
  }

  // Fallback: collect any other non-instructional text values
  const otherValues = Object.entries(constitution)
    .filter(([k, v]) => v && typeof v === "string" && !["forbiddenElements", "pacing", "tone"].includes(k))
    .map(([, v]) => ensurePunctuation(clean(v)));

  if (otherValues.length > 0) {
    return otherValues.join(" ");
  }

  return "استعد لخوض تجربة تفاعلية فريدة ومثيرة، حيث تؤثر قراراتك واختياراتك على مصير الشخصيات ومسار الأحداث.";
}

/**
 * Custom hook encapsulating modal lifecycle, image loading, and constitution entries.
 */
export function useStoryDetailsModal({
  isOpen,
  onClose,
  story,
  onStartSession,
} = {}) {
  const coverUrl = story?.coverImageUrl || story?.coverImage || story?.cover || null;
  const [prevCover, setPrevCover] = useState(coverUrl);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  if (prevCover !== coverUrl) {
    setPrevCover(coverUrl);
    setCoverLoaded(false);
    setHasCoverError(false);
  }

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

  const synopsis = useMemo(() => {
    return generateStorySynopsis(story);
  }, [story]);

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
      .filter(([, val]) => val && String(val).trim().length > 0)
      .map(([key, value]) => ({
        key,
        label: CONSTITUTION_LABELS[key] || key,
        value: Array.isArray(value) ? value.join("، ") : String(value),
      }));
  }, [story]);

  const handleStart = useCallback(() => {
    if (story?.id && typeof onStartSession === "function") {
      onStartSession(story.id);
    }
  }, [onStartSession, story]);

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
    synopsis,
    constitutionEntries,
    handleStart,
    handleContentClick,
  };
}

export default useStoryDetailsModal;
