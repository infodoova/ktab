import { useState, useEffect } from "react";
import { fetchAuthorRatingStats, fetchBookReviews } from "../services/authorRatingsService";

/**
 * Hook for author reviews and ratings analytics.
 */
export function useAuthorRatings(bookId) {
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      try {
        const statsData = await fetchAuthorRatingStats();
        if (active && statsData) {
          setStats(statsData);
        }

        if (bookId) {
          const revs = await fetchBookReviews(bookId);
          if (active && Array.isArray(revs)) {
            setReviews(revs);
          }
        }
      } catch (err) {
        console.error("Failed to load author ratings:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [bookId]);

  return {
    stats,
    reviews,
    loading,
  };
}

export default useAuthorRatings;
