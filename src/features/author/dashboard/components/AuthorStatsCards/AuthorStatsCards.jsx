import React from "react";
import { MetricCard, MetricsGrid } from "@/components/common/MetricCard";
import { useAuthorStatsCards } from "./useAuthorStatsCards";

/**
 * AuthorStatsCards presentation component.
 * Uses global MetricCard and MetricsGrid with useAuthorStatsCards for calculations.
 */
export function AuthorStatsCards({ stats }) {
  const { cards } = useAuthorStatsCards(stats);

  return (
    <MetricsGrid columns={4} className="ktab-author-dashboard-metrics">
      {cards.map((card) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          subValue={card.subValue}
          icon={card.icon}
        />
      ))}
    </MetricsGrid>
  );
}

export default AuthorStatsCards;
