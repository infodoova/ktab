import { create } from "zustand";
import { getHelper } from "../api/apiHelpers";
import logger from "@/lib/logger";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Global Zustand Store for caching Genres across the entire application.
 * Prevents redundant HTTP requests on every navigation to BookPublish, Library, and Dashboard.
 */
export const useGenreStore = create((set, get) => ({
  genres: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  /**
   * Fetches all genres if not already loaded in memory.
   *
   * @param {boolean} forceRefresh - If true, ignores cache and re-fetches
   * @returns {Promise<any[]>}
   */
  fetchGenres: async (forceRefresh = false) => {
    const { isLoaded, isLoading, genres } = get();

    if (isLoaded && !forceRefresh && genres.length > 0) {
      return genres;
    }

    if (isLoading) {
      return genres;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await getHelper({ url: `${API_BASE}/genres` });
      const fetchedGenres = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      set({
        genres: fetchedGenres,
        isLoading: false,
        isLoaded: true,
      });

      return fetchedGenres;
    } catch (err) {
      logger.error("Failed to fetch genres:", err);
      set({ isLoading: false, error: "فشل تحميل التصنيفات" });
      return [];
    }
  },

  /**
   * Clears the in-memory genres cache.
   */
  clearCache: () => {
    set({ genres: [], isLoaded: false, isLoading: false, error: null });
  },
}));

export default useGenreStore;
