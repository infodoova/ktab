import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import {
  StoryCardsGrid,
  StoryEditorModal,
  DeleteStoryModal,
} from "../components";
import { useMyStories } from "../hooks/useMyStories";
import { Select, BottomSheet } from "@/components/myui";
import { Plus, SlidersHorizontal, RotateCcw } from "lucide-react";
import "./MyStoriesView.css";

import { INTERACTIVE_STORIES_SORT_OPTIONS } from "../constants/interactiveStoriesConstants";

/**
 * Pure presentation view for Author's Interactive Stories list.
 * Styled with Ktab's Eleven Reader + Apple design system.
 */
export function MyStoriesView({ pageName = "قصصي التفاعلية" }) {
  const navigate = useNavigate();
  const {
    stories,
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
  } = useMyStories();

  const headerActions = (
    <button
      type="button"
      onClick={() =>
        navigate("/author/interactive-story", {
          state: {
            from: {
              parentLabel: "القصص التفاعلية",
              parentPath: "/author/my-stories",
            },
          },
        })
      }
      className="ktab-topbar__btn-action"
      title="إنشاء قصة تفاعلية جديدة"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">قصة تفاعلية جديدة</span>
    </button>
  );

  return (
    <AppLayout
      pageName={pageName}
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في قصصك التفاعلية..."
      headerActions={headerActions}
    >
      <div className="ktab-stories-page">
        {/* Section Header */}
        <div className="ktab-stories-section-header">
          <div className="ktab-stories-section-meta">
            <h2 className="ktab-stories-section-title">القصص التفاعلية</h2>
            <span className="ktab-stories-section-count">
              {totalElements} {totalElements === 1 ? "قصة" : totalElements === 2 ? "قصتان" : totalElements > 10 ? "قصة" : "قصص"}
            </span>
          </div>

          {/* Desktop Filter Dropdowns (screens >= 768px) */}
          <div className="ktab-stories-filters-left ktab-desktop-only">
            <Select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              options={genreOptions}
              placeholder="جميع التصنيفات"
              className="ktab-stories-filter-select"
              triggerClassName="ktab-stories-filter-select-trigger"
              menuClassName="ktab-stories-filter-select-menu"
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={INTERACTIVE_STORIES_SORT_OPTIONS}
              placeholder="الترتيب"
              className="ktab-stories-filter-select"
              triggerClassName="ktab-stories-filter-select-trigger"
              menuClassName="ktab-stories-filter-select-menu"
            />
          </div>

          {/* Mobile Filter Button (screens < 768px) */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="ktab-mobile-filter-btn ktab-mobile-only"
            aria-label="تصفية وترتيب القصص"
            title="تصفية وترتيب القصص"
          >
            <SlidersHorizontal size={15} />
            {activeFiltersCount > 0 && (
              <span className="ktab-mobile-filter-badge">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Stories Grid */}
        <StoryCardsGrid
          stories={stories}
          loading={loading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onStoryClick={setSelectedStory}
          onDeleteClick={setStoryToDelete}
          onLoadMore={loadMore}
          onCreateNew={() =>
            navigate("/author/interactive-story", {
              state: {
                from: {
                  parentLabel: "القصص التفاعلية",
                  parentPath: "/author/my-stories",
                },
              },
            })
          }
          searchQuery={searchQuery}
          isFiltered={selectedGenre !== "ALL"}
          onResetFilters={() => {
            setSearchQuery("");
            setSelectedGenre("ALL");
          }}
        />

        {/* Details Drawer */}
        <StoryEditorModal
          isOpen={Boolean(selectedStory)}
          onClose={() => setSelectedStory(null)}
          story={selectedStory}
        />

        {/* Delete Confirmation Modal */}
        <DeleteStoryModal
          isOpen={Boolean(storyToDelete)}
          onClose={() => setStoryToDelete(null)}
          onConfirm={handleConfirmDelete}
          storyTitle={storyToDelete?.title || ""}
        />

        {/* Mobile Filter Bottom Sheet */}
        <BottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          title="تصفية وترتيب القصص"
          className="ktab-stories-bottom-sheet"
          scrollable={false}
        >
          <div className="ktab-stories-sheet-body">
            {/* Genre Select */}
            <div className="ktab-stories-sheet-field">
              <label className="ktab-stories-sheet-label">التصنيف</label>
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                options={genreOptions}
                placeholder="جميع التصنيفات"
                className="ktab-stories-sheet-select"
                triggerClassName="ktab-stories-filter-select-trigger"
                menuClassName="ktab-stories-filter-select-menu"
              />
            </div>

            {/* Sort Select */}
            <div className="ktab-stories-sheet-field">
              <label className="ktab-stories-sheet-label">الترتيب</label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={INTERACTIVE_STORIES_SORT_OPTIONS}
                placeholder="الترتيب"
                className="ktab-stories-sheet-select"
                triggerClassName="ktab-stories-filter-select-trigger"
                menuClassName="ktab-stories-filter-select-menu"
              />
            </div>

            {/* Sheet Footer Actions */}
            <div className="ktab-stories-sheet-actions">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenre("ALL");
                    setSortBy("newest");
                  }}
                  className="ktab-stories-sheet-reset-btn"
                >
                  <RotateCcw size={13} />
                  <span>إعادة تعيين</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="ktab-stories-sheet-apply-btn"
              >
                تطبيق
              </button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </AppLayout>
  );
}

export default MyStoriesView;
