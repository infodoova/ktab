import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Pure presentation AgeBarGraph component - Mobile-First Liquid Glass Edition
 */
export function AgeBarGraph({ data = [], loading = false }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
            الفئات العمرية للقراء
          </h3>
          <p className="text-[11px] md:text-xs font-bold text-slate-200 mt-0.5">
            توزيع شرائح القراء حسب العمر
          </p>
        </div>
      </div>

      {/* Chart Body */}
      <div className="w-full min-h-[240px] md:min-h-[280px] flex items-center justify-center">
        {loading ? (
          <div className="h-[240px] md:h-[280px] w-full bg-white/[0.02] animate-pulse rounded-2xl" />
        ) : !data || data.length === 0 ? (
          <div className="h-[240px] md:h-[280px] flex items-center justify-center text-slate-200 font-bold text-xs md:text-sm">
            لا توجد إحصائيات عمرية متاحة حالياً
          </div>
        ) : (
          <div className="w-full h-[240px] sm:h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="horizontal"
                margin={{
                  top: 15,
                  right: isMobile ? 5 : 20,
                  left: isMobile ? -10 : 10,
                  bottom: isMobile ? 5 : 20,
                }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="age"
                  tick={{ fill: "#e2e8f0", fontSize: isMobile ? 10 : 12, fontWeight: 700 }}
                  tickMargin={isMobile ? 6 : 15}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  textAlign="right"
                  tick={{ fill: "#e2e8f0", fontSize: isMobile ? 10 : 12, fontWeight: 700 }}
                  tickMargin={isMobile ? 6 : 15}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 25 : 40}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)", radius: 12 }}
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
                  labelStyle={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 700 }}
                />
                <Bar
                  dataKey="count"
                  fill="#5de3ba"
                  radius={[12, 12, 0, 0]}
                  barSize={isMobile ? 20 : 36}
                  animationDuration={1200}
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
