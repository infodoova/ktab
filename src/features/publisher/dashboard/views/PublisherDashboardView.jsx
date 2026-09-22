import React from "react";
import { Clock, CheckCircle, FileEdit, ArrowLeft, BookOpen } from "lucide-react";
import { AppLayout } from "@/components/myui/layout";
import { usePublisherDashboard } from "../../hooks/usePublisherDashboard";
import { PublisherBookCard } from "../../components/PublisherBookCard";
import "./PublisherDashboardView.css";

/**
 * Editorial Publisher Dashboard View.
 * Displays key review metrics and a curated preview of recently submitted books.
 */
export default function PublisherDashboardView() {
  const {
    loading,
    recentQueue,
    counts,
    handleNavigateToQueue,
  } = usePublisherDashboard();

  return (
    <AppLayout pageName="لوحة التحكم التحريرية" showSearch={false}>
      <div className="ktab-publisher-dashboard" dir="rtl">
        {/* Welcome & Overview Header */}
        <div className="ktab-publisher-dashboard__header">
          <div>
            <h2 className="ktab-publisher-dashboard__title">
              لوحة التحكم والمراجعة التحريرية
            </h2>
            <p className="ktab-publisher-dashboard__subtitle">
              نظرة عامة على الكتب المرسلة من المؤلفين ومتابعة قرارات الاعتماد والنشر
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="ktab-publisher-dashboard__metrics">
          <div
            className="ktab-publisher-metric-card ktab-publisher-metric-card--pending"
            onClick={handleNavigateToQueue}
            role="button"
            tabIndex={0}
          >
            <div className="ktab-publisher-metric-card__icon-wrap">
              <Clock size={22} strokeWidth={2.4} />
            </div>
            <div className="ktab-publisher-metric-card__info">
              <span className="ktab-publisher-metric-card__label">
                بانتظار المراجعة والتحكيم
              </span>
              <span className="ktab-publisher-metric-card__value">
                {loading ? "..." : counts.pending}
              </span>
            </div>
          </div>

          <div
            className="ktab-publisher-metric-card ktab-publisher-metric-card--approved"
            onClick={handleNavigateToQueue}
            role="button"
            tabIndex={0}
          >
            <div className="ktab-publisher-metric-card__icon-wrap">
              <CheckCircle size={22} strokeWidth={2.4} />
            </div>
            <div className="ktab-publisher-metric-card__info">
              <span className="ktab-publisher-metric-card__label">
                الكتب المعتمدة والمنشورة
              </span>
              <span className="ktab-publisher-metric-card__value">
                {loading ? "..." : counts.approved}
              </span>
            </div>
          </div>

          <div
            className="ktab-publisher-metric-card ktab-publisher-metric-card--draft"
            onClick={handleNavigateToQueue}
            role="button"
            tabIndex={0}
          >
            <div className="ktab-publisher-metric-card__icon-wrap">
              <FileEdit size={22} strokeWidth={2.4} />
            </div>
            <div className="ktab-publisher-metric-card__info">
              <span className="ktab-publisher-metric-card__label">
                تحت المراجعة / التعديل
              </span>
              <span className="ktab-publisher-metric-card__value">
                {loading ? "..." : counts.rejected}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Queue Submissions Section */}
        <div className="ktab-publisher-dashboard__section">
          <div className="ktab-publisher-dashboard__section-header">
            <div>
              <h3 className="ktab-publisher-dashboard__section-title">
                أحدث الكتب في قائمة المراجعة
              </h3>
              <p className="ktab-publisher-dashboard__section-desc">
                كتب تم إرسالها مؤخراً وتنتظر الفحص والتقييم
              </p>
            </div>

            <button
              type="button"
              onClick={handleNavigateToQueue}
              className="ktab-publisher-dashboard__view-all-btn"
            >
              <span>عرض كامل القائمة</span>
              <ArrowLeft size={15} />
            </button>
          </div>

          {loading ? (
            <div className="ktab-publisher-dashboard__skeleton-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="ktab-publisher-dashboard__skeleton-item">
                  <div className="ktab-publisher-dashboard__skeleton-cover" />
                  <div className="ktab-publisher-dashboard__skeleton-line" />
                </div>
              ))}
            </div>
          ) : recentQueue.length === 0 ? (
            <div className="ktab-publisher-dashboard__empty-box">
              <BookOpen size={32} className="ktab-publisher-dashboard__empty-icon" />
              <p className="ktab-publisher-dashboard__empty-text">
                لا توجد كتب في قائمة المراجعة حالياً. جميع الأعمال تم تقييمها.
              </p>
            </div>
          ) : (
            <div className="ktab-publisher-dashboard__grid">
              {recentQueue.slice(0, 5).map((book) => (
                <PublisherBookCard
                  key={book.id}
                  book={book}
                  onDetails={handleNavigateToQueue}
                  onApprove={handleNavigateToQueue}
                  onReject={handleNavigateToQueue}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
