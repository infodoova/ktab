import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LibraryBig } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { useLibraryList } from "../hooks/useLibraryList";
import { LibraryCard } from "../components/LibraryCard";
import { LibraryDeleteModal } from "../components/LibraryDeleteModal";
import { LibraryDetailsDrawer } from "../components/LibraryDetailsDrawer";
import "./AdminLibraryView.css";

/**
 * Admin Library Management View (Full CRUD).
 * Uses AppLayout standard global search and topbar action button (like author and reader features).
 * Clicking any library card opens the full details slide-over popup on the left side.
 */
export default function AdminLibraryView() {
  const navigate = useNavigate();
  const {
    libraries,
    totalCount,
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
    selectedLibraryForDetails,
    setSelectedLibraryForDetails,
  } = useLibraryList();

  const handleEditLibrary = (library) => {
    navigate("/admin/library/create", {
      state: {
        library,
        from: {
          parentLabel: "إدارة المكتبات",
          parentPath: "/admin/library",
        },
      },
    });
  };

  const headerActions = (
    <button
      type="button"
      onClick={() =>
        navigate("/admin/library/create", {
          state: {
            from: {
              parentLabel: "إدارة المكتبات",
              parentPath: "/admin/library",
            },
          },
        })
      }
      className="ktab-topbar__btn-action"
      title="إضافة مكتبة جديدة"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">إضافة مكتبة جديدة</span>
    </button>
  );

  const filterOptions = [
    { key: "ALL",      label: "الكل",      count: totalCount },
    { key: "ACTIVE",   label: "نشطة",     count: activeCount },
    { key: "INACTIVE", label: "غير نشطة",  count: inactiveCount },
  ];

  return (
    <AppLayout
      pageName="إدارة المكتبات"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث عن مكتبة، مدينة، أو مشرف..."
      headerActions={headerActions}
    >
      <div className="ktab-admin-lib-view" dir="rtl">
        {/* Dynamic Island Status Filter */}
        <div className="ktab-lib-controls">
          <div className="ktab-lib-island-wrap">
            <div className="ktab-lib-island" role="tablist" aria-label="تصفية حسب الحالة">
              {filterOptions.map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === key}
                  className={`ktab-lib-island__tab${
                    statusFilter === key ? " ktab-lib-island__tab--active" : ""
                  }`}
                  onClick={() => setStatusFilter(key)}
                >
                  <span className="ktab-lib-island__tab-label">{label}</span>
                  <span className="ktab-lib-island__tab-count">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content State: Loading / Empty / Cards Grid */}
        {loading ? (
          <div className="ktab-admin-lib-skeleton-grid">
            <div className="ktab-admin-lib-skeleton-card" />
            <div className="ktab-admin-lib-skeleton-card" />
            <div className="ktab-admin-lib-skeleton-card" />
          </div>
        ) : libraries.length === 0 ? (
          <div className="ktab-admin-lib-empty">
            <div className="ktab-admin-lib-empty-icon">
              <LibraryBig size={28} strokeWidth={1.8} />
            </div>
            <h3 className="ktab-admin-lib-empty-title">
              {searchQuery
                ? "لم يتم العثور على أي مكتبة مطابقة"
                : statusFilter === "active"
                ? "لا توجد أي مكتبات نشطة حالياً"
                : statusFilter === "inactive"
                ? "لا توجد أي مكتبات غير نشطة حالياً"
                : "لا توجد أي مكتبات مسجلة بعد"}
            </h3>
            <p className="ktab-admin-lib-empty-desc">
              {searchQuery
                ? "جرب البحث بكلمات مختلفة أو اسم مدينة أو اسم المشرف المسؤول."
                : statusFilter !== "all"
                ? "يمكنك الانتقال إلى تبويب 'الكل' لعرض كافة المكتبات المسجلة."
                : "ابدأ بإضافة أول مكتبة شريكة في المنصة وتعيين مشرف مسؤول عنها الآن."}
            </p>
            {!searchQuery && statusFilter === "all" ? (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => navigate("/admin/library/create")}
              >
                إضافة مكتبة جديدة الآن
              </Button>
            ) : statusFilter !== "all" ? (
              <Button
                variant="secondary"
                onClick={() => setStatusFilter("all")}
              >
                عرض كل المكتبات
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="ktab-admin-lib-grid">
            {libraries.map((library) => (
              <LibraryCard
                key={library.id}
                library={library}
                onCardClick={(lib) => setSelectedLibraryForDetails(lib)}
                onEdit={handleEditLibrary}
                onDelete={(lib) => setLibraryToDelete(lib)}
              />
            ))}
          </div>
        )}

        {/* Details Slide-Over Drawer (Opens on left side on desktop, full on mobile) */}
        <LibraryDetailsDrawer
          isOpen={Boolean(selectedLibraryForDetails)}
          library={selectedLibraryForDetails}
          onClose={() => setSelectedLibraryForDetails(null)}
          onEdit={handleEditLibrary}
          onDelete={(lib) => setLibraryToDelete(lib)}
        />

        {/* Responsive Verification Delete Modal (BottomSheet on Mobile) */}
        {libraryToDelete && (
          <LibraryDeleteModal
            isOpen={Boolean(libraryToDelete)}
            library={libraryToDelete}
            onClose={() => setLibraryToDelete(null)}
            onSuccess={refreshList}
          />
        )}
      </div>
    </AppLayout>
  );
}
