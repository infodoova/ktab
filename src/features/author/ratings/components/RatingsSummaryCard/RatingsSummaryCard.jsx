import React from "react";
import { useRatingsSummaryCard } from "./useRatingsSummaryCard";
import "./RatingsSummaryCard.css";

/**
 * Pure presentation component rendering author statistics cards matching the main dashboard.
 * All formatting and metrics mapping extracted to useRatingsSummaryCard.
 */
export function RatingsSummaryCard({ stats }) {
  const { cards } = useRatingsSummaryCard({ stats });

  return (
    <section className="ktab-stats-grid" dir="rtl" aria-label="ملخص إحصائيات التقييمات والقراءات">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.id} className="ktab-stat-card">
            <div className="ktab-stat-card__header">
              <span className="ktab-stat-card__title">{card.title}</span>
              <div className="ktab-stat-card__icon-badge">
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>
            <div className="ktab-stat-card__body">
              <div className="ktab-stat-card__value">{card.value}</div>
            </div>
            <div className="ktab-stat-card__footer">
              <span className="ktab-stat-card__sublabel">{card.subValue}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default RatingsSummaryCard;
