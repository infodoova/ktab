import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { AuthorStatsCards } from "../components/AuthorStatsCards";
import { AuthorBooksTable } from "../components/AuthorBooksTable";
import { AgeBarGraph } from "../components/AgeBarGraph";
import { MostReadPieChart } from "../components/MostReadPieChart";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { useAuthorDashboard } from "../hooks/useAuthorDashboard";
import "./AuthorDashboardView.css";

/**
 * Author Dashboard View.
 * Pure declarative presentational layer rendering statistics, demographic charts, and books table.
 */
export function AuthorDashboardView({ pageName = "لوحة التحكم" }) {
  const navigate = useNavigate();
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
    isAgeDemo,
    mostReadStats,
    mostReadLoading,
    isMostReadDemo,
    searchQuery,
    setSearchQuery,
    onPageChange,
  } = useAuthorDashboard();

  const headerActions = (
    <button
      type="button"
      onClick={() => navigate("/author/new-book")}
      className="ktab-topbar__btn-action"
      title="نشر كتاب جديد"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">نشر كتاب جديد</span>
    </button>
  );

  if (statsLoading && booksLoading) {
    return (
      <AppLayout pageName={pageName} headerActions={headerActions}>
        <div className="ktab-author-dashboard">
          <DashboardSkeleton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageName={pageName}
      headerActions={headerActions}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في كتبك وقراءاتك..."
    >
      <div className="ktab-author-dashboard" dir="rtl">
        {/* Top Summary Stats Cards (Authentic Live API Data) */}
        <AuthorStatsCards stats={stats} />

        {/* Reader Demographics & Popularity Charts Grid */}
        <div className="ktab-author-dashboard__charts">
          <AgeBarGraph
            data={ageStats}
            loading={ageLoading}
            isDemo={isAgeDemo}
          />
          <MostReadPieChart
            data={mostReadStats}
            loading={mostReadLoading}
            isDemo={isMostReadDemo}
          />
        </div>

        {/* Books & Performance Table */}
        <AuthorBooksTable
          books={books}
          genres={genres}
          searchQuery={searchQuery}
          loading={booksLoading}
          isPaginating={loadingMore}
          page={page}
          totalPages={totalPages}
          selectedBookId={selectedBookId}
          onPageChange={onPageChange}
          onSelectBookForStats={setSelectedBookId}
        />
      </div>
    </AppLayout>
  );
}

export default AuthorDashboardView;
