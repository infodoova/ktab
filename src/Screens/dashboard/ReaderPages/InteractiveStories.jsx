import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";

import Cards from "../../../components/myui/Users/ReaderPages/InteractiveComponent/cards";
import FeaturedCarousel from "../../../components/myui/Users/ReaderPages/InteractiveComponent/FeaturedCarousel";
import SkeletonLoader from "../../../components/myui/Users/ReaderPages/InteractiveComponent/skeletonloader";
import DetailsModal from "../../../components/myui/Users/ReaderPages/InteractiveComponent/detailsmodal";
import StorySearchModal from "../../../components/myui/Users/ReaderPages/InteractiveComponent/StorySearchModal";

import { getHelper } from "../../../../apis/apiHelpers";

const PAGE_SIZE = 8;

// ✅ Fake fallback data (DESIGN PURPOSE ONLY) — larger set to test pagination
const GENRES = [
  "Fantasy",
  "Adventure",
  "Drama",
  "Mystery",
  "Sci-Fi",
  "History",
];
const makeFakeStories = (count = 40) =>
  Array.from({ length: count }).map((_, idx) => {
    const id = idx + 1;
    const genre = GENRES[idx % GENRES.length];
    return {
      id,
      title: `قصة رقم ${id}`,
      genre,
      cover: `https://picsum.photos/400/300?random=${id}`,
    };
  });
const fakeStories = makeFakeStories(40);

function extractPage(res) {
  // Expected patterns in this repo: { data: { content, totalPages } } OR { data: [] } OR []
  const payload = res?.data ?? res;

  const contentCandidate =
    payload?.content ??
    payload?.results ??
    payload?.items ??
    payload?.data ??
    payload;

  const content = Array.isArray(contentCandidate) ? contentCandidate : [];

  const totalPages =
    payload?.totalPages ?? payload?.page?.totalPages ?? payload?.pages ?? null;

  return {
    content,
    totalPages: typeof totalPages === "number" ? totalPages : null,
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

  function makeFakeStoryDetails(base) {
    return {
      ...base,
      description:
        base?.description ||
        "هذه بيانات تجريبية لواجهة التفاصيل (Fallback) حتى يتم توفير API التفاصيل.",
      lens: base?.lens || "POLITICAL",
      sceneCount: base?.sceneCount ?? 7,
      constitution: base?.constitution || {
        settingTime: "زمن معاصر قريب",
        settingPlace: "مدينة عربية كبيرة تخضع للمراقبة",
        coreTheme: "السلطة في مواجهة الحقيقة",
        tone: "متوتر، واقعي، بطيء التصاعد",
        philosophy: "كل قرار له ثمن",
        mainConflict: "كشف الحقيقة مقابل السلامة الشخصية",
        forbiddenElements: "العنف المفرط، الكوميديا، السحر",
        pacing: "تصاعد تدريجي حتى المواجهة الأخيرة",
      },
    };
  }

  function normalizeDetails(res, base) {
    // expected possible shapes: {data: {...}} OR {...}
    const raw = res?.data ?? res ?? {};
    const candidate =
      raw?.story ?? raw?.item ?? raw?.result ?? raw?.data ?? raw ?? {};
    return {
      ...makeFakeStoryDetails(base),
      ...candidate,
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
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/stories/${story.id}`,
      });
      const details = normalizeDetails(res, story);
      if (reqId === detailsReqIdRef.current) setStoryDetails(details);
    } catch {
      const details = makeFakeStoryDetails(story);
      if (reqId === detailsReqIdRef.current) setStoryDetails(details);
    } finally {
      if (reqId === detailsReqIdRef.current) setDetailsLoading(false);
    }
  };

  const fetchPage = async (pageToLoad, { replace = false } = {}) => {
    try {
      if (replace) setLoading(true);
      else setLoadingMore(true);

      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/stories`, 
        paginated: true,
        page: pageToLoad,
        size: PAGE_SIZE,
      });

      const { content, totalPages } = extractPage(res);

      setStories((prev) => (replace ? content : [...prev, ...content]));
      setPage(pageToLoad);

      if (typeof totalPages === "number") {
        setHasMore(pageToLoad + 1 < totalPages);
      } else {
        // If API doesn't return totalPages, infer from size
        setHasMore(content.length === PAGE_SIZE);
      }
    } catch {
      console.warn("API failed, loading fake stories");
      // Fake data: simulate paging client-side
      const start = pageToLoad * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const chunk = fakeStories.slice(start, end);
      setStories((prev) => (replace ? chunk : [...prev, ...chunk]));
      setPage(pageToLoad);
      setHasMore(end < fakeStories.length);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(0, { replace: true });
  }, []);

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
    return filteredStories.slice(0, 5);
  }, [filteredStories]);

  const remainingStories = useMemo(() => {
    return filteredStories.slice(5);
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
      { root: null, rootMargin: "250px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page]);

  const handleSearchClick = () => setIsSearchOpen(true);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-[var(--earth-cream)] via-white to-[var(--earth-cream)]"
    >
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onSearchClick={handleSearchClick}
        />
      </div>

      <div
        className={`flex min-h-screen transition-all duration-300 md:flex-row-reverse ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1 flex flex-col w-full min-w-0">
          <PageHeader mainTitle={pageName} onSearchClick={handleSearchClick} />

          <div className="w-full max-w-full overflow-hidden px-6 py-8">
            {loading ? (
              <SkeletonLoader count={PAGE_SIZE} />
            ) : (
              <>
                {filteredStories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32">
                    <div className="text-6xl mb-4">📚</div>
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
                      />
                    )}

                    {/* Remaining Stories Grid */}
                    {remainingStories.length > 0 && (
                      <Cards stories={remainingStories} onStoryClick={openStoryDetails} />
                    )}
                  </>
                )}

                {/* Infinite scroll sentinel */}
                {hasMore && (
                  <div ref={loadMoreRef} className="py-16">
                    <div className="mx-auto h-8 w-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
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
              state: { storyId: story.id } 
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
