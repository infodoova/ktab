/**
 * Constants for Author Interactive Stories feature.
 */

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
  CINEMATIC_STORYBOOK: "سينمائي قصصي",
  DIGITAL_ART: "فن رقمي",
  DARK_GRAPHIC_NOVEL: "رواية مصورة",
  WATERCOLOR: "ألوان مائية",
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

export const INTERACTIVE_STORIES_GENRE_OPTIONS = [
  { value: "ALL", label: "جميع التصنيفات" },
  { value: "scifi", label: "خيال علمي" },
  { value: "adventure", label: "مغامرة" },
  { value: "fantasy", label: "خيال" },
  { value: "mystery", label: "غموض" },
  { value: "drama", label: "دراما" },
  { value: "horror", label: "رعب" },
];

export const INTERACTIVE_STORIES_SORT_OPTIONS = [
  { value: "newest", label: "الأحدث أولاً" },
  { value: "scenes", label: "الأكثر مشاهد" },
  { value: "title", label: "أبجدياً" },
];
