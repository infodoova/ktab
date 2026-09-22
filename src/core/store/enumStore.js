import { create } from "zustand";
import {
  fetchVisualStyles,
  fetchUploadSpecs,
  fetchStoryLenses,
  fetchStoryGenres,
  fetchRoles,
  fetchLanguages,
  fetchAiAudienceProfiles,
  fetchAgeCategories,
} from "@/core/services/enumsService";
import logger from "@/lib/logger";

/**
 * Baseline fallback configurations if offline or pending initial network resolution.
 */
const DEFAULT_FALLBACKS = {
  uploadSpecs: {
    bookCover: {
      allowedFormats: ["JPG", "JPEG", "PNG", "WEBP"],
      aspectRatio: "1:1.6",
      targetRatio: 1.6,
      tolerance: 0.25,
      maxSizeBytes: 10485760,
      maxSizeMb: 10,
    },
    bookPdf: {
      allowedFormats: ["PDF"],
      maxSizeBytes: 104857600,
      maxSizeMb: 100,
    },
    storyCover: {
      allowedFormats: ["PNG", "JPG", "JPEG", "WEBP"],
      aspectRatio: "1:1",
      targetRatio: 1.0,
      tolerance: 0.2,
      maxSizeBytes: 5242880,
      maxSizeMb: 5,
    },
    aiPdfDraft: {
      allowedFormats: ["PDF"],
      maxSizeBytes: 20971520,
      maxSizeMb: 20,
    },
  },
  visualStyles: [
    { key: "CINEMATIC_STORYBOOK", labelAr: "سينمائي قصصي", labelEn: "Cinematic Storybook" },
    { key: "MODERN_DIGITAL_ART", labelAr: "فن رقمي عصري", labelEn: "Modern Digital Art" },
    { key: "DARK_GRAPHIC_NOVEL", labelAr: "رواية مصورة مظلمة", labelEn: "Dark Graphic Novel" },
    { key: "ANIME", labelAr: "أنمي ورسوم متحركة", labelEn: "Anime & Animation" },
    { key: "WATERCOLOR", labelAr: "ألوان مائية فنية", labelEn: "Artistic Watercolor" },
    { key: "CLASSIC_OIL_PAINTING", labelAr: "رسم زيتي كلاسيكي", labelEn: "Classic Oil Painting" },
  ],
  storyLenses: [
    { key: "POLITICAL", labelAr: "سياسي", labelEn: "Political" },
    { key: "PSYCHOLOGICAL", labelAr: "نفسي", labelEn: "Psychological" },
    { key: "SURVIVAL", labelAr: "صراع البقاء", labelEn: "Survival" },
    { key: "MORAL", labelAr: "أخلاقي", labelEn: "Moral" },
  ],
  storyGenres: [
    { key: "ADVENTURE", labelAr: "مغامرة", labelEn: "Adventure" },
    { key: "FANTASY", labelAr: "خيال", labelEn: "Fantasy" },
    { key: "MYSTERY", labelAr: "غموض", labelEn: "Mystery" },
    { key: "SCI_FI", labelAr: "خيال علمي", labelEn: "Sci-Fi" },
    { key: "HORROR", labelAr: "رعب", labelEn: "Horror" },
    { key: "DRAMA", labelAr: "دراما", labelEn: "Drama" },
  ],
  roles: [
    { role: "AUTHOR", code: "10", labelAr: "مؤلف", labelEn: "Author" },
    { role: "READER", code: "20", labelAr: "قارئ", labelEn: "Reader" },
  ],
  languages: [
    { code: "ar", labelAr: "العربية", labelEn: "Arabic" },
    { code: "en", labelAr: "الإنجليزية", labelEn: "English" },
    { code: "fr", labelAr: "الفرنسية", labelEn: "French" },
    { code: "es", labelAr: "الإسبانية", labelEn: "Spanish" },
    { code: "de", labelAr: "الألمانية", labelEn: "German" },
  ],
  aiAudienceProfiles: [
    { key: "8-10", name: "KIDS_8_10_ADVENTURE", minAge: 8, maxAge: 10, labelAr: "أطفال (8-10 سنوات) - مغامرة وتشويق", labelEn: "Kids (8-10 years) - Adventure & Suspense" },
    { key: "13-16", name: "TEENS_13_16_DYSTOPIAN", minAge: 13, maxAge: 16, labelAr: "يافعين (13-16 سنة) - غموض وإثارة", labelEn: "Teens (13-16 years) - Mystery & Thrill" },
    { key: "16-24", name: "YOUTH_16_24_FANTASY", minAge: 16, maxAge: 24, labelAr: "شباب (16-24 سنة) - خيال وفانتازيا", labelEn: "Youth (16-24 years) - Fantasy & World-building" },
    { key: "25+", name: "ADULTS_25_PLUS_DRAMA", minAge: 25, maxAge: null, labelAr: "عام وكبار (+25 سنة) - دراما وأدب عام", labelEn: "General & Adults (25+ years) - Drama & General Lit" },
  ],
  ages: [
    { key: "CHILDREN", minAge: 3, maxAge: 8, labelAr: "أطفال (3-8 سنوات)", labelEn: "Children (3-8 years)" },
    { key: "EARLY_TEENS", minAge: 9, maxAge: 15, labelAr: "ناشئة (9-15 سنة)", labelEn: "Early Teens (9-15 years)" },
    { key: "YOUTH", minAge: 16, maxAge: 24, labelAr: "شباب (16-24 سنة)", labelEn: "Youth (16-24 years)" },
    { key: "ADULTS", minAge: 25, maxAge: null, labelAr: "كبار (+25)", labelEn: "Adults (25+ years)" },
  ],
};

function extractData(res, fallback) {
  if (res?.data && (Array.isArray(res.data) || typeof res.data === "object")) {
    return res.data;
  }
  return fallback;
}

/**
 * Global Zustand Store for caching backend Enums and Upload Specifications.
 * Eliminates hardcoded select options and upload rules across Author and Reader features.
 */
export const useEnumStore = create((set, get) => ({
  uploadSpecs: DEFAULT_FALLBACKS.uploadSpecs,
  visualStyles: DEFAULT_FALLBACKS.visualStyles,
  storyLenses: DEFAULT_FALLBACKS.storyLenses,
  storyGenres: DEFAULT_FALLBACKS.storyGenres,
  roles: DEFAULT_FALLBACKS.roles,
  languages: DEFAULT_FALLBACKS.languages,
  aiAudienceProfiles: DEFAULT_FALLBACKS.aiAudienceProfiles,
  ages: DEFAULT_FALLBACKS.ages,

  loading: {
    uploadSpecs: false,
    visualStyles: false,
    storyLenses: false,
    storyGenres: false,
    roles: false,
    languages: false,
    aiAudienceProfiles: false,
    ages: false,
  },
  loaded: {
    uploadSpecs: false,
    visualStyles: false,
    storyLenses: false,
    storyGenres: false,
    roles: false,
    languages: false,
    aiAudienceProfiles: false,
    ages: false,
  },

  /**
   * Fetches file and image upload specifications (aspect ratios, limits, formats).
   */
  fetchUploadSpecs: async (force = false) => {
    const { loaded, loading, uploadSpecs } = get();
    if (loaded.uploadSpecs && !force) return uploadSpecs;
    if (loading.uploadSpecs) return uploadSpecs;

    set((state) => ({ loading: { ...state.loading, uploadSpecs: true } }));
    try {
      const res = await fetchUploadSpecs();
      const data = extractData(res, DEFAULT_FALLBACKS.uploadSpecs);
      set((state) => ({
        uploadSpecs: { ...DEFAULT_FALLBACKS.uploadSpecs, ...data },
        loaded: { ...state.loaded, uploadSpecs: true },
        loading: { ...state.loading, uploadSpecs: false },
      }));
      return data;
    } catch (err) {
      logger.warn("Could not fetch upload specs, using defaults:", err);
      set((state) => ({ loading: { ...state.loading, uploadSpecs: false } }));
      return uploadSpecs;
    }
  },

  /**
   * Fetches Interactive Story Enums (genres, lenses, visual styles).
   */
  fetchStoryEnums: async (force = false) => {
    const { loaded, fetchUploadSpecs } = get();
    fetchUploadSpecs(force);

    const promises = [];
    if (!loaded.storyGenres || force) promises.push(fetchStoryGenres());
    else promises.push(Promise.resolve(null));

    if (!loaded.storyLenses || force) promises.push(fetchStoryLenses());
    else promises.push(Promise.resolve(null));

    if (!loaded.visualStyles || force) promises.push(fetchVisualStyles());
    else promises.push(Promise.resolve(null));

    try {
      const [genresRes, lensesRes, stylesRes] = await Promise.all(promises);
      set((state) => ({
        storyGenres: genresRes ? extractData(genresRes, state.storyGenres) : state.storyGenres,
        storyLenses: lensesRes ? extractData(lensesRes, state.storyLenses) : state.storyLenses,
        visualStyles: stylesRes ? extractData(stylesRes, state.visualStyles) : state.visualStyles,
        loaded: {
          ...state.loaded,
          storyGenres: true,
          storyLenses: true,
          visualStyles: true,
        },
      }));
    } catch (err) {
      logger.warn("Could not fetch some story enums:", err);
    }
  },

  /**
   * Fetches Book Publish Enums (ages, languages, upload specifications).
   */
  fetchBookEnums: async (force = false) => {
    const { loaded, fetchUploadSpecs } = get();
    fetchUploadSpecs(force);

    const promises = [];
    if (!loaded.ages || force) promises.push(fetchAgeCategories());
    else promises.push(Promise.resolve(null));

    if (!loaded.languages || force) promises.push(fetchLanguages());
    else promises.push(Promise.resolve(null));

    try {
      const [agesRes, langRes] = await Promise.all(promises);
      set((state) => ({
        ages: agesRes ? extractData(agesRes, state.ages) : state.ages,
        languages: langRes ? extractData(langRes, state.languages) : state.languages,
        loaded: {
          ...state.loaded,
          ages: true,
          languages: true,
        },
      }));
    } catch (err) {
      logger.warn("Could not fetch book publish enums:", err);
    }
  },

  /**
   * Fetches reader book age categories.
   * Matches: GET /api/v1/enums/ages
   */
  fetchAges: async (force = false) => {
    const { loaded, ages } = get();
    if (loaded.ages && !force) return ages;

    try {
      const res = await fetchAgeCategories();
      const data = extractData(res, DEFAULT_FALLBACKS.ages);
      set((state) => ({
        ages: data,
        loaded: { ...state.loaded, ages: true },
      }));
      return data;
    } catch (err) {
      logger.warn("Could not fetch age categories:", err);
      return ages;
    }
  },

  /**
   * Fetches AI Tools Enums (audience profiles, upload specs).
   */
  fetchAiEnums: async (force = false) => {
    const { loaded, fetchUploadSpecs } = get();
    fetchUploadSpecs(force);

    if (!loaded.aiAudienceProfiles || force) {
      try {
        const res = await fetchAiAudienceProfiles();
        const data = extractData(res, DEFAULT_FALLBACKS.aiAudienceProfiles);
        set((state) => ({
          aiAudienceProfiles: data,
          loaded: { ...state.loaded, aiAudienceProfiles: true },
        }));
      } catch (err) {
        logger.warn("Could not fetch AI audience profiles:", err);
      }
    }
  },

  /**
   * Fetches all enums in parallel (e.g., on application or author module bootstrap).
   */
  fetchAllEnums: async (force = false) => {
    const { fetchStoryEnums, fetchBookEnums, fetchAiEnums } = get();
    await Promise.allSettled([
      fetchStoryEnums(force),
      fetchBookEnums(force),
      fetchAiEnums(force),
    ]);
  },
}));
