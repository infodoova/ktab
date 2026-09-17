import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { ErrorBoundary } from "@/components/common";
import {
  RatingsSummaryCard,
  UserRatingsList,
  RatingsSkeleton,
} from "../components";
import { useAuthorRatings } from "../hooks/useAuthorRatings";
import "./AuthorRatingsView.css";

/**
 * Pure presentation view for Author Ratings & Reader Reviews.
 * Orchestration and data lifecycle managed by useAuthorRatings.
 */
export function AuthorRatingsView({ pageName = "التقييمات والمراجعات" }) {
  const { stats, reviews, loading } = useAuthorRatings();

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <div className="ktab-author-ratings-view" dir="rtl">
        {loading ? (
          <RatingsSkeleton />
        ) : (
          <>
            <ErrorBoundary variant="card" title="تعذر عرض إحصائيات التقييمات">
              <RatingsSummaryCard stats={stats} />
            </ErrorBoundary>
            <ErrorBoundary variant="card" title="تعذر عرض قائمة المراجعات">
              <UserRatingsList reviews={reviews} />
            </ErrorBoundary>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default AuthorRatingsView;
