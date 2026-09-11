import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { StoryCardsGrid } from "../components/StoryCardsGrid";
import { StoryEditorModal } from "../components/StoryEditorModal";
import { DeleteStoryModal } from "../components/DeleteStoryModal";
import { useMyStories } from "../hooks/useMyStories";
import { Plus, Search } from "lucide-react";

/**
 * Pure presentation view for Author's Interactive Stories list.
 */
export function MyStoriesView({ pageName = "قصصي التفاعلية" }) {
  const navigate = useNavigate();
  const {
    stories,
    loading,
    loadingMore,
    page,
    totalPages,
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
      onClick={() => navigate("/author/interactive-story")}
      className="btn-premium px-5 py-2.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
    >
      <Plus size={16} />
      <span>قصة جديدة</span>
    </button>
  );

  return (
    <AppLayout pageName={pageName} showSearch={false} headerActions={headerActions}>
      <div className="space-y-8" dir="rtl">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في قصصك التفاعلية..."
            className="w-full bg-white border border-black/5 rounded-2xl pr-11 pl-4 py-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#5de3ba] transition-colors shadow-sm"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
        />

        {/* Details Drawer */}
        <StoryEditorModal
          isOpen={Boolean(selectedStory)}
          onClose={() => setSelectedStory(null)}
          story={selectedStory}
        />

        {/* Delete Confirmation */}
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
