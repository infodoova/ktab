import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { ReaderAnalytics } from "../components/ReaderAnalytics";
import { ContinueReading } from "../components/ContinueReading";
import { RecommendedBooks } from "../components/RecommendedBooks";
import { AssignedBooks } from "../components/AssignedBooks";
import { useReaderDashboard } from "../hooks/useReaderDashboard";

/**
 * Pure presentation view for the Reader Dashboard / Main Page.
 */
export function ReaderDashboardView({ pageName = "الصفحة الرئيسية" }) {
  const {
    assignedBooks,
    loadingAssigned,
    recommendedBooks,
    loadingRecommended,
    openMenuId,
    setOpenMenuId,
    continueReadingBooks,
    handleRemoveAssignedBook,
  } = useReaderDashboard();

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="space-y-10">
        <ReaderAnalytics />

        <ContinueReading books={continueReadingBooks} />

        <RecommendedBooks
          books={recommendedBooks}
          loading={loadingRecommended}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />

        <AssignedBooks
          books={assignedBooks}
          loading={loadingAssigned}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onRemoveBook={handleRemoveAssignedBook}
        />
      </div>
    </AppLayout>
  );
}

export default ReaderDashboardView;
