/**
 * Constants and configuration options for New Interactive Story creation.
 */

export const GENRE_PRESETS = [
  { id: "adventure", name: "مغامرة", label: "مغامرة", desc: "رحلات شيقة وتحديات غير متوقعة" },
  { id: "fantasy", name: "خيال وأساطير", label: "خيال وأساطير", desc: "عوالم سحرية ومخلوقات أسطورية" },
  { id: "mystery", name: "غموض وتحقيق", label: "غموض وتحقيق", desc: "ألغاز وأسرار تبحث عن حلول" },
  { id: "scifi", name: "خيال علمي", label: "خيال علمي", desc: "تكنولوجيا مستقبلية وفضاء شاسع" },
  { id: "horror", name: "رعب وتشويق", label: "رعب وتشويق", desc: "أجواء مرعبة وأحداث غامضة" },
  { id: "drama", name: "دراما وواقعي", label: "دراما وواقعي", desc: "قصص إنسانية وعلاقات عميقة" },
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

export const LENS_SELECT_OPTIONS = LENS_OPTIONS.map((l) => ({
  value: l.id,
  label: `${l.label} (${l.desc})`,
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
