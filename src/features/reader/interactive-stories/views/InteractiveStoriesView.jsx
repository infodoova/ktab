import React from "react";
import { X, Sparkles, Layers } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import {
  StoryCard,
  StoryDetailsModal,
  StoryFilterModal,
  StoriesSkeleton,
} from "../components";
import { useInteractiveStories } from "../hooks/useInteractiveStories";
import "./InteractiveStoriesView.css";

/**
 * Editorial Apple Books-inspired presentation view for Interactive Stories.
 * Strictly Light Mode with standard CSS, top-bar search & filters, and pure declarative JSX.
 */
export function InteractiveStoriesView({ pageName = "قصص تفاعلية" }) {
  const {
    stories,
    rawStoriesCount,
    isFilteringActive,
    loading,
    loadingMore,
    hasMore,
    isFilterModalOpen,
    openFilterModal,
    closeFilterModal,
    activeFiltersCount,
    searchQuery,
    selectedGenre,
    selectedLens,
    setSearchQuery,
    handleApplyFilters,
    handleResetFilters,
    handleClearGenre,
    handleClearLens,
    detailsOpen,
    selectedStory,
    storyDetails,
    detailsLoading,
    loadMoreStories,
    handleOpenDetails,
    handleCloseDetails,
    handleStartSession,
  } = useInteractiveStories();

  return (
    <AppLayout
      pageName={pageName}
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث عن قصة تفاعلية، مؤلف، أو موضوع..."
      onFilterClick={openFilterModal}
      activeFiltersCount={activeFiltersCount}
      isDark={false}
    >
      <div className="ktab-stories-view" dir="rtl">
        <div className="ktab-stories-view__container">
          {/* Active Filters Bar */}
          {isFilteringActive && (
            <div className="ktab-stories-view__active-chips" role="region" aria-label="الفلاتر المطبقة">
              {selectedGenre !== "ALL" && (
                <button
                  type="button"
                  onClick={handleClearGenre}
                  className="ktab-stories-view__active-chip"
                  title="إزالة فلتر التصنيف"
                >
                  <Sparkles size={12} strokeWidth={2.2} />
                  <span>التصنيف: {selectedGenre}</span>
                  <X size={13} strokeWidth={2.4} />
                </button>
              )}

              {selectedLens !== "ALL" && (
                <button
                  type="button"
                  onClick={handleClearLens}
                  className="ktab-stories-view__active-chip"
                  title="إزالة فلتر المنظور"
                >
                  <Layers size={12} strokeWidth={2.2} />
                  <span>منظور: {selectedLens}</span>
                  <X size={13} strokeWidth={2.4} />
                </button>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="ktab-stories-view__clear-all-btn"
              >
                مسح الكل
              </button>
            </div>
          )}

          {/* 2. Content: Loading Skeleton vs Empty State vs Grid */}
          {loading ? (
            <StoriesSkeleton count={8} />
          ) : stories.length === 0 ? (
            <div className="ktab-stories-view__empty">
              <h3 className="ktab-stories-view__empty-title">لا توجد مغامرات مطابقة</h3>
              <p className="ktab-stories-view__empty-desc">
                لم نعثر على أي قصة تفاعلية تطابق معايير التصفية والبحث الحالية.
              </p>
              {isFilteringActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ktab-stories-view__reset-btn"
                >
                  إعادة ضبط التصفية
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="ktab-stories-view__grid">
                {stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={handleOpenDetails}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="ktab-stories-view__load-more-wrap">
                  <button
                    type="button"
                    onClick={loadMoreStories}
                    disabled={loadingMore}
                    className="ktab-stories-view__load-more-btn"
                  >
                    {loadingMore ? "جاري التحميل..." : "عرض المزيد من القصص"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 3. Filter Modal (Triggered by Top Bar Filter Button) */}
        <StoryFilterModal
          isOpen={isFilterModalOpen}
          selectedGenre={selectedGenre}
          selectedLens={selectedLens}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onClose={closeFilterModal}
        />

        {/* 4. Story Details Apple Sheet Dialog */}
        <StoryDetailsModal
          isOpen={detailsOpen}
          onClose={handleCloseDetails}
          story={storyDetails || selectedStory}
          loading={detailsLoading}
          onStartSession={handleStartSession}
        />
      </div>
    </AppLayout>
  );
}

export default InteractiveStoriesView;
