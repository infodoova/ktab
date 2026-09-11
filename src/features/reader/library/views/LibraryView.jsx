import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { SortBar } from "../components/SortBar";
import { BooksGrid } from "../components/BooksCard";
import { BookSearchModal } from "../components/BookSearchModal";
import { useLibraryBooks } from "../hooks/useLibraryBooks";

/**
 * Pure presentation view for the Reader Library page.
 */
export function LibraryView({ pageName = "المكتبة" }) {
  const {
    books,
    loading,
    loadingMore,
    page,
    totalPages,
    isSearchOpen,
    sortOptions,
    openSearchModal,
    closeSearchModal,
    handleApplyFilters,
    handleSortChange,
    loadMore,
  } = useLibraryBooks();

  return (
    <AppLayout pageName={pageName} onSearchClick={openSearchModal}>
      <div className="flex flex-col w-full -mx-4 md:-mx-8">
        <SortBar
          sortField={sortOptions.field}
          ascending={sortOptions.ascending}
          onSortChange={handleSortChange}
        />

        <BooksGrid
          books={books}
          loading={loading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          onLoadMore={loadMore}
        />

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
