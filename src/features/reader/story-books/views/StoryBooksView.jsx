import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/myui/layout";
import { Plus } from "lucide-react";
import { AlertToast } from "@/components/myui/AlertToast";
import { DeleteConfirmModal } from "@/components/myui/DeleteConfirmModal/DeleteConfirmModal";
import {
  StoryBooksGrid,
  StoryBookDetailsDrawer,
} from "../components";
import { useStoryBooks } from "../hooks/useStoryBooks";
import { storyBooksService } from "../services/storyBooksService";
import "./StoryBooksView.css";

/**
 * Children's Story Books View for Reader.
 * Connected to live Spring Boot API:
 * - Real storybooks listing
 * - Dedicated wizard route for creating a new personalized story (/reader/story-books/new)
 * - 1:1 story cards grid with real status badges and live covers
 * - Real PDF download via presigned URLs
 * - Side DetailsDrawer for reviewing generation, approving story/character, or resuming
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
    isFiltered,
    fetchStories,

    // Details Drawer & Actions
    selectedStoryForPreview,
    handleCardClick,
    handleClosePreview,
    handleCancelStory,
  } = useStoryBooks();

  const [storyToDelete, setStoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!storyToDelete) return;
    setDeleting(true);
    const ok = await handleCancelStory(storyToDelete);
    setDeleting(false);
    if (ok) setStoryToDelete(null);
  };

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

  const handleCardPress = (story) => {
    if (story?.status === "READY") {
      handleStartReading(story);
    } else {
      handleCardClick(story);
    }
  };

  const handlePreviewStory = (story) => {
    if (story?.status === "READY") {
      handleStartReading(story);
    } else {
      handleCardClick(story);
    }
  };

  const handleOpenDetails = (story) => {
    handleCardClick(story);
  };

  const handleConvertToPdf = async (story) => {
    if (!story?.id) return;
    try {
      AlertToast(`جاري جلب رابط تحميل نسخة الـ PDF لقصة «${story.title}»...`, "INFO");
      const res = await storyBooksService.getStoryBookDownloadUrl(story.id);
      if (res?.success && res.url) {
        window.open(res.url, "_blank");
        AlertToast("تم تجهيز رابط التحميل بنجاح", "SUCCESS");
      } else {
        AlertToast("ملف الـ PDF غير متوفر بعد", "WARNING");
      }
    } catch {
      AlertToast("تعذر تحميل ملف الـ PDF حالياً", "ERROR");
    }
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
        {/* 1:1 Children Stories Grid */}
        <StoryBooksGrid
          stories={stories}
          loading={loading}
          isFiltered={isFiltered}
          onCardClick={handleCardPress}
          onClearFilters={handleClearFilters}
          onOpenCreateModal={handleNavigateToCreate}
          onPreview={handlePreviewStory}
          onDetails={handleOpenDetails}
          onConvertToPdf={handleConvertToPdf}
          onCancel={setStoryToDelete}
        />

        {/* Story Book Details Drawer */}
        <StoryBookDetailsDrawer
          story={selectedStoryForPreview}
          isOpen={Boolean(selectedStoryForPreview)}
          onClose={handleClosePreview}
          onStartReading={handleStartReading}
          onStatusUpdated={fetchStories}
          onRequestCancel={(story) => {
            handleClosePreview();
            setStoryToDelete(story);
          }}
        />

        <DeleteConfirmModal
          isOpen={Boolean(storyToDelete)}
          onClose={() => !deleting && setStoryToDelete(null)}
          onConfirm={handleConfirmDelete}
          loading={deleting}
          requireMatch={false}
          title="حذف القصة"
          description="هل أنت متأكد من حذف قصة"
          highlightText={storyToDelete?.titleAr || storyToDelete?.title || ""}
          subDescription=" سيتم إيقاف إنشائها وإزالتها من قائمتك ولا يمكن التراجع."
          confirmLabel="نعم، احذف القصة"
          cancelLabel="تراجع"
        />
      </div>
    </AppLayout>
  );
}

export default StoryBooksView;
