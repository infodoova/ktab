import { useState, useEffect, useCallback, useMemo } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook managing the library organization staff list, search filtering, and deletion lifecycle.
 */
export function useStaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryAdminService.getStaff();
      if (res && (res.success || res.status === "OK" || Array.isArray(res.data) || Array.isArray(res))) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : Array.isArray(res.data?.content)
          ? res.data.content
          : [];
        setStaff(list);
      } else {
        setStaff([]);
      }
    } catch (err) {
      console.error("Failed to load library staff:", err);
      AlertToast("تعذر تحميل قائمة موظفي المكتبة من الخادم", "error");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, refreshTrigger]);

  const refreshList = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const filteredStaff = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return staff;
    const q = searchQuery.trim().toLowerCase();
    return staff.filter((member) => {
      const name = (member.fullName || `${member.firstName || ""} ${member.lastName || ""}`).toLowerCase();
      const email = (member.email || "").toLowerCase();
      const role = (member.role || member.roleCode || "").toLowerCase();
      const id = String(member.userId || member.id || "");
      const orgName = (member.libraryOrganizationName || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q) || id.includes(q) || orgName.includes(q);
    });
  }, [staff, searchQuery]);

  return {
    staff: filteredStaff,
    totalCount: staff.length,
    loading,
    searchQuery,
    setSearchQuery,
    refreshList,
    staffToDelete,
    setStaffToDelete,
  };
}

export default useStaffList;
