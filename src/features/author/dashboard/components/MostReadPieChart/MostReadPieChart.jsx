import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMostReadPieChart } from "./useMostReadPieChart";
import { PIE_CHART_SEGMENT_COLORS } from "../../constants/dashboardConstants";
import "./MostReadPieChart.css";

function CustomPieTooltip({ active, payload, totalValue }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const percent =
      typeof data.percent === "number"
        ? Math.round(data.percent * 100)
        : totalValue > 0
        ? Math.round(((data.value || 0) / totalValue) * 100)
        : 0;

    return (
      <div className="ktab-chart-tooltip">
        <div className="ktab-chart-tooltip__label">{data.name}</div>
        <div className="ktab-chart-tooltip__metrics">
          <span className="ktab-chart-tooltip__value">{data.value} قارئ</span>
          <span className="ktab-chart-tooltip__percent">({percent}%)</span>
        </div>
      </div>
    );
  }
  return null;
}

/**
 * Renders reader distribution across book chapters using a donut chart.
 * Features central interactive summary metric and compact colored chapter chips.
 */
export function MostReadPieChart({ data = [], loading = false, isDemo = false }) {
  const {
    totalValue,
    activeSliceIndex,
    activeSlice,
    handleSliceHover,
    handleSliceLeave,
    handleSliceToggle,
  } = useMostReadPieChart({ data });

  return (
    <div className="ktab-pie-card" dir="rtl">
      {/* Header */}
      <div className="ktab-pie-card__header">
        <div>
          <div className="ktab-pie-card__title-row">
            <h3 className="ktab-pie-card__title">الفصول الأكثر قراءة</h3>
            {isDemo && (
              <span className="ktab-analytics-demo-badge">
                <span className="ktab-analytics-demo-dot" />
                بيانات تجريبية
              </span>
            )}
          </div>
          <p className="ktab-pie-card__subtitle">
            تفاعل القراء مع فصول وأجزاء الكتاب
          </p>
        </div>
      </div>

      {/* Chart Body */}
      <div className="ktab-pie-card__body">
        {loading ? (
          <div className="ktab-pie-card__skeleton" />
        ) : !data || data.length === 0 ? (
          <div className="ktab-pie-card__empty">
            لا توجد إحصائيات قراءة متاحة حالياً
          </div>
        ) : (
          <>
            <div className="ktab-pie-chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={108}
                    paddingAngle={4}
                    stroke="none"
                    isAnimationActive={true}
                    onMouseEnter={(_, index) => handleSliceHover(index)}
                    onMouseLeave={handleSliceLeave}
                    onClick={(_, index) => handleSliceToggle(index)}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          PIE_CHART_SEGMENT_COLORS[
                            index % PIE_CHART_SEGMENT_COLORS.length
                          ]
                        }
                        opacity={
                          activeSliceIndex === null || activeSliceIndex === index
                            ? 1
                            : 0.4
                        }
                        className="ktab-pie-sector"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomPieTooltip totalValue={totalValue} />}
                    wrapperStyle={{ outline: "none", zIndex: 100 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Central Donut Metric */}
              <div className="ktab-pie-center-stat" aria-hidden="true">
                <span className="ktab-pie-center-stat__value">
                  {activeSlice != null
                    ? (activeSlice.value || 0).toLocaleString("en-US")
                    : totalValue.toLocaleString("en-US")}
                </span>
                <span
                  className="ktab-pie-center-stat__label"
                  title={activeSlice?.name || "إجمالي القراء"}
                >
                  {activeSlice != null ? activeSlice.name : "إجمالي القراء"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MostReadPieChart;
