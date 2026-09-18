/**
 * Constants and configuration options for New Interactive Story creation.
 */

export const GENRE_PRESETS = [
  { id: "adventure", name: "مغامرة", label: "مغامرة", desc: "رحلات شيقة وتحديات غير متوقعة" },
  { id: "fantasy", name: "خيال", label: "خيال", desc: "عوالم سحرية ومخلوقات أسطورية" },
  { id: "mystery", name: "غموض", label: "غموض", desc: "ألغاز وأسرار تبحث عن حلول" },
  { id: "scifi", name: "خيال علمي", label: "خيال علمي", desc: "تكنولوجيا مستقبلية وفضاء شاسع" },
  { id: "horror", name: "رعب", label: "رعب", desc: "أجواء مرعبة وأحداث غامضة" },
  { id: "drama", name: "دراما", label: "دراما", desc: "قصص إنسانية وعلاقات عميقة" },
];

export const LENS_OPTIONS = [
  { id: "SURVIVAL", label: "بقاء (SURVIVAL)", desc: "قصة عن البقاء وإدارة الموارد والمخاطر" },
  { id: "POLITICAL", label: "سياسي (POLITICAL)", desc: "قصة عن السلطة والنفوذ والثقة" },
  { id: "PSYCHOLOGICAL", label: "نفسي (PSYCHOLOGICAL)", desc: "قصة عن المشاعر والقلق والقرارات النفسية" },
  { id: "MORAL", label: "أخلاقي (MORAL)", desc: "قصة عن الذنب والاختيارات الصعبة والتضحية" },
];

export const ART_STYLES = [
  { id: "CINEMATIC_STORYBOOK", label: "سينمائي قصصي (CINEMATIC_STORYBOOK)" },
  { id: "DIGITAL_ART", label: "فن رقمي عصري (DIGITAL_ART)" },
  { id: "DARK_GRAPHIC_NOVEL", label: "رواية مصورة مظلمة (DARK_GRAPHIC_NOVEL)" },
  { id: "ANIME", label: "أنمي ورسوم متحركة (ANIME)" },
  { id: "WATERCOLOR", label: "ألوان مائية فنية (WATERCOLOR)" },
  { id: "OIL_PAINTING", label: "رسم زيتي كلاسيكي (OIL_PAINTING)" },
];

export const LENS_SELECT_OPTIONS = LENS_OPTIONS.map((l) => ({
  value: l.id,
  label: `${l.label} - ${l.desc}`,
}));

export const ART_STYLE_SELECT_OPTIONS = ART_STYLES.map((a) => ({
  value: a.id,
  label: a.label,
}));

export const SCENE_COUNT_CONFIG = {
  MIN: 3,
  MAX: 15,
  DEFAULT: 5,
  STEP: 1,
};

export const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const LOCAL_STORY_DRAFT_KEY = "ktab_interactive_story_draft";

export const CONSTITUTION_FIELDS = [
  {
    key: "settingTime",
    label: "الزمان والأفق التاريخي",
    placeholder: "مثال: العصر الحالي، عام 2045، العصور الوسطى...",
    hint: "الحقبة الزمنية والأفق المعرفي والتكنولوجي",
  },
  {
    key: "settingPlace",
    label: "المكان وبيئة العالم",
    placeholder: "مثال: فندق قديم مهجور، محطة فضائية نائية...",
    hint: "البيئة المادية وجغرافية الأحداث",
  },
  {
    key: "coreTheme",
    label: "الفكرة الجوهرية",
    placeholder: "مثال: الهروب من المجهول ومواجهة أوهام الغرفة...",
    hint: "الرسالة والقضية المحورية للقصة",
  },
  {
    key: "tone",
    label: "النبرة والأسلوب",
    placeholder: "مثال: غموض وإثارة، توتر متصاعد وسريع...",
    hint: "الإحساس العام للنص وكيف تروى الأحداث",
  },
  {
    key: "philosophy",
    label: "فلسفة العالم وقوانينه",
    placeholder: "مثال: القرارات تحدد الواقع والمصير، كل كلمة لها ثمن...",
    hint: "القاعدة الفكرية العميقة المنعكسة في الخيارات",
  },
  {
    key: "mainConflict",
    label: "الصراع الأساسي",
    placeholder: "مثال: محاولة النجاة واكتشاف سر الغرفة 404...",
    hint: "التحدي المحوري الحاضر حتى المشهد الأخير",
  },
  {
    key: "forbiddenElements",
    label: "العناصر الممنوعة (المحظورات)",
    placeholder: "مثال: لا عناصر رومانسية، لا خوارق، لا مسارات كوميدية...",
    hint: "يمنع المحرك الذكي من الانحراف عن جوهر القصة",
  },
  {
    key: "pacing",
    label: "إيقاع السرد",
    placeholder: "مثال: متصاعد وسريع، بطيء ومكثف...",
    hint: "كيفية تطور الأحداث وتسارع وتيرة المشاهد",
  },
];

export const INITIAL_CONSTITUTION = {
  settingTime: "",
  settingPlace: "",
  coreTheme: "",
  tone: "",
  philosophy: "",
  mainConflict: "",
  forbiddenElements: "",
  pacing: "",
};
