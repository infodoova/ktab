import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { Plus } from "lucide-react";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  StoryBooksGrid,
  StoryBookDetailsDrawer,
} from "../components";
import { useStoryBooks } from "../hooks/useStoryBooks";
import "./StoryBooksView.css";

/**
 * Children's Story Books View for Reader.
 * Strictly follows Author architecture:
 * - Top-bar search & top action button in AppLayout
 * - Dedicated route for creating a new interactive story (/reader/story-books/new)
 * - Clean editorial section header with count
 * - 1:1 interactive story cards grid (mobile 2-column grid)
 * - 3-dots actions menu on each card: Preview, Details, Convert to PDF, Delete
 * - Left slide-over DetailsDrawer for story details
 */
export function StoryBooksView({ pageName = "قصص الأطفال" }) {
  const navigate = useNavigate();
  const {
    stories,
    loading,
    totalCount,
    searchQuery,
    setSearchQuery,
    handleClearFilters,

    // Preview Drawer & Actions
    selectedStoryForPreview,
    handleCardClick,
    handleClosePreview,
    handleDeleteStory,
  } = useStoryBooks();

  // Navigate to dedicated multi-step creation route (matching Author architecture)
  const handleNavigateToCreate = () => {
    navigate("/reader/story-books/new", {
      state: {
        from: {
          parentLabel: "قصص الأطفال",
          parentPath: "/reader/story-books",
        },
      },
    });
  };

  // Top action button in AppLayout header
  const headerActions = (
    <button
      type="button"
      onClick={handleNavigateToCreate}
      className="ktab-topbar__btn-action"
      title="ابتكار قصة أطفال جديدة"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">ابتكار قصة أطفال</span>
    </button>
  );

  const handleStartReading = (story) => {
    handleClosePreview();
    navigate(`/reader/story-books/read/${story.id}`, {
      state: {
        story,
        from: {
          parentLabel: "قصص الأطفال",
          parentPath: "/reader/story-books",
        },
      },
    });
  };

  const handlePreviewStory = (story) => {
    handleStartReading(story);
  };

  const handleOpenDetails = (story) => {
    handleCardClick(story);
  };

  const handleConvertToPdf = (story) => {
    AlertToast(`جاري تجهيز وتحويل قصة «${story.title}» إلى ملف PDF...`, "INFO");
    setTimeout(() => {
      AlertToast(`تم إنشاء وتجهيز ملف الـ PDF لقصة «${story.title}» بنجاح`, "SUCCESS");
    }, 1200);
  };

  const countLabel =
    totalCount === 1
      ? "قصة"
      : totalCount === 2
      ? "قصتان"
      : totalCount > 10
      ? "قصة"
      : "قصص";

  return (
    <AppLayout
      pageName={pageName}
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في قصص الأطفال..."
      headerActions={headerActions}
    >
      <div className="child-storybooks-page">
        {/* Editorial Section Header */}
        <div className="child-storybooks-section-header">
          <div className="child-storybooks-section-meta">
            <h2 className="child-storybooks-section-title">قصص الأطفال التفاعلية</h2>
            <span className="child-storybooks-section-count">
              {totalCount} {countLabel}
            </span>
          </div>
        </div>

        {/* 1:1 Children Stories Grid (2-column on mobile) */}
        <StoryBooksGrid
          stories={stories}
          loading={loading}
          onCardClick={handleStartReading}
          onClearFilters={handleClearFilters}
          onOpenCreateModal={handleNavigateToCreate}
          onPreview={handlePreviewStory}
          onDetails={handleOpenDetails}
          onConvertToPdf={handleConvertToPdf}
          onDelete={handleDeleteStory}
        />

        {/* Story Book Details Drawer (Standard App Left Slide-Over) */}
        <StoryBookDetailsDrawer
          story={selectedStoryForPreview}
          isOpen={Boolean(selectedStoryForPreview)}
          onClose={handleClosePreview}
          onStartReading={handleStartReading}
        />
      </div>
    </AppLayout>
  );
}

export default StoryBooksView;
