import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAgeBarGraph } from "./useAgeBarGraph";
import "./AgeBarGraph.css";

function CustomAgeTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="ktab-chart-tooltip">
        <div className="ktab-chart-tooltip__label">الفئة: {label}</div>
        <div className="ktab-chart-tooltip__value">
          {payload[0].value} قارئ
        </div>
      </div>
    );
  }
  return null;
}

/**
 * Bar chart showing reader demographics grouped by age brackets.
 * Supports loading skeletons, empty data fallbacks, and interactive tooltips.
 */
export function AgeBarGraph({ data = [], loading = false, isDemo = false }) {
  const { hasData } = useAgeBarGraph({ data, loading });

  return (
    <div className="ktab-chart-card" dir="rtl">
      {/* Header */}
      <div className="ktab-chart-card__header">
        <div>
          <div className="ktab-chart-card__title-row">
            <h3 className="ktab-chart-card__title">الفئات العمرية للقراء</h3>
            {isDemo && (
              <span className="ktab-analytics-demo-badge">
                <span className="ktab-analytics-demo-dot" />
                بيانات تجريبية
              </span>
            )}
          </div>
          <p className="ktab-chart-card__subtitle">
            توزيع شرائح القراء حسب العمر
          </p>
        </div>
      </div>

      {/* Chart Body */}
      <div className="ktab-chart-card__body">
        {loading ? (
          <div className="ktab-chart-card__skeleton" />
        ) : !hasData ? (
          <div className="ktab-chart-card__empty">
            لا توجد إحصائيات عمرية متاحة حالياً
          </div>
        ) : (
          <div className="ktab-chart-card__chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 15, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0, 0, 0, 0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="age"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  dx={-4}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.03)", radius: 8 }}
                  content={<CustomAgeTooltip />}
                />
                <Bar
                  dataKey="count"
                  fill="#0d9488"
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgeBarGraph;
