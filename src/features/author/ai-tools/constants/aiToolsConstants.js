/**
 * Audience and stylistic profiles for AI book ending generation.
 */
export const AUDIENCE_OPTIONS = [
  { value: "KIDS_8_10_ADVENTURE", label: "أطفال (8-10 سنوات) - مغامرة وتشويق" },
  { value: "TEENS_13_16_MYSTERY", label: "يافعين (13-16 سنة) - غموض وإثارة" },
  { value: "YOUNG_ADULTS_FANTASY", label: "شباب (16-24 سنة) - خيال وفانتازيا" },
  { value: "GENERAL_ADULTS", label: "عام وكبار (25+ سنة) - دراما وأدب عام" },
];

export const WORD_COUNT_CONFIG = {
  MIN: 200,
  MAX: 1500,
  DEFAULT: 500,
  STEP: 50,
};

export const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
