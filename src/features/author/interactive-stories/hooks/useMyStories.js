import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchMyStories, deleteStory } from "../services/authorStoriesService";
import { AlertToast } from "@/components/myui/AlertToast";
import { useEnumStore } from "@/core/store";
import { INTERACTIVE_STORIES_GENRE_OPTIONS } from "../constants/interactiveStoriesConstants";

/**
 * Hook for managing author's interactive stories list.
 */
export function useMyStories() {
  const { storyGenres, fetchStoryEnums } = useEnumStore();

  useEffect(() => {
    fetchStoryEnums();
  }, [fetchStoryEnums]);

  const genreOptions = useMemo(() => {
    if (storyGenres && storyGenres.length > 0) {
      return [
        { value: "ALL", label: "جميع التصنيفات" },
        ...storyGenres.map((g) => ({
          value: g.key,
          label: g.labelAr,
        })),
      ];
    }
    return INTERACTIVE_STORIES_GENRE_OPTIONS;
  }, [storyGenres]);

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStory, setSelectedStory] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const activeFiltersCount = (selectedGenre !== "ALL" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".story-menu-area")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const loadStories = useCallback(async (targetPage = 0, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetchMyStories({ page: targetPage, size: 8 });
      const incoming = Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res?.data?.content)
        ? res.data.content
        : [];

      const total = typeof res?.totalPages === "number"
        ? res.totalPages
        : typeof res?.data?.totalPages === "number"
        ? res.data.totalPages
        : 1;

      const incomingTotalElements = typeof res?.totalElements === "number"
        ? res.totalElements
        : typeof res?.data?.totalElements === "number"
        ? res.data.totalElements
        : incoming.length;

      if (res?.messageStatus === "SUCCESS" || incoming.length > 0 || res?.totalPages !== undefined || res?.content !== undefined) {
        setStories((prev) => (targetPage === 0 ? incoming : [...prev, ...incoming]));
        setTotalPages(total);
        setTotalElements(incomingTotalElements);
        setPage(targetPage);
      } else if (res?.message) {
        AlertToast(res.message, "ERROR");
      }
    } catch (err) {
      console.error("Failed to fetch author stories:", err);
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadStories(0, true);
  }, [loadStories]);

  const loadMore = () => {
    if (!loading && !loadingMore && page + 1 < totalPages) {
      loadStories(page + 1, false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!storyToDelete) return;

    try {
      const res = await deleteStory(storyToDelete.id);
      if (res?.messageStatus === "SUCCESS" || res?.status === 200) {
        AlertToast("تم حذف القصة بنجاح", "SUCCESS");
        setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id));
        setTotalElements((prev) => Math.max(0, prev - 1));
      } else {
        AlertToast(res?.message || "فشل حذف القصة", "ERROR");
      }
    } catch (err) {
      console.error("Delete story error:", err);
      AlertToast("حدث خطأ أثناء حذف القصة", "ERROR");
    } finally {
      setStoryToDelete(null);
    }
  };

  const filteredStories = stories
    .filter((story) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (story.title || "").toLowerCase();
      const genre = (story.genre || story.visualStyle || "").toLowerCase();
      return title.includes(q) || genre.includes(q);
    })
    .filter((story) => {
      if (selectedGenre === "ALL") return true;
      const storyGenre = (story.genre || "").trim().toLowerCase();
      const filterVal = selectedGenre.trim().toLowerCase();
      if (!storyGenre) return false;

      // Exact match or substring inclusion
      if (storyGenre === filterVal || storyGenre.includes(filterVal) || filterVal.includes(storyGenre)) {
        return true;
      }

      // Normalized match without underscores (e.g. "scifi" vs "sci_fi")
      const normStory = storyGenre.replace(/_/g, "");
      const normFilter = filterVal.replace(/_/g, "");
      if (normStory === normFilter || normStory.includes(normFilter) || normFilter.includes(normStory)) {
        return true;
      }

      // Match against backend enum labels (Arabic or English)
      const genreObj = storyGenres?.find(
        (g) => g.key?.toLowerCase() === filterVal || g.key?.replace(/_/g, "").toLowerCase() === normFilter
      );
      if (genreObj) {
        if (genreObj.labelAr && storyGenre.includes(genreObj.labelAr.toLowerCase())) return true;
        if (genreObj.labelEn && storyGenre.includes(genreObj.labelEn.toLowerCase())) return true;
      }

      return false;
    })
    .sort((a, b) => {
      if (sortBy === "scenes") {
        const scenesA = a.maxScenes ?? a.sceneCount ?? 0;
        const scenesB = b.maxScenes ?? b.sceneCount ?? 0;
        return scenesB - scenesA;
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      const idA = a.id ?? a.storyId ?? 0;
      const idB = b.id ?? b.storyId ?? 0;
      return idB - idA;
    });

  return {
    stories: filteredStories,
    rawStories: stories,
    loading,
    loadingMore,
    page,
    totalPages,
    totalElements,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genreOptions,
    sortBy,
    setSortBy,
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    activeFiltersCount,
    selectedStory,
    setSelectedStory,
    storyToDelete,
    setStoryToDelete,
    openMenuId,
    setOpenMenuId,
    loadMore,
    handleConfirmDelete,
  };
}

export default useMyStories;
