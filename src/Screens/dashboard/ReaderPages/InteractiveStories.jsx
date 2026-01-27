import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";

import Cards from "../../../components/myui/Users/ReaderPages/InteractiveComponent/cards";
import FeaturedCarousel from "../../../components/myui/Users/ReaderPages/InteractiveComponent/FeaturedCarousel";
import SkeletonLoader from "../../../components/myui/Users/ReaderPages/InteractiveComponent/skeletonloader";
import DetailsModal from "../../../components/myui/Users/ReaderPages/InteractiveComponent/detailsmodal";
import StorySearchModal from "../../../components/myui/Users/ReaderPages/InteractiveComponent/StorySearchModal";
import { AlertToast } from "../../../components/myui/AlertToast";

import {
  getStories,
  getStoryDetails,
} from "../../../../apis/interactiveStoriesApi";

const PAGE_SIZE = 8;

function extractPage(res) {
  // Schema: { success: true, data: { content: [], totalPages: number } }
  const data = res?.data;
  const content = Array.isArray(data?.content) ? data.content : [];
  const totalPages =
    typeof data?.totalPages === "number" ? data.totalPages : null;

  return {
    content,
    totalPages,
  };
}

function InteractiveStories({ pageName = "قصص تفاعلية" }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("ALL");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyDetails, setStoryDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const detailsReqIdRef = useRef(0);

  function normalizeDetails(res, base) {
    // Schema: { success: true, data: { ...storyFields } }
    const data = res?.data ?? res;
    return {
      ...base,
      ...data,
    };
  }

  const openStoryDetails = async (story) => {
    if (!story) return;
    setSelectedStory(story);
    setStoryDetails(null);
    setDetailsOpen(true);
    setDetailsLoading(true);

    const reqId = ++detailsReqIdRef.current;
    try {
      const res = await getStoryDetails(story.id);
      const details = normalizeDetails(res, story);
      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }
      if (reqId === detailsReqIdRef.current) setStoryDetails(details);
    } catch (error) {
      console.error("Failed to fetch story details:", error);
      // Fallback to the story object we already have from the list
      if (reqId === detailsReqIdRef.current) setStoryDetails(story);
    } finally {
      if (reqId === detailsReqIdRef.current) setDetailsLoading(false);
    }
  };

  const fetchPage = async (pageToLoad, { replace = false } = {}) => {
    try {
      if (replace) setLoading(true);
      else setLoadingMore(true);

      const res = await getStories({
        page: pageToLoad,
        size: PAGE_SIZE,
      });
      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }
      const { content, totalPages } = extractPage(res);

      setStories((prev) => (replace ? content : [...prev, ...content]));
      setPage(pageToLoad);

      if (typeof totalPages === "number") {
        setHasMore(pageToLoad + 1 < totalPages);
      } else {
        // If API doesn't return totalPages, infer from size
        setHasMore(content.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      if (replace) setStories([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const genres = useMemo(() => {
    const set = new Set();
    (stories || []).forEach((s) => {
      if (s?.genre) set.add(s.genre);
    });
    return Array.from(set);
  }, [stories]);

  const filteredStories = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (stories || []).filter((s) => {
      const matchesGenre = genre === "ALL" ? true : s?.genre === genre;
      if (!matchesGenre) return false;
      if (!q) return true;
      const title = (s?.title || "").toString().toLowerCase();
      const g = (s?.genre || "").toString().toLowerCase();
      return title.includes(q) || g.includes(q);
    });
  }, [stories, search, genre]);

  const featuredStories = useMemo(() => {
    return filteredStories.slice(0, 3);
  }, [filteredStories]);

  const remainingStories = useMemo(() => {
    return filteredStories.slice(3);
  }, [filteredStories]);

  // When filters/search change, reset and refetch first page (keeps API pagination correct)
  useEffect(() => {
    setStories([]);
    setPage(0);
    setHasMore(true);
    fetchPage(0, { replace: true });
  }, [search, genre]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!hasMore) return;
    if (loading || loadingMore) return;

    const el = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        fetchPage(page + 1);
      },
      { root: null, rootMargin: "250px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page]);

  const handleSearchClick = () => setIsSearchOpen(true);

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a]">
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onSearchClick={handleSearchClick}
          isDark={true}
        />
      </div>

      <div
        className={`flex min-h-screen transition-all duration-300 md:flex-row-reverse ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1 flex flex-col w-full min-w-0">
          <PageHeader mainTitle={pageName} onSearchClick={handleSearchClick} isDark={true} />

          <div className="w-full max-w-full overflow-hidden">
            {loading ? (
              <div className="px-6 py-8">
                <SkeletonLoader count={PAGE_SIZE} />
              </div>
            ) : (
              <>
                {filteredStories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 px-6">
                    <p className="text-[17px] text-gray-600 font-medium">
                      لا توجد نتائج
                    </p>
                    <p className="text-[15px] text-gray-400 mt-1">
                      جرب البحث بكلمات مختلفة
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Featured Carousel - First 5 Stories */}
                    {featuredStories.length > 0 && (
                      <FeaturedCarousel
                        stories={featuredStories}
                        onStoryClick={openStoryDetails}
                        isDark={true}
                      />
                    )}

                    {/* Remaining Stories Grid */}
                    {remainingStories.length > 0 && (
                      <div className="px-6 py-12">
                        <Cards
                          stories={remainingStories}
                          onStoryClick={openStoryDetails}
                          isDark={true}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={loadMoreRef} className="py-16">
                    <div className="mx-auto h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <DetailsModal
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v);
          if (!v) {
            setDetailsLoading(false);
            setSelectedStory(null);
            setStoryDetails(null);
          }
        }}
        story={storyDetails ?? selectedStory}
        loading={detailsLoading}
        onStart={(story) => {
          if (story?.id) {
            navigate("/reader/interactive-stories/play", {
              state: { storyId: story.id, storyTitle: story.title },
            });
          }
        }}
      />

      <StorySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        genres={genres}
        onApply={(filters) => {
          setSearch(filters.query || "");
          setGenre(filters.genre || "ALL");
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}

export default InteractiveStories;
