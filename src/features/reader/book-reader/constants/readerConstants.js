/**
 * Reader Constants: Voices, Ambient Sound Effects, and Background Themes.
 */

/**
 * Developer Debug Flag: Controls whether right-click (context menu) is permitted.
 * Set to `true` to keep right-click enabled for debugging and DOM inspection.
 * Set to `false` when ready to re-lock right-click in production.
 */
export const ALLOW_RIGHT_CLICK = true;

export const VOICES_LIST = [
  {
    id: "aCChyB4P5WEomwRsOKRh",
    label: "سلمى",
    gender: "female",
    desc: "صوت تعبيري شاب ومتمكن من اللغة العربية.",
    isFree: true,
  },
  {
    id: "s83SAGdFTflAwJcAV81K",
    label: "أديب",
    gender: "male",
    desc: "صوت سردي متقن ومثالي للأدب والرواية.",
    isFree: true,
  },
  {
    id: "IES4nrmZdUBHByLBde0P",
    label: "هيثم",
    gender: "male",
    desc: "صوت دافئ ونشيط، مثالي للسرد القصصي والمحادثات.",
  },

  {
    id: "rFDdsCQRZCUL8cPOWtnP",
    label: "غيداء",
    gender: "female",
    desc: "صوت سوري دافئ، مثالي للروايات والوثائقيات.",
  },
  {
    id: "u0TsaWvt0v8migutHM3M",
    label: "غزلان",
    gender: "female",
    desc: "صوت هادئ ومتوازن للمحتوى المعرفي والبودكاست.",
  },
  {
    id: "mRdG9GYEjJmIzqbYTidv",
    label: "سنا",
    gender: "female",
    desc: "نغمة مرحة ومباشرة للكتب الصوتية.",
  },
  {
    id: "R6nda3uM038xEEKi7GFl",
    label: "أنس",
    gender: "male",
    desc: "صوت هادئ ومهني للأعمال الصوتية المتنوعة.",
  },
  {
    id: "ocqVw6LVSdCxCra4XhMH",
    label: "عبدالله",
    gender: "male",
    desc: "صوت مصري مهني ودافئ للإلقاء.",
  },

  {
    id: "5Spsi3mCH9e7futpnGE5",
    label: "فارس",
    gender: "male",
    desc: "صوت خليجي متوازن ورصين.",
  },
];

export const AMBIENT_EFFECTS = [
  { id: "none", label: "بدون مؤثرات", desc: "قراءة صامتة هادئة" },
  { id: "rain", label: "صوت المطر", desc: "قطرات مطر دافئة على النافذة" },
  { id: "wind", label: "صوت الرياح", desc: "نسيم رقيق في الخلفية" },
  { id: "nature", label: "صوت الطبيعة", desc: "أصوات عصافير وأوراق شجر" },
];

export const THEMES_LIST = [
  {
    id: "pure-white",
    name: "أبيض نقي",
    bgPreview: "#ffffff",
    textPreview: "#0f172a",
    borderPreview: "#e2e8f0",
  },
  {
    id: "warm-cream",
    name: "كريمي دافئ",
    bgPreview: "#fbf7ee",
    textPreview: "#2c2824",
    borderPreview: "#e5dec9",
  },
  {
    id: "paper-sepia",
    name: "ورق عتيق",
    bgPreview: "#f4ecd8",
    textPreview: "#3d3224",
    borderPreview: "#dcd1b5",
  },
  {
    id: "charcoal-dark",
    name: "ليلي داكن",
    bgPreview: "#12151c",
    textPreview: "#f1f5f9",
    borderPreview: "#2a2f3d",
  },
];

export const TRANSITION_MODES = [
  {
    id: "curl",
    title: "ورق واقعي",
    shortTitle: "ورق واقعي",
    desc: "محاكاة واقعية ثلاثية الأبعاد لثني وتقليب الورق باللمس.",
  },
  {
    id: "flip3d",
    title: "تقليب رأسي",
    shortTitle: "تقليب رأسي",
    desc: "انتقال رأسي ثلاثي الأبعاد للأعلى والأسفل بحركة انسيابية متصلة.",
  },
  {
    id: "slide",
    title: "انزلاق أفقي",
    shortTitle: "انزلاق أفقي",
    desc: "حركة أفقية هادئة وسلسة مريحة للعين كأجهزة القراءة الإلكترونية.",
  },
];

