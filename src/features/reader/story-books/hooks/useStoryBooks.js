import { useState, useEffect, useCallback, useMemo } from "react";
import { storyBooksService } from "../services/storyBooksService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook encapsulating state, filtering, modal lifecycles, and story generation for Children Story Books.
 */
export function useStoryBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Preview Modal
  const [selectedStoryForPreview, setSelectedStoryForPreview] = useState(null);

  // Create Story Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    heroName: "",
    ageGroup: "3-6",
    theme: "magic_forest",
    artStyle: "3d_pixar",
    category: "مغامرات وخيال",
  });

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storyBooksService.getStoryBooks({
        searchQuery,
        ageGroup: selectedAge,
        category: selectedCategory,
      });
      if (res?.success) {
        setStories(res.data);
      }
    } catch {
      AlertToast("تعذر جلب قصص الأطفال حالياً", "ERROR");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedAge, selectedCategory]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Handlers for search & filters
  const handleAgeChange = useCallback((ageId) => {
    setSelectedAge(ageId);
  }, []);

  const handleCategoryChange = useCallback((catId) => {
    setSelectedCategory(catId);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedAge("ALL");
    setSelectedCategory("ALL");
  }, []);

  // Handlers for modal
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleCardClick = useCallback((story) => {
    setSelectedStoryForPreview(story);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedStoryForPreview(null);
  }, []);

  const handleCreateFormChange = useCallback((field, value) => {
    setCreateFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCreateStorySubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!createFormData.title.trim()) {
        AlertToast("يرجى كتابة عنوان جذاب لقصة البطل الصغير", "WARNING");
        return;
      }

      setIsCreating(true);
      try {
        const res = await storyBooksService.createStoryBook(createFormData);
        if (res?.success && res.data) {
          setStories((prev) => [res.data, ...prev]);
          AlertToast("تم إنشاء وحفظ قصة الأطفال بنجاح", "SUCCESS");
          setIsCreateModalOpen(false);
          setCreateFormData({
            title: "",
            heroName: "",
            ageGroup: "3-6",
            theme: "magic_forest",
            artStyle: "3d_pixar",
            category: "مغامرات وخيال",
          });
        }
      } catch {
        AlertToast("حدث خطأ أثناء ابتكار القصة، يرجى المحاولة ثانية", "ERROR");
      } finally {
        setIsCreating(false);
      }
    },
    [createFormData]
  );

  const handleDeleteStory = useCallback((story) => {
    if (!story) return;
    setStories((prev) => prev.filter((s) => s.id !== story.id));
    if (selectedStoryForPreview?.id === story.id) {
      setSelectedStoryForPreview(null);
    }
    AlertToast(`تم حذف قصة «${story.title}» بنجاح`, "SUCCESS");
  }, [selectedStoryForPreview]);

  const isFiltered = useMemo(() => {
    return Boolean(searchQuery.trim() || selectedAge !== "ALL" || selectedCategory !== "ALL");
  }, [searchQuery, selectedAge, selectedCategory]);

  return {
    stories,
    loading,
    totalCount: stories.length,
    searchQuery,
    setSearchQuery,
    selectedAge,
    selectedCategory,
    handleAgeChange,
    handleCategoryChange,
    handleClearFilters,
    isFiltered,

    // Preview & Details
    selectedStoryForPreview,
    handleCardClick,
    handleClosePreview,
    handleDeleteStory,

    // Create modal
    isCreateModalOpen,
    isCreating,
    createFormData,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreateFormChange,
    handleCreateStorySubmit,
  };
}

export default useStoryBooks;
