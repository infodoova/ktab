import { getHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Service to fetch system-wide enums and specifications from the backend.
 * Matches: /api/v1/enums/*
 */

/**
 * Fetches interactive story visual styles.
 * Matches: GET /api/v1/enums/visual-styles
 * @returns {Promise<any>}
 */
export async function fetchVisualStyles() {
  return getHelper({
    url: `${API_BASE}/enums/visual-styles`,
  });
}

/**
 * Fetches file and image upload specifications.
 * Matches: GET /api/v1/enums/upload-specs
 * @returns {Promise<any>}
 */
export async function fetchUploadSpecs() {
  return getHelper({
    url: `${API_BASE}/enums/upload-specs`,
  });
}

/**
 * Fetches interactive story lenses.
 * Matches: GET /api/v1/enums/story-lenses
 * @returns {Promise<any>}
 */
export async function fetchStoryLenses() {
  return getHelper({
    url: `${API_BASE}/enums/story-lenses`,
  });
}

/**
 * Fetches interactive story genres.
 * Matches: GET /api/v1/enums/story-genres
 * @returns {Promise<any>}
 */
export async function fetchStoryGenres() {
  return getHelper({
    url: `${API_BASE}/enums/story-genres`,
  });
}

/**
 * Fetches user and registration roles.
 * Matches: GET /api/v1/enums/roles
 * @returns {Promise<any>}
 */
export async function fetchRoles() {
  return getHelper({
    url: `${API_BASE}/enums/roles`,
  });
}

/**
 * Fetches supported languages.
 * Matches: GET /api/v1/enums/languages
 * @returns {Promise<any>}
 */
export async function fetchLanguages() {
  return getHelper({
    url: `${API_BASE}/enums/languages`,
  });
}

/**
 * Fetches AI book ending target audience profiles.
 * Matches: GET /api/v1/enums/ai-audience-profiles
 * @returns {Promise<any>}
 */
export async function fetchAiAudienceProfiles() {
  return getHelper({
    url: `${API_BASE}/enums/ai-audience-profiles`,
  });
}

/**
 * Fetches book reader age categories.
 * Matches: GET /api/v1/enums/ages
 * @returns {Promise<any>}
 */
export async function fetchAgeCategories() {
  return getHelper({
    url: `${API_BASE}/enums/ages`,
  });
}
