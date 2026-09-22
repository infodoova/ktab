import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { useStaffList } from "../hooks/useStaffList";
import { StaffCard } from "../components/StaffCard";
import { StaffDeleteModal } from "../components/StaffDeleteModal";
import "./LibraryAdminStaffView.css";

/**
 * Library Admin Staff Management View.
 * Displays all staff members belonging to the library organization.
 */
export default function LibraryAdminStaffView() {
  const navigate = useNavigate();
  const {
    staff,
    loading,
    searchQuery,
    setSearchQuery,
    refreshList,
    staffToDelete,
    setStaffToDelete,
  } = useStaffList();

  const headerActions = (
    <button
      type="button"
      onClick={() => navigate("/library-admin/staff/create")}
      className="ktab-topbar__btn-action"
      title="إضافة موظف جديد"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">إضافة موظف جديد</span>
    </button>
  );

  return (
    <AppLayout
      pageName="فريق العمل"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث باسم الموظف، البريد الإلكتروني، أو الدور..."
      headerActions={headerActions}
    >
      <div className="ktab-admin-staff-view" dir="rtl">
        {/* Content State: Loading / Empty / Grid */}
        {loading ? (
          <div className="ktab-admin-staff-skeleton-grid">
            <div className="ktab-admin-staff-skeleton-card" />
            <div className="ktab-admin-staff-skeleton-card" />
            <div className="ktab-admin-staff-skeleton-card" />
          </div>
        ) : staff.length === 0 ? (
          <div className="ktab-admin-staff-empty">
            <div className="ktab-admin-staff-empty-icon">
              <Users size={28} strokeWidth={1.8} />
            </div>
            <h3 className="ktab-admin-staff-empty-title">
              {searchQuery
                ? "لم يتم العثور على أي موظف مطابق"
                : "لا يوجد موظفون مسجلون في فريق العمل بعد"}
            </h3>
            <p className="ktab-admin-staff-empty-desc">
              {searchQuery
                ? "جرب البحث باسم مختلف أو بريد إلكتروني آخر."
                : "ابدأ بدعوة وتعيين أمناء المكتبة والموظفين للانضمام إلى فريق إدارة المكتبة."}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => navigate("/library-admin/staff/create")}
              >
                إضافة موظف جديد الآن
              </Button>
            )}
          </div>
        ) : (
          <div className="ktab-admin-staff-grid">
            {staff.map((member) => (
              <StaffCard
                key={member.userId || member.id || member.email}
                member={member}
                onDelete={(m) => setStaffToDelete(m)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {staffToDelete && (
          <StaffDeleteModal
            isOpen={Boolean(staffToDelete)}
            member={staffToDelete}
            onClose={() => setStaffToDelete(null)}
            onSuccess={refreshList}
          />
        )}
      </div>
    </AppLayout>
  );
}
