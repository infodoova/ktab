import { useState, useEffect, useCallback, useMemo } from "react";
import { libraryService } from "../services/libraryService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook to fetch, search, filter, and handle modal states for libraries.
 */
export function useLibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states for delete, update, and details slide-over
  const [libraryToDelete, setLibraryToDelete] = useState(null);
  const [libraryToEdit, setLibraryToEdit] = useState(null);
  const [selectedLibraryForDetails, setSelectedLibraryForDetails] = useState(null);

  const fetchLibraries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryService.getLibraries();
      if (res && (res.success || res.status === "OK" || res.data)) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.content)
          ? res.data.content
          : [];
        setLibraries(list);
      } else {
        setLibraries([]);
      }
    } catch (err) {
      console.error("Failed to load libraries:", err);
      AlertToast("تعذر تحميل قائمة المكتبات من الخادم", "error");
      setLibraries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries, refreshTrigger]);

  const refreshList = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Filtered libraries based on search query and status filter
  const filteredLibraries = useMemo(() => {
    let list = libraries;

    // Status filter: normalize various backend formats to compare
    if (statusFilter !== "ALL") {
      list = list.filter((lib) => {
        const s = String(lib.status ?? "").toUpperCase();
        const isActive = s === "ACTIVE" || s === "1" || s === "TRUE";
        return statusFilter === "ACTIVE" ? isActive : !isActive;
      });
    }

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase().trim();
    return list.filter((lib) => {
      const name = lib.name?.toLowerCase() || "";
      const city = lib.city?.toLowerCase() || "";
      const country = lib.country?.toLowerCase() || "";
      const adminName = lib.admin?.fullName?.toLowerCase() || "";
      const adminEmail = lib.admin?.email?.toLowerCase() || "";
      return (
        name.includes(query) ||
        city.includes(query) ||
        country.includes(query) ||
        adminName.includes(query) ||
        adminEmail.includes(query)
      );
    });
  }, [libraries, searchQuery, statusFilter]);

  // Pre-computed counts per status tab (based on full list, unaffected by search)
  const activeCount   = useMemo(() => libraries.filter((lib) => { const s = String(lib.status ?? "").toUpperCase(); return s === "ACTIVE" || s === "1" || s === "TRUE"; }).length, [libraries]);
  const inactiveCount = useMemo(() => libraries.length - activeCount, [libraries, activeCount]);

  return {
    libraries: filteredLibraries,
    totalCount: libraries.length,
    activeCount,
    inactiveCount,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshList,
    libraryToDelete,
    setLibraryToDelete,
    libraryToEdit,
    setLibraryToEdit,
    selectedLibraryForDetails,
    setSelectedLibraryForDetails,
  };
}

export default useLibraryList;
