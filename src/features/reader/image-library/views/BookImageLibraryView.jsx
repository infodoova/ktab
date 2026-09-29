import React from "react";
import { AppLayout } from "@/components/myui/layout";
import {
  BookFilterTabs,
  PinterestGrid,
  ImageDetailsDrawer,
  DeleteConfirmModal,
} from "../components";
import { useBookImageLibrary } from "../hooks/useBookImageLibrary";
import "./BookImageLibraryView.css";

/**
 * Editorial Apple/Pinterest-inspired Book Image Library View.
 * Displays reader-generated book illustrations in their authentic proportional
 * aspect ratios without clutter, using the standard slide-over DetailsDrawer for details.
 */
export function BookImageLibraryView({ pageName = "معرض الصور" }) {
  const {
    booksList,
    selectedBookId,
    images,
    searchQuery,
    page,
    totalPages,
    totalElements,
    totalValidCount,
    loading,
    loadingMore,
    activeImage,
    imageToDelete,
    isDeleting,
    handleSelectBook,
    handleSearchChange,
    handleLoadMore,
    handleOpenDetails,
    handleCloseDetails,
    handleDownloadImage,
    handleShareImage,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
  } = useBookImageLibrary();

  const handleResetFilters = () => {
    handleSelectBook(null);
    handleSearchChange("");
  };

  return (
    <AppLayout
      pageName={pageName}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder="ابحث في الصور المنشأة، اسم الكتاب، أو المشهد..."
      activeFiltersCount={selectedBookId !== null ? 1 : 0}
    >
      <div className="ktab-image-library-view" dir="rtl">
        {/* Horizontal Book Chips Filter */}
        {booksList.length > 0 && (
          <BookFilterTabs
            booksList={booksList}
            selectedBookId={selectedBookId}
            onSelectBook={handleSelectBook}
            totalCount={totalValidCount}
          />
        )}

        {/* Pinterest Masonry Grid: Pure Images without Descriptions */}
        <PinterestGrid
          images={images}
          loading={loading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          onLoadMore={handleLoadMore}
          onOpenDetails={handleOpenDetails}
          onDownload={handleDownloadImage}
          onShare={handleShareImage}
          onDelete={handleRequestDelete}
          onResetFilters={handleResetFilters}
          hasActiveFilters={selectedBookId !== null || Boolean(searchQuery)}
        />

        {/* Standard Slide-Over Left Details Drawer */}
        <ImageDetailsDrawer
          image={activeImage}
          isOpen={Boolean(activeImage)}
          onClose={handleCloseDetails}
          onDownload={handleDownloadImage}
          onShare={handleShareImage}
          onDelete={handleRequestDelete}
        />

        {/* Image Deletion Confirmation Dialog */}
        <DeleteConfirmModal
          image={imageToDelete}
          isOpen={Boolean(imageToDelete)}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </AppLayout>
  );
}

export default BookImageLibraryView;
