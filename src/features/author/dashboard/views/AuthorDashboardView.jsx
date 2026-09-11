import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/myui/layout";
import { AuthorStatsCards } from "../components/AuthorStatsCards";
import { AuthorBooksTable } from "../components/AuthorBooksTable";
import { AgeBarGraph } from "../components/AgeBarGraph";
import { MostReadPieChart } from "../components/MostReadPieChart";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { useAuthorDashboard } from "../hooks/useAuthorDashboard";

/**
 * Pure presentation view for the Author Dashboard / Control Board - Liquid Glass Dark Edition
 */
export function AuthorDashboardView({ pageName = "لوحة التحكم" }) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    stats,
    statsLoading,
    books,
    booksLoading,
    loadingMore,
    page,
    totalPages,
    genres,
    selectedBookId,
    setSelectedBookId,
    ageStats,
    ageLoading,
    mostReadStats,
    mostReadLoading,
    loadMoreBooks,
  } = useAuthorDashboard();

  // Auto-scroll down to the books table when searching
  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      const tableEl = document.getElementById("author-books-table");
      if (tableEl) {
        tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [searchQuery]);

  if (statsLoading && booksLoading) {
    return (
      <AppLayout pageName={pageName} isDark={true}>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageName={pageName}
      isDark={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في كتبك وقراءاتك..."
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 max-w-7xl mx-auto"
      >
        {/* Top Analytics Summary */}
        <AuthorStatsCards stats={stats} />

        {/* Dynamic Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgeBarGraph data={ageStats} loading={ageLoading} />
          <MostReadPieChart data={mostReadStats} loading={mostReadLoading} />
        </div>

        {/* Books & Performance Table (Filtered by Search, Genre, and Status) */}
        <AuthorBooksTable
          books={books}
          genres={genres}
          searchQuery={searchQuery}
          loading={booksLoading}
          loadingMore={loadingMore}
          page={page}
          totalPages={totalPages}
          selectedBookId={selectedBookId}
          onLoadMore={loadMoreBooks}
          onSelectBookForStats={setSelectedBookId}
        />
      </motion.div>
    </AppLayout>
  );
}

export default AuthorDashboardView;
