import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import {
  ReaderAnalytics,
  ContinueReading,
  RecommendedBooks,
  AssignedBooks,
  DashboardSkeleton,
} from "../components";
import { useReaderDashboard } from "../hooks/useReaderDashboard";
import "./ReaderDashboardView.css";

/**
 * Pure presentation view for the Reader Dashboard / Main Page.
 * Follows Eleven Reader and Apple design standards with Light Mode default.
 */
export function ReaderDashboardView({ pageName = "الصفحة الرئيسية" }) {
  const navigate = useNavigate();
  const {
    assignedBooks,
    loadingAssigned,
    recommendedBooks,
    loadingRecommended,
    continueReadingBooks,
    isLoading,
    handleRemoveAssignedBook,
  } = useReaderDashboard();

  const headerActions = (
    <button
      type="button"
      onClick={() => navigate("/reader/library")}
      className="ktab-topbar__btn-action"
      title="تصفح المكتبة"
      aria-label="تصفح المكتبة"
    >
      <BookOpen size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">تصفح المكتبة</span>
    </button>
  );

  if (isLoading) {
    return (
      <AppLayout pageName={pageName} headerActions={headerActions} showSearch={false}>
        <div className="ktab-reader-dashboard">
          <DashboardSkeleton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageName={pageName} headerActions={headerActions} showSearch={false}>
      <div className="ktab-reader-dashboard" dir="rtl">
        {/* 1. Summary Analytics Metrics */}
        <ReaderAnalytics
          assignedBooks={assignedBooks}
          continueReadingBooks={continueReadingBooks}
        />

        {/* 2. Active Reading Progress */}
        <ContinueReading books={continueReadingBooks} />

        {/* 3. Recommended Book Carousel */}
        <RecommendedBooks
          books={recommendedBooks}
          loading={loadingRecommended}
        />

        {/* 4. Reader's Library / Saved Favorites */}
        <AssignedBooks
          books={assignedBooks}
          loading={loadingAssigned}
          onRemoveBook={handleRemoveAssignedBook}
        />
      </div>
    </AppLayout>
  );
}

export default ReaderDashboardView;
