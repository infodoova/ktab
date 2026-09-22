import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { usePublisherList } from "../hooks/usePublisherList";
import { PublisherCard } from "../components/PublisherCard";
import { PublisherDeleteModal } from "../components/PublisherDeleteModal";
import "./AdminPublisherView.css";

/**
 * Admin Publisher Management View (Full CRUD).
 * Displays paginated publisher accounts with search, dynamic island filtering, and compact cards.
 */
export default function AdminPublisherView() {
  const navigate = useNavigate();
  const {
    publishers,
    totalCount,
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
  } = usePublisherList();

  const handleEditPublisher = (publisher) => {
    navigate("/admin/publishers/create", {
      state: {
        publisher,
        from: {
          parentLabel: "إدارة الناشرين",
          parentPath: "/admin/publishers",
        },
      },
    });
  };

  const headerActions = (
    <button
      type="button"
      onClick={() =>
        navigate("/admin/publishers/create", {
          state: {
            from: {
              parentLabel: "إدارة الناشرين",
              parentPath: "/admin/publishers",
            },
          },
        })
      }
      className="ktab-topbar__btn-action"
      title="إضافة ناشر جديد"
    >
      <Plus size={15} strokeWidth={2.4} />
      <span className="ktab-topbar__btn-text">إضافة ناشر جديد</span>
    </button>
  );

  const filterOptions = [
    { key: "ALL",      label: "الكل",      count: totalCount },
    { key: "ACTIVE",   label: "نشطة",     count: activeCount },
    { key: "INACTIVE", label: "غير نشطة",  count: inactiveCount },
  ];

  return (
    <AppLayout
      pageName="إدارة الناشرين"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث باسم الناشر، البريد الإلكتروني، أو المعرف..."
      headerActions={headerActions}
    >
      <div className="ktab-admin-pub-view" dir="rtl">
        {/* Dynamic Island Status Filter */}
        <div className="ktab-pub-controls">
          <div className="ktab-pub-island-wrap">
            <div className="ktab-pub-island" role="tablist" aria-label="تصفية حسب الحالة">
              {filterOptions.map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === key}
                  className={`ktab-pub-island__tab${
                    statusFilter === key ? " ktab-pub-island__tab--active" : ""
                  }`}
                  onClick={() => setStatusFilter(key)}
                >
                  <span className="ktab-pub-island__tab-label">{label}</span>
                  <span className="ktab-pub-island__tab-count">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content State: Loading / Empty / Cards Grid */}
        {loading ? (
          <div className="ktab-admin-pub-skeleton-grid">
            <div className="ktab-admin-pub-skeleton-card" />
            <div className="ktab-admin-pub-skeleton-card" />
            <div className="ktab-admin-pub-skeleton-card" />
          </div>
        ) : publishers.length === 0 ? (
          <div className="ktab-admin-pub-empty">
            <div className="ktab-admin-pub-empty-icon">
              <Users size={28} strokeWidth={1.8} />
            </div>
            <h3 className="ktab-admin-pub-empty-title">
              {searchQuery
                ? "لم يتم العثور على أي ناشر مطابق"
                : statusFilter === "ACTIVE"
                ? "لا توجد حسابات ناشرين نشطة حالياً"
                : statusFilter === "INACTIVE"
                ? "لا توجد حسابات ناشرين غير نشطة حالياً"
                : "لا يوجد أي ناشر مسجل بعد"}
            </h3>
            <p className="ktab-admin-pub-empty-desc">
              {searchQuery
                ? "جرب البحث باسم مختلف أو بريد إلكتروني آخر."
                : statusFilter !== "ALL"
                ? "يمكنك الانتقال إلى تبويب 'الكل' لعرض كافة الناشرين المسجلين."
                : "ابدأ بتعيين وإضافة أول حساب ناشر في المنصة الآن."}
            </p>
            {!searchQuery && statusFilter === "ALL" ? (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => navigate("/admin/publishers/create")}
              >
                إضافة ناشر جديد الآن
              </Button>
            ) : statusFilter !== "ALL" ? (
              <Button
                variant="secondary"
                onClick={() => setStatusFilter("ALL")}
              >
                عرض كل الناشرين
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="ktab-admin-pub-grid">
            {publishers.map((publisher) => (
              <PublisherCard
                key={publisher.id}
                publisher={publisher}
                onEdit={handleEditPublisher}
                onDelete={(pub) => setPublisherToDelete(pub)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {publisherToDelete && (
          <PublisherDeleteModal
            isOpen={Boolean(publisherToDelete)}
            publisher={publisherToDelete}
            onClose={() => setPublisherToDelete(null)}
            onSuccess={refreshList}
          />
        )}
      </div>
    </AppLayout>
  );
}
