import { useState, useEffect, useCallback, useMemo } from "react";
import { storyBooksService } from "../services/storyBooksService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook managing live storybooks collection, search filtering, and drawer state.
 * Strictly integrated with backend endpoints under /api/v1/storybook.
 */
export function useStoryBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState("ALL");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Details and Review Drawer
  const [selectedStoryForPreview, setSelectedStoryForPreview] = useState(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storyBooksService.getStoryBooks({
        searchQuery,
        ageGroup: selectedAge,
      });
      if (res?.success) {
        setStories(res.data.filter((s) => s.status !== "CANCELLED"));
      }
    } catch {
      AlertToast("تعذر جلب قصص الأطفال حالياً", "ERROR");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedAge]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleAgeChange = useCallback((ageId) => {
    setSelectedAge(ageId);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedAge("ALL");
  }, []);

  const handleCardClick = useCallback((story) => {
    setSelectedStoryForPreview(story);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedStoryForPreview(null);
  }, []);

  const handleCancelStory = useCallback(async (story) => {
    if (!story?.id) return false;
    try {
      await storyBooksService.cancelStoryBook(story.id);
      AlertToast(`تم حذف قصة «${story.titleAr || story.title || "القصة"}»`, "INFO");
      setStories((prev) => prev.filter((s) => s.id !== story.id));
      if (selectedStoryForPreview?.id === story.id) {
        setSelectedStoryForPreview(null);
      }
      return true;
    } catch {
      AlertToast("تعذر حذف القصة حالياً", "ERROR");
      return false;
    }
  }, [selectedStoryForPreview]);

  const isFiltered = useMemo(() => {
    return Boolean(searchQuery.trim() || selectedAge !== "ALL");
  }, [searchQuery, selectedAge]);

  return {
    stories,
    loading,
    totalCount: stories.length,
    searchQuery,
    setSearchQuery,
    selectedAge,
    handleAgeChange,
    handleClearFilters,
    isFiltered,
    fetchStories,

    // Details & Actions
    selectedStoryForPreview,
    handleCardClick,
    handleClosePreview,
    handleCancelStory,
  };
}

export default useStoryBooks;
