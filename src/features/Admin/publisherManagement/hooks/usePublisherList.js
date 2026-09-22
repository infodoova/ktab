import { useState, useEffect, useCallback, useMemo } from "react";
import { publisherService } from "../services/publisherService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook to fetch, search, filter, and manage state for publisher accounts.
 */
export function usePublisherList() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [publisherToDelete, setPublisherToDelete] = useState(null);

  const fetchPublishers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await publisherService.getPublishers({
        page: 0,
        size: 50,
        search: searchQuery.trim(),
      });

      if (res && (res.success || res.status === "OK" || res.data)) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.content)
          ? res.data.content
          : [];
        setPublishers(list);
      } else {
        setPublishers([]);
      }
    } catch (err) {
      console.error("Failed to load publishers:", err);
      AlertToast("تعذر تحميل قائمة الناشرين من الخادم", "error");
      setPublishers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Debounced fetch on search query change or manual refresh trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPublishers();
    }, 250);

    return () => clearTimeout(handler);
  }, [fetchPublishers, refreshTrigger]);

  const refreshList = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Filtered publishers based on local status and query fallback
  const filteredPublishers = useMemo(() => {
    let list = publishers;

    if (statusFilter !== "ALL") {
      list = list.filter((pub) => {
        const s = String(pub.active ?? pub.status ?? "").toUpperCase();
        const isActive = s === "ACTIVE" || s === "1" || s === "TRUE";
        return statusFilter === "ACTIVE" ? isActive : !isActive;
      });
    }

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase().trim();

    return list.filter((pub) => {
      const fullName = (pub.fullName || `${pub.firstName || ""} ${pub.lastName || ""}`).toLowerCase();
      const email = (pub.email || "").toLowerCase();
      const id = String(pub.id || "");
      return fullName.includes(query) || email.includes(query) || id.includes(query);
    });
  }, [publishers, searchQuery, statusFilter]);

  const activeCount = useMemo(() => {
    return publishers.filter((pub) => {
      const s = String(pub.active ?? pub.status ?? "").toUpperCase();
      return s === "ACTIVE" || s === "1" || s === "TRUE";
    }).length;
  }, [publishers]);

  const inactiveCount = useMemo(() => publishers.length - activeCount, [publishers, activeCount]);

  return {
    publishers: filteredPublishers,
    totalCount: publishers.length,
    activeCount,
    inactiveCount,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshList,
    publisherToDelete,
    setPublisherToDelete,
  };
}

export default usePublisherList;
