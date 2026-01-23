import React, { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";

const DUMMY_DATA = [
  { age: "18-24", count: 12 },
  { age: "25-34", count: 28 },
  { age: "35-44", count: 17 },
  { age: "45+", count: 6 },
];

export default function AgeBarGraphComponent({ bookId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackShown = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await getHelper({
          url: `/api/books/${bookId}/ratings/age-stats`,
        });
        if (active && Array.isArray(res)) setData(res);
      } catch {
        if (!fallbackShown.current) {
          AlertToast("تم استخدام بيانات افتراضية للفئات العمرية", "info");
          fallbackShown.current = true;
        }
        if (active) setData(DUMMY_DATA);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [bookId]);

  return (
    <Card dir="rtl" className="bg-white border-black/5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-right text-black font-black tracking-tighter text-lg md:text-xl">
          الفئات العمرية للمقيمين
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        {loading ? (
          <Skeleton className="h-[280px] w-full bg-black/5 rounded-2xl" />
        ) : (
          <div className="w-full h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="horizontal"
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 20, 
                  left: isMobile ? 0 : 10, 
                  bottom: isMobile ? 10 : 20 
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(0,0,0,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="age"
                  tick={{ 
                    fill: "rgba(0,0,0,0.5)", 
                    fontSize: isMobile ? 10 : 12, 
                    fontWeight: 800 
                  }}
                  tickMargin={isMobile ? 8 : 15}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  textAlign="right"
                  tick={{ 
                    fill: "rgba(0,0,0,0.5)", 
                    fontSize: isMobile ? 10 : 12, 
                    fontWeight: 800 
                  }}
                  tickMargin={isMobile ? 8 : 15}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 30 : 40}
                />
                <Tooltip
                  cursor={{ fill: "rgba(93, 227, 186, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "rgba(0,0,0,0.05)",
                    borderRadius: "20px",
                    textAlign: "right",
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)",
                    border: "none",
                    padding: "12px 16px"
                  }}
                  itemStyle={{ color: "black", fontWeight: 900 }}
                />
                <Bar
                  dataKey="count"
                  fill="#5de3ba"
                  radius={[12, 12, 0, 0]}
                  barSize={isMobile ? 24 : 40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
