import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { StoryCard } from "../components/StoryCard";
import { StorySkeletonLoader } from "../components/StorySkeletonLoader";
import { StoryDetailsModal } from "../components/StoryDetailsModal";
import { StorySearchModal } from "../components/StorySearchModal";
import { useInteractiveStories } from "../hooks/useInteractiveStories";

/**
 * Pure presentation view for the Interactive Stories browse page.
 */
export function InteractiveStoriesView({ pageName = "قصص تفاعلية" }) {
  const {
    stories,
    rawStories,
    loading,
    loadingMore,
    hasMore,
    isSearchOpen,
    setIsSearchOpen,
    detailsOpen,
    selectedStory,
    storyDetails,
    detailsLoading,
    loadMoreStories,
    handleOpenDetails,
    handleCloseDetails,
    handleStartSession,
    handleApplySearch,
  } = useInteractiveStories();

  return (
    <AppLayout
      pageName={pageName}
      isDark={true}
      onSearchClick={() => setIsSearchOpen(true)}
      className="p-0 max-w-full"
    >
      <div className="w-full min-h-screen bg-[#0a0a0a] text-white">
        {/* Featured Stories Hero Carousel */}
        <FeaturedCarousel
          stories={rawStories.slice(0, 5)}
          onStoryClick={handleOpenDetails}
          isDark={true}
        />

        {/* Stories Grid Section */}
        <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                جميع المغامرات التفاعلية
              </h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                اختر مسارك وحدد مصير القصة بنفسك
              </p>
            </div>
          </div>

          {loading ? (
            <StorySkeletonLoader count={8} />
          ) : stories.length === 0 ? (
            <div className="text-center py-24 text-white/40 font-bold">
              لا توجد قصص تفاعلية متطابقة مع البحث.
            </div>
          ) : (
            <>
              <StoryCard
                stories={stories}
                onStoryClick={handleOpenDetails}
                isDark={true}
              />

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-10">
                  <button
                    onClick={loadMoreStories}
                    disabled={loadingMore}
                    className="btn-premium px-12 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50"
                  >
                    {loadingMore ? "جاري التحميل..." : "عرض المزيد من القصص"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Story Details Dialog */}
        <StoryDetailsModal
          isOpen={detailsOpen}
          onClose={handleCloseDetails}
          story={storyDetails || selectedStory}
          loading={detailsLoading}
          onStartSession={handleStartSession}
        />

        {/* Search & Filter Dialog */}
        <StorySearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onApply={handleApplySearch}
        />
      </div>
    </AppLayout>
  );
}

export default InteractiveStoriesView;
