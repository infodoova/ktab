import { useState, useEffect, useCallback } from "react";
import { fetchMyStories, deleteStory } from "../services/authorStoriesService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook for managing author's interactive stories list.
 */
export function useMyStories() {
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

  const filteredStories = stories.filter((story) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (story.title || "").toLowerCase();
    const genre = (story.genre || story.visualStyle || "").toLowerCase();
    return title.includes(q) || genre.includes(q);
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
