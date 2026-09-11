import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const NEON_COLORS = ["#5de3ba", "#38bdf8", "#818cf8", "#f472b6", "#fbbf24"];

/**
 * Pure presentation MostReadPieChart component - Mobile-First Liquid Glass Edition
 */
export function MostReadPieChart({ data = [], loading = false }) {
  return (
    <div
      dir="rtl"
      className="relative rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_15px_35px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between"
    >
      {/* Specular White Top Reflection Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 md:pb-6 mb-2 border-b border-white/10">
        <div>
          <h3 className="text-base md:text-xl font-black text-white tracking-tight">
            الفصول الأكثر قراءة
          </h3>
          <p className="text-[11px] md:text-xs font-bold text-slate-200 mt-0.5">
            تفاعل القراء مع فصول وأجزاء الكتاب
          </p>
        </div>
      </div>

      {/* Chart Body */}
      <div className="w-full min-h-[240px] md:min-h-[280px] flex items-center justify-center">
        {loading ? (
          <div className="h-[240px] md:h-[280px] w-full bg-white/[0.02] animate-pulse rounded-2xl" />
        ) : !data || data.length === 0 ? (
          <div className="h-[240px] md:h-[280px] flex items-center justify-center text-slate-200 font-bold text-xs md:text-sm">
            لا توجد إحصائيات قراءة متاحة حالياً
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={6}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={NEON_COLORS[index % NEON_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 13, 22, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  textAlign: "right",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "10px 14px",
                }}
                itemStyle={{ color: "#5de3ba", fontWeight: 900 }}
                labelStyle={{ color: "white", fontWeight: 700 }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: "16px",
                  fontWeight: 800,
                  fontSize: "11px",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default MostReadPieChart;
