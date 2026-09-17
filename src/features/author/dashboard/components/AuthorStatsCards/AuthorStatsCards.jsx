import React from "react";
import { useAuthorStatsCards } from "./useAuthorStatsCards";
import "./AuthorStatsCards.css";

/**
 * Pure presentation AuthorStatsCards component.
 * Uses useAuthorStatsCards for formatted metric calculations.
 */
export function AuthorStatsCards({ stats }) {
  const { cards } = useAuthorStatsCards(stats);

  return (
    <section className="ktab-stats-grid" dir="rtl" aria-label="ملخص إحصائيات المؤلف">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.title} className="ktab-stat-card">
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

export default AuthorStatsCards;
