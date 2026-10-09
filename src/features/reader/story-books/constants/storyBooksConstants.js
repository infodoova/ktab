/**
 * Children's Story Books Constants and Enums
 * Strictly mapped to backend domain models and database schemas:
 * - AgeBand, ChildGender, ChildAppearance (skinTone, hairColor, hairStyle, eyeColor)
 * - CompanionSpec, CharacterInput
 * - Interest, StorySetting, StoryTime, LanguageVariety, TashkeelLevel, ArtStyle
 * - StorybookStatus with editorial visual indicators and localized status messages
 */

// 1. Validation Constraints & Regexes
export const STORYBOOK_VALIDATION = {
  MIN_PAGE_COUNT: 15,
  MAX_PAGE_COUNT: 20,
  DEFAULT_PAGE_COUNT: 16,
  MAX_INTERESTS: 3,
  MAX_CHARACTERS: 4,
  MAX_PLACE_LENGTH: 120,
  MAX_DEDICATION_LENGTH: 300,
  MAX_PHOTO_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_MIME_TYPES: ["image/jpeg", "image/png"],
  ARABIC_NAME_ERROR: "اسم الطفل يجب أن يكون بالأحرف العربية فقط (من حرفين إلى 30 حرفًا)، دون أرقام أو رموز.",
  // eslint-disable-next-line no-misleading-character-class
  ARABIC_NAME_REGEX: /^[\u0621-\u063A\u0641-\u064A\u0671-\u06D3][\u0621-\u063A\u0641-\u064A\u064B-\u0652\u0670\u0671-\u06D3 ]{1,29}$/u,
};

// 2. Age Bands (Backend: AgeBand)
export const AGE_BANDS = [
  { id: "AGE_3_5", value: "AGE_3_5", label: "٣ - ٥ سنوات (الطفولة المبكرة)", minAge: 3, maxAge: 5, maxWords: 25 },
  { id: "AGE_6_8", value: "AGE_6_8", label: "٦ - ٨ سنوات (المرحلة المتوسطة)", minAge: 6, maxAge: 8, maxWords: 45 },
  { id: "AGE_9_10", value: "AGE_9_10", label: "٩ - ١٠ سنوات (القرّاء اليافعين)", minAge: 9, maxAge: 10, maxWords: 70 },
];

export const AGE_BAND_LABELS = {
  AGE_3_5: "٣ - ٥ سنوات",
  AGE_6_8: "٦ - ٨ سنوات",
  AGE_9_10: "٩ - ١٠ سنوات",
};

// 3. Child Gender (Backend: ChildGender)
export const CHILD_GENDERS = [
  { value: "BOY", label: "ولد" },
  { value: "GIRL", label: "بنت" },
];

// 4. Child Appearance Options (Backend: ChildAppearance)
export const SKIN_TONES = [
  { value: "VERY_LIGHT", label: "بشرة فاتحة جداً", color: "#FDEFE2" },
  { value: "LIGHT", label: "بشرة فاتحة", color: "#F5D6B8" },
  { value: "LIGHT_OLIVE", label: "بشرة حنطية فاتحة", color: "#E0B788" },
  { value: "OLIVE", label: "بشرة حنطية", color: "#C68B59" },
  { value: "TAN", label: "بشرة قمحية / سمراء معتدلة", color: "#A26C43" },
  { value: "BROWN", label: "بشرة سمراء", color: "#6F432A" },
  { value: "DARK_BROWN", label: "بشرة داكنة", color: "#3E2316" },
];

export const HAIR_COLORS = [
  { value: "BLACK", label: "أسود", color: "#1A1A1A" },
  { value: "DARK_BROWN", label: "بني داكن", color: "#3B2219" },
  { value: "BROWN", label: "بني", color: "#593B2B" },
  { value: "LIGHT_BROWN", label: "بني فاتح", color: "#8B5A2B" },
  { value: "BLONDE", label: "أشقر", color: "#D4AF37" },
  { value: "RED", label: "أحمر", color: "#922B21" },
];

export const HAIR_STYLES = [
  { value: "VERY_SHORT", label: "قصير جداً" },
  { value: "SHORT_STRAIGHT", label: "قصير ناعم" },
  { value: "SHORT_CURLY", label: "قصير مجعد (كيرلي)" },
  { value: "MEDIUM_STRAIGHT", label: "متوسط الطول ناعم" },
  { value: "MEDIUM_CURLY", label: "متوسط الطول مجعد" },
  { value: "LONG_STRAIGHT", label: "طويل ناعم" },
  { value: "LONG_CURLY", label: "طويل مجعد" },
  { value: "PONYTAIL", label: "ذيل حصان" },
  { value: "BRAIDS", label: "ضفائر" },
];

export const EYE_COLORS = [
  { value: "DARK_BROWN", label: "بني داكن", color: "#2B1700" },
  { value: "BROWN", label: "بني", color: "#5C4033" },
  { value: "HAZEL", label: "عسلي", color: "#8E7618" },
  { value: "GREEN", label: "أخضر", color: "#2E6930" },
  { value: "BLUE", label: "أزرق", color: "#2E5B88" },
  { value: "GREY", label: "رمادي", color: "#69727D" },
];

// 5. Companions (Backend: CompanionSpec)
export const COMPANION_TYPES = [
  { value: "CAT", label: "قطة", isPet: true },
  { value: "DOG", label: "كلب", isPet: true },
  { value: "RABBIT", label: "أرنب", isPet: true },
  { value: "PARROT", label: "ببغاء", isPet: true },
];

export const PET_COLORS = [
  { value: "WHITE", label: "أبيض", color: "#FFFFFF" },
  { value: "BLACK", label: "أسود", color: "#1F2937" },
  { value: "GREY", label: "رمادي", color: "#9CA3AF" },
  { value: "ORANGE", label: "برتقالي", color: "#F97316" },
  { value: "BROWN", label: "بني", color: "#78350F" },
  { value: "BLACK_AND_WHITE", label: "أبيض وأسود", color: "#374151" },
  { value: "GREEN", label: "أخضر", color: "#16A34A" },
];

// 6. Interests (Backend: Interest) - up to 3 selectable
export const INTERESTS = [
  { value: "FOOTBALL", label: "كرة القدم" },
  { value: "CATS", label: "القطط" },
  { value: "DOGS", label: "الكلاب" },
  { value: "DINOSAURS", label: "الديناصورات" },
  { value: "SPACE", label: "الفضاء" },
  { value: "SEA_CREATURES", label: "الكائنات البحرية" },
  { value: "DRAWING", label: "الرسم" },
  { value: "MUSIC", label: "الموسيقى" },
  { value: "CARS", label: "السيارات" },
  { value: "HORSES", label: "الخيول" },
  { value: "BOOKS", label: "الكتب" },
  { value: "COOKING", label: "الطبخ" },
];

// 7. Story Settings / Place (Backend: place & setting)
export const STORY_SETTINGS = [
  { value: "AMMAN", label: "عمّان (البيوت الحجرية والتلال)", place: "عمّان" },
  { value: "BEIRUT", label: "بيروت (كورنيش البحر والبيوت التراثية)", place: "بيروت" },
  { value: "CAIRO", label: "القاهرة (نهر النيل والأهرامات في الأفق)", place: "القاهرة" },
  { value: "RIYADH", label: "الرياض (أبراج حديثة وبيوت دافئة)", place: "الرياض" },
  { value: "DUBAI", label: "دبي (أبراج زجاجية والخور والشواطئ)", place: "دبي" },
  { value: "GENERIC_CITY", label: "مدينة عربية دافئة وملونة", place: "مدينة عربية" },
  { value: "COUNTRYSIDE", label: "ريف أخضر وأشجار زيتون وتلال", place: "ريف أخضر" },
];

// 7b. Story Tones (Backend: storyTone)
export const STORY_TONES = [
  { value: "مغامرة وتشويق", label: "مغامرة وتشويق (Adventurous)" },
  { value: "دافئة وهادئة", label: "دافئة وهادئة (Warm & Gentle)" },
  { value: "مرحة وفكاهية", label: "مرحة وفكاهية (Playful & Fun)" },
  { value: "ملهمة وشجاعة", label: "ملهمة وشجاعة (Inspiring & Brave)" },
  { value: "خيالية وساحرة", label: "خيالية وساحرة (Magical & Wonder)" },
  { value: "تعليمية وممتعة", label: "تعليمية وممتعة (Educational & Curious)" },
];

// 7c. Story Themes (Backend: theme)
export const STORY_THEMES = [
  { value: "الصداقة والتعاون", label: "الصداقة والتعاون (Friendship)" },
  { value: "الشجاعة والثقة بالنفس", label: "الشجاعة والثقة بالنفس (Courage)" },
  { value: "حب الاستكشاف والفضول", label: "حب الاستكشاف والفضول (Curiosity)" },
  { value: "اللطف ومساعدة الآخرين", label: "اللطف ومساعدة الآخرين (Kindness)" },
  { value: "حب العائلة والترابط", label: "حب العائلة والترابط (Family)" },
  { value: "حب القراءة والتعلم", label: "حب القراءة والتعلم (Learning)" },
];

// 8. Story Time of Day (Backend: StoryTime)
export const STORY_TIMES = [
  { value: "MORNING", label: "الصباح الباكر ونور الفجر" },
  { value: "DAYTIME", label: "وضح النهار والشمس المشرقة" },
  { value: "AFTERNOON", label: "وقت العصر والظلال الذهبية" },
  { value: "SUNSET", label: "وقت الغروب والشفق الدافئ" },
  { value: "NIGHT", label: "الليل الهادئ والنجوم" },
];

// 9. Art Style (Backend: ArtStyle)
export const ART_STYLES = [
  { value: "SOFT_WATERCOLOR", label: "ألوان مائية حالمة (Soft Watercolor)" },
];

// 10. Supported Page Counts (Backend: pageCount between 15 and 20)
export const PAGE_COUNTS = [15, 16, 17, 18, 19, 20];

// 11. Language Variety (Backend: LanguageVariety)
export const LANGUAGE_VARIETIES = [
  { value: "MSA", label: "العربية الفصحى" },
  { value: "LEBANESE", label: "اللهجة اللبنانية" },
  { value: "EGYPTIAN", label: "اللهجة المصرية" },
  { value: "GULF", label: "اللهجة الخليجية" },
];

// 12. Tashkeel Level (Backend: TashkeelLevel)
export const TASHKEEL_LEVELS = [
  { value: "FULL", label: "تشكيل كامل لجميع الكلمات (الفصحى فقط)" },
  { value: "PARTIAL", label: "تشكيل جزئي لتيسير القراءة (الفصحى فقط)" },
  { value: "NONE", label: "بدون تشكيل (إلزامي للهجات العامية)" },
];

// 13. Storybook Status (Backend: StorybookStatus)
export const STORYBOOK_STATUS_CONFIG = {
  DRAFT: {
    label: "قيد التأليف",
    description: "يجري تأليف وصياغة قصة طفلكم بعناية...",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#cbd5e1",
    canRead: false,
    poll: true,
  },
  STORY_READY: {
    label: "النص جاهز للاعتماد",
    description: "اكتملت صياغة القصة وهي جاهزة لمراجعتكم واعتمادكم",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#0f172a",
    canRead: false,
    requiresAction: true,
  },
  CHARACTER_READY: {
    label: "لوحة الملامح جاهزة",
    description: "لوحة ملامح شخصية طفلكم جاهزة للمعاينة والاعتماد",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#0f172a",
    canRead: false,
    requiresAction: true,
  },
  ILLUSTRATING: {
    label: "جاري رسم الصفحات",
    description: "يجري رسم وتلوين صفحات القصة بالألوان المائية بدقة فائقة...",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#94a3b8",
    canRead: false,
    poll: true,
  },
  QA: {
    label: "فحص الجودة",
    description: "يجري فحص جودة الرسومات واتساق صفحات القصة...",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#94a3b8",
    canRead: false,
    poll: true,
  },
  RENDERING: {
    label: "جاري تجهيز وتجليد الكتاب",
    description: "يجري تجهيز وتجليد الكتاب النهائي للطباعة والمطالعة...",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#94a3b8",
    canRead: false,
    poll: true,
  },
  COMPLETED: {
    label: "مكتمل وجاهز للقراءة",
    description: "كتاب طفلكم مكتمل وجاهز للقراءة والتصفح والتحميل",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#0f172a",
    canRead: true,
  },
  READY: {
    label: "مكتمل وجاهز للقراءة",
    description: "كتاب طفلكم مكتمل وجاهز للقراءة والتصفح والتحميل",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#0f172a",
    canRead: true,
  },
  FAILED: {
    label: "تعذر التجهيز",
    description: "حدث خطأ أثناء معالجة القصة، يمكنكم إعادة المحاولة",
    color: "#475569",
    bg: "#f1f5f9",
    border: "#cbd5e1",
    canRead: false,
    canResume: true,
  },
  CANCELLED: {
    label: "تم إلغاء الإعداد",
    description: "تم إلغاء إعداد القصة",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    canRead: false,
  },
};

export const getStoryStatusConfig = (status) => {
  const statusKey = typeof status === "string" ? status.trim().toUpperCase() : "";
  return STORYBOOK_STATUS_CONFIG[statusKey] || {
    label: "غير معروف",
    description: "",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#cbd5e1",
    canRead: false,
  };
};
