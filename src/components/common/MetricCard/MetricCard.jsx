import React, { memo } from "react";
import "./MetricCard.css";

/**
 * Editorial Apple / Eleven Reader unified MetricCard component.
 * Reusable across all role dashboards (Author, Publisher, Librarian, Admin).
 *
 * @param {Object} props
 * @param {string} props.title - Metric title or label
 * @param {string|number} props.value - Metric primary value
 * @param {string|number} [props.subValue] - Secondary subtitle or trend label
 * @param {React.ComponentType|React.ReactNode} [props.icon] - Icon component or node
 * @param {React.ReactNode} [props.badge] - Optional pill badge element
 * @param {() => void} [props.onClick] - Optional click handler
 * @param {"vertical"|"horizontal"} [props.layout="vertical"] - Layout orientation
 * @param {string} [props.className] - Additional class names
 * @param {boolean} [props.active] - Whether card is active/selected
 */
export const MetricCard = memo(function MetricCard({
  title,
  value,
  subValue,
  icon: Icon,
  badge,
  onClick,
  layout = "vertical",
  className = "",
  active = false,
}) {
  const isClickable = Boolean(onClick);

  return (
    <article
      className={`ktab-global-metric-card ktab-global-metric-card--${layout} ${
        isClickable ? "ktab-global-metric-card--clickable" : ""
      } ${active ? "ktab-global-metric-card--active" : ""} ${className}`}
      onClick={onClick}
      role={isClickable ? "button" : "article"}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="ktab-global-metric-card__header">
        <span className="ktab-global-metric-card__title" title={title}>
          {title}
        </span>
        <div className="ktab-global-metric-card__top-actions">
          {badge && <span className="ktab-global-metric-card__badge">{badge}</span>}
          {Icon && (
            <div className="ktab-global-metric-card__icon-badge" aria-hidden="true">
              {React.isValidElement(Icon) ? (
                Icon
              ) : typeof Icon === "string" ? (
                <img src={Icon} alt="" className="ktab-global-metric-card__icon-img" />
              ) : (
                <Icon size={18} strokeWidth={2.2} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ktab-global-metric-card__body">
        <div className="ktab-global-metric-card__value">{value}</div>
      </div>

      {subValue && (
        <div className="ktab-global-metric-card__footer">
          <span className="ktab-global-metric-card__subvalue">{subValue}</span>
        </div>
      )}
    </article>
  );
});

export default MetricCard;
