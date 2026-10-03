/**
 * Children's Story Books Constants and Enums
 * Strictly mapped to backend domain models and database schemas:
 * - AgeBand, ChildGender, ChildAppearance (skinTone, hairColor, hairStyle, eyeColor)
 * - Interest, StorySetting, StoryTime, LanguageVariety, TashkeelLevel, ArtStyle
 * - StorybookStatus with editorial visual indicators
 */

// 1. Age Bands (Backend: AgeBand)
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

// 2. Child Gender (Backend: ChildGender)
export const CHILD_GENDERS = [
  { value: "BOY", label: "ولد" },
  { value: "GIRL", label: "بنت" },
];

// 3. Child Appearance Options (Backend: ChildAppearance)
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

// 4. Interests (Backend: Interest) - up to 3 selectable
export const INTERESTS = [
  { value: "FOOTBALL", label: "كرة القدم" },
  { value: "CATS", label: "القطط" },
  { value: "DOGS", label: "الكلاب" },
  { value: "DINOSAURS", label: "الديناصورات" },
  { value: "SPACE", label: "الفضاء والكواكب" },
  { value: "SEA_CREATURES", label: "كائنات البحر" },
  { value: "DRAWING", label: "الرسم والتلوين" },
  { value: "MUSIC", label: "الموسيقى والغناء" },
  { value: "CARS", label: "السيارات والمركبات" },
  { value: "HORSES", label: "الخيول والفروسية" },
  { value: "BOOKS", label: "قراءة الكتب" },
  { value: "COOKING", label: "المساعدة في المطبخ" },
];

// 5. Story Settings (Backend: StorySetting)
export const STORY_SETTINGS = [
  { value: "BEIRUT", label: "بيروت (كورنيش البحر والبيوت التراثية)" },
  { value: "CAIRO", label: "القاهرة (نهر النيل والأهرامات في الأفق)" },
  { value: "RIYADH", label: "الرياض (أبراج حديثة وبيوت دافئة)" },
  { value: "DUBAI", label: "دبي (أبراج زجاجية والخور والشواطئ)" },
  { value: "AMMAN", label: "عمّان (البيوت الحجرية والتلال)" },
  { value: "GENERIC_CITY", label: "مدينة عربية دافئة وملونة" },
  { value: "COUNTRYSIDE", label: "ريف أخضر وأشجار زيتون وتلال" },
];

// 6. Story Time of Day (Backend: StoryTime)
export const STORY_TIMES = [
  { value: "MORNING", label: "الصباح الباكر ونور الفجر" },
  { value: "DAYTIME", label: "وضح النهار والشمس المشرقة" },
  { value: "AFTERNOON", label: "وقت العصر والظلال الذهبية" },
  { value: "SUNSET", label: "وقت الغروب والشفق الدافئ" },
  { value: "BEDTIME", label: "وقت النوم والليل الهادئ والنجوم" },
];

// 7. Art Style (Backend: ArtStyle)
export const ART_STYLES = [
  { value: "SOFT_WATERCOLOR", label: "ألوان مائية حالمة (Soft Watercolor)" },
];

// 8. Supported Page Counts (Backend: pageCount)
export const PAGE_COUNTS = [10, 12, 15, 18, 20];

// 9. Language Variety (Backend: LanguageVariety)
export const LANGUAGE_VARIETIES = [
  { value: "MSA", label: "العربية الفصحى" },
  { value: "LEBANESE", label: "اللهجة اللبنانية" },
  { value: "EGYPTIAN", label: "اللهجة المصرية" },
  { value: "GULF", label: "اللهجة الخليجية" },
];

// 10. Tashkeel Level (Backend: TashkeelLevel)
export const TASHKEEL_LEVELS = [
  { value: "FULL", label: "تشكيل كامل لجميع الكلمات" },
  { value: "PARTIAL", label: "تشكيل جزئي لتيسير القراءة" },
  { value: "NONE", label: "بدون تشكيل" },
];

// 11. Storybook Status (Backend: StorybookStatus)
export const STORYBOOK_STATUS_CONFIG = {
  DRAFT: { label: "مسودة", color: "#0f172a", bg: "#ffffff", border: "#cbd5e1", canRead: false },
  STORY_READY: { label: "النص جاهز للاعتماد", color: "#0f172a", bg: "#ffffff", border: "#0f172a", canRead: false },
  CHARACTER_READY: { label: "مظهر البطل جاهز للاعتماد", color: "#0f172a", bg: "#ffffff", border: "#0f172a", canRead: false },
  ILLUSTRATING: { label: "جاري رسم الصفحات", color: "#0f172a", bg: "#ffffff", border: "#94a3b8", canRead: false },
  QA: { label: "مراجعة الجودة", color: "#0f172a", bg: "#ffffff", border: "#94a3b8", canRead: false },
  RENDERING: { label: "جاري تجهيز الكتاب", color: "#0f172a", bg: "#ffffff", border: "#94a3b8", canRead: false },
  READY: { label: "جاهز للقراءة", color: "#0f172a", bg: "#ffffff", border: "#0f172a", canRead: true },
  FAILED: { label: "تعذر التوليد", color: "#475569", bg: "#f1f5f9", border: "#cbd5e1", canRead: false },
  CANCELLED: { label: "ملغى", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", canRead: false },
};

export const getStoryStatusConfig = (status) => {
  return STORYBOOK_STATUS_CONFIG[status] || {
    label: status || "غير معروف",
    color: "#0f172a",
    bg: "#ffffff",
    border: "#cbd5e1",
    canRead: false,
  };
};
