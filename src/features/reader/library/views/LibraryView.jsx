import React from "react";
import { AppLayout } from "@/components/myui/layout";
import {
  LibraryBooksGrid,
  BookSearchModal,
} from "../components";
import { useLibraryBooks } from "../hooks/useLibraryBooks";
import "./LibraryView.css";

/**
 * Pure presentation view for the Reader Library catalog.
 * Follows Eleven Reader and Apple design standards with Light Mode default.
 */
export function LibraryView({ pageName = "المكتبة" }) {
  const {
    books,
    loading,
    loadingMore,
    page,
    totalPages,
    isSearchOpen,
    searchQueryInput,
    handleSearchQueryChange,
    hasActiveFilters,
    activeFiltersCount,
    openSearchModal,
    closeSearchModal,
    handleApplyFilters,
    handleResetFilters,
    loadMore,
  } = useLibraryBooks();

  return (
    <AppLayout
      pageName={pageName}
      onFilterClick={openSearchModal}
      activeFiltersCount={activeFiltersCount}
      searchQuery={searchQueryInput}
      onSearchChange={handleSearchQueryChange}
    >
      <div className="ktab-lib-view" dir="rtl">
        {/* Books Grid with 3:4 Proportions */}
        <LibraryBooksGrid
          books={books}
          loading={loading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          onLoadMore={loadMore}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Advanced Filter Modal */}
        <BookSearchModal
          isOpen={isSearchOpen}
          onClose={closeSearchModal}
          onApply={handleApplyFilters}
        />
      </div>
    </AppLayout>
  );
}

export default LibraryView;
