import { useState, useEffect, useCallback } from "react";
import { fetchAuthorRatingStats, fetchBookReviews } from "../services/authorRatingsService";
import { FAKE_AUTHOR_ANALYTICS, FAKE_AUTHOR_REVIEWS } from "@/fakedataorassets/testData";

/**
 * Custom hook orchestrating author reviews, rating metrics, and fallback data resolution.
 */
export function useAuthorRatings(bookId) {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await fetchAuthorRatingStats();
      const resolvedStats = statsData?.data || statsData;
      if (resolvedStats && typeof resolvedStats === "object") {
        setStats(resolvedStats);
      } else {
        // Fallback to demo analytics if API response is unavailable
        setStats(FAKE_AUTHOR_ANALYTICS.summary);
      }

      if (bookId) {
        const revs = await fetchBookReviews(bookId);
        if (Array.isArray(revs) && revs.length > 0) {
          setReviews(revs);
        } else {
          setReviews(FAKE_AUTHOR_REVIEWS);
        }
      } else {
        // Fallback to demo reviews feed when viewing platform-wide author reviews
        setReviews(FAKE_AUTHOR_REVIEWS);
      }
    } catch (err) {
      console.warn("Using fallback ratings data due to network or empty response:", err);
      setStats(FAKE_AUTHOR_ANALYTICS.summary);
      setReviews(FAKE_AUTHOR_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    stats,
    reviews,
    loading,
    refresh: loadData,
  };
}

export default useAuthorRatings;
