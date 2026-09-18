import React from "react";
import { useReaderAnalytics } from "./useReaderAnalytics";
import "./ReaderAnalytics.css";

/**
 * Pure presentational Reader Analytics metrics bar.
 * Follows editorial Apple aesthetic with high contrast, tabular numerals, and dynamic tokens.
 */
export function ReaderAnalytics({ assignedBooks, continueReadingBooks, customStats }) {
  const { metrics } = useReaderAnalytics({
    assignedBooks,
    continueReadingBooks,
    customStats,
  });

  return (
    <section className="ktab-reader-analytics" dir="rtl" aria-label="إحصائيات القراءة">
      <div className="ktab-reader-analytics__header">
        <h2 className="ktab-reader-analytics__heading">إحصائيات القراءة</h2>
      </div>

      <div className="ktab-reader-analytics__grid">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.id} className="ktab-reader-stat-card">
              <header className="ktab-reader-stat-card__header">
                <span className="ktab-reader-stat-card__title">{item.label}</span>
                <span className="ktab-reader-stat-card__icon-badge" aria-hidden="true">
                  <Icon size={16} strokeWidth={2.2} />
                </span>
              </header>

              <div className="ktab-reader-stat-card__value">{item.value}</div>

              <footer className="ktab-reader-stat-card__footer">
                <span className="ktab-reader-stat-card__sublabel">{item.sublabel}</span>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ReaderAnalytics;
