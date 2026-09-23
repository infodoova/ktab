import React from "react";
import { BookCopy, Search, X } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { Button } from "@/components/myui/forms/Button";
import { usePublisherReviewQueue } from "../../hooks/usePublisherReviewQueue";
import { PublisherBookCard } from "../../components/PublisherBookCard";
import { PublisherReviewDrawer } from "../../components/PublisherReviewDrawer";
import { ReviewDecisionModal } from "../../components/ReviewDecisionModal";
import "./PublisherLibraryView.css";

const STATUS_FILTERS = [
  { id: "SUBMITTED", label: "بانتظار المراجعة" },
];

/**
 * Publisher Library & Editorial Review Queue View.
 * Displays submitted books awaiting publisher review with search,
 * pending review tab, and editorial slide-over inspection drawer.
 */
export default function PublisherLibraryView() {
  const {
    books,
    loading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    totalElements,
    selectedBook,
    setSelectedBook,
    decisionModalBook,
    decisionActionType,
    handleOpenDetails,
    handleOpenApprove,
    handleOpenReject,
    handleCloseDecisionModal,
    handleDecisionSuccess,
  } = usePublisherReviewQueue();

  return (
    <AppLayout
      pageName="قائمة المراجعة والتحكيم"
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="ابحث في قائمة المراجعة بالعنوان، الكاتب، أو التصنيف..."
    >
      <div className="ktab-publisher-queue-view" dir="rtl">
        {/* Review Queue Tab & Count Header */}
        <div className="ktab-publisher-queue-filters">
          <div className="ktab-publisher-queue-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected="true"
              className="ktab-publisher-queue-tab ktab-publisher-queue-tab--active"
            >
              <span>بانتظار المراجعة</span>
            </button>
          </div>

          <div className="ktab-publisher-queue-count">
            <span>
              {loading
                ? "جاري التحديث..."
                : `${totalElements} ${totalElements === 1 ? "كتاب" : "كتب"}`}
            </span>
          </div>
        </div>

        {/* Content States: Loading / Empty / Grid */}
        {loading ? (
          <div className="ktab-publisher-queue-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ktab-publisher-queue-skeleton-item">
                <div className="ktab-publisher-queue-skeleton-cover" />
                <div className="ktab-publisher-queue-skeleton-line ktab-publisher-queue-skeleton-line--long" />
                <div className="ktab-publisher-queue-skeleton-line ktab-publisher-queue-skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="ktab-publisher-queue-empty">
            <div className="ktab-publisher-queue-empty-icon">
              {searchQuery ? <Search size={28} /> : <BookCopy size={28} />}
            </div>
            <h3 className="ktab-publisher-queue-empty-title">
              {searchQuery
                ? `لم يتم العثور على كتب مطابقة لـ «${searchQuery}»`
                : selectedStatus !== "ALL"
                ? "لا توجد كتب مطابقة للتصنيف المحدد في قائمة المراجعة"
                : "قائمة المراجعة التحريرية فارغة حالياً"}
            </h3>
            <p className="ktab-publisher-queue-empty-desc">
              {searchQuery
                ? "تأكد من كتابة عنوان الكتاب أو اسم المؤلف بشكل صحيح أو جرب كلمات بحث أخرى."
                : "عندما يقوم المؤلفون بإرسال أعمالهم للنشر، ستظهر جميع الكتب هنا لفحصها واعتمادها."}
            </p>
            {searchQuery && (
              <Button
                variant="secondary"
                icon={<X size={15} />}
                onClick={() => setSearchQuery("")}
              >
                مسح البحث
              </Button>
            )}
          </div>
        ) : (
          <div className="ktab-publisher-queue-grid">
            {books.map((book) => (
              <PublisherBookCard
                key={book.id}
                book={book}
                onDetails={handleOpenDetails}
                onApprove={handleOpenApprove}
                onReject={handleOpenReject}
              />
            ))}
          </div>
        )}

        {/* Slide-over Editorial Inspection Drawer (Left Side) */}
        {selectedBook && (
          <PublisherReviewDrawer
            isOpen={Boolean(selectedBook)}
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onApprove={handleOpenApprove}
            onReject={handleOpenReject}
          />
        )}

        {/* Editorial Decision Modal (Approve / Reject Note) */}
        {decisionModalBook && (
          <ReviewDecisionModal
            isOpen={Boolean(decisionModalBook)}
            book={decisionModalBook}
            actionType={decisionActionType}
            onClose={handleCloseDecisionModal}
            onSuccess={handleDecisionSuccess}
          />
        )}
      </div>
    </AppLayout>
  );
}
