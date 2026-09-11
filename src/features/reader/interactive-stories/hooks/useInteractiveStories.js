import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchInteractiveStories,
  fetchInteractiveStoryDetails,
} from "../services/interactiveStoriesService";
import { AlertToast } from "@/components/myui/AlertToast";

const PAGE_SIZE = 8;

/**
 * Hook managing the interactive stories catalog, searching, filters, and details modal.
 */
export function useInteractiveStories() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Story details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyDetails, setStoryDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const detailsReqIdRef = useRef(0);

  const loadStories = useCallback(async (targetPage = 0, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetchInteractiveStories({ page: targetPage, size: PAGE_SIZE });
      const incoming = res.content || [];
      const totalPages = res.totalPages;

      setStories((prev) => (targetPage === 0 ? incoming : [...prev, ...incoming]));
      setHasMore(totalPages !== null ? targetPage + 1 < totalPages : incoming.length === PAGE_SIZE);
      setPage(targetPage);
    } catch (err) {
      console.error("Load stories error:", err);
      AlertToast("فشل في تحميل القصص التفاعلية", "ERROR");
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadStories(0, true);
  }, [loadStories]);

  const loadMoreStories = () => {
    if (!loading && !loadingMore && hasMore) {
      loadStories(page + 1, false);
    }
  };

  // Filtered stories in UI
  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stories.filter((story) => {
      const matchTitle = !q || story.title?.toLowerCase().includes(q);
      const matchGenre =
        selectedGenre === "ALL" ||
        story.genre?.toLowerCase() === selectedGenre.toLowerCase();
      return matchTitle && matchGenre;
    });
  }, [stories, searchQuery, selectedGenre]);

  // Details Modal Handlers
  const handleOpenDetails = async (story) => {
    setSelectedStory(story);
    setStoryDetails(null);
    setDetailsOpen(true);
    setDetailsLoading(true);

    const reqId = ++detailsReqIdRef.current;
    try {
      const details = await fetchInteractiveStoryDetails(story.id);
      if (reqId === detailsReqIdRef.current) {
        setStoryDetails({ ...story, ...details });
      }
    } catch (err) {
      console.error("Fetch story details error:", err);
      AlertToast("تعذر جلب تفاصيل القصة", "ERROR");
    } finally {
      if (reqId === detailsReqIdRef.current) {
        setDetailsLoading(false);
      }
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedStory(null);
    setStoryDetails(null);
    setDetailsLoading(false);
    detailsReqIdRef.current += 1;
  };

  const handleStartSession = (storyId) => {
    handleCloseDetails();
    navigate(`/reader/interactive-stories/play?storyId=${storyId}`);
  };

  const handleApplySearch = ({ query, genre }) => {
    setSearchQuery(query || "");
    setSelectedGenre(genre || "ALL");
    setIsSearchOpen(false);
  };

  return {
    stories: filteredStories,
    rawStories: stories,
    loading,
    loadingMore,
    hasMore,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    selectedGenre,
    detailsOpen,
    selectedStory,
    storyDetails,
    detailsLoading,
    loadMoreStories,
    handleOpenDetails,
    handleCloseDetails,
    handleStartSession,
    handleApplySearch,
  };
}
