import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { publisherEditorialService } from "../services/publisherEditorialService";

/**
 * Custom hook for Publisher Dashboard metrics and recent review queue preview.
 */
export function usePublisherDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentQueue, setRecentQueue] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [queueRes, approvedRes, draftsRes] = await Promise.allSettled([
        publisherEditorialService.getReviewQueue({ page: 0, size: 6 }),
        publisherEditorialService.searchReviewQueue({ status: "APPROVED", page: 0, size: 1 }),
        publisherEditorialService.searchReviewQueue({ status: "DRAFT", page: 0, size: 1 }),
      ]);

      const queueData =
        queueRes.status === "fulfilled" ? queueRes.value?.data : null;
      const approvedData =
        approvedRes.status === "fulfilled" ? approvedRes.value?.data : null;
      const draftsData =
        draftsRes.status === "fulfilled" ? draftsRes.value?.data : null;

      const content = queueData?.content || [];
      setRecentQueue(content);
      setCounts({
        pending: queueData?.totalElements ?? content.length,
        approved: approvedData?.totalElements ?? 0,
        rejected: draftsData?.totalElements ?? 0,
      });
    } catch {
      setRecentQueue([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleNavigateToQueue = useCallback(() => {
    navigate("/publisher/library-management");
  }, [navigate]);

  return {
    loading,
    recentQueue,
    counts,
    handleNavigateToQueue,
    refreshDashboard: fetchDashboardData,
  };
}

export default usePublisherDashboard;
