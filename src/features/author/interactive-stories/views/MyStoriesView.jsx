import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import {
  StoryCardsGrid,
  StoryEditorModal,
  DeleteStoryModal,
} from "../components";
import { useMyStories } from "../hooks/useMyStories";
import { Plus } from "lucide-react";
import "./MyStoriesView.css";

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
          isFiltered={Boolean(searchQuery.trim())}
          onResetFilters={() => setSearchQuery("")}
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
      </div>
    </AppLayout>
  );
}

export default MyStoriesView;
