import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { RatingsSummaryCard } from "../components/RatingsSummaryCard";
import { UserRatingsList } from "../components/UserRatingsList";
import { useAuthorRatings } from "../hooks/useAuthorRatings";
import { ErrorBoundary } from "@/components/common";

/**
 * Pure presentation view for Author Ratings & Reviews.
 */
export function AuthorRatingsView({ pageName = "التقييمات والمراجعات" }) {
  const { stats, reviews, loading } = useAuthorRatings();

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="space-y-8 max-w-5xl mx-auto" dir="rtl">
        <ErrorBoundary variant="card" title="تعذر عرض إحصائيات التقييمات">
          <RatingsSummaryCard stats={stats} loading={loading} />
        </ErrorBoundary>
        <ErrorBoundary variant="card" title="تعذر عرض قائمة المراجعات">
          <UserRatingsList reviews={reviews} loading={loading} />
        </ErrorBoundary>
      </div>
    </AppLayout>
  );
}



export default AuthorRatingsView;
