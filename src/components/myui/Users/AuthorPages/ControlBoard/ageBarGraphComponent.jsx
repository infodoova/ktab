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
    <Card dir="rtl" className="bg-[#FEFCF8] border-[#D7CCC8] shadow-sm">
      <CardHeader>
        <CardTitle className="text-right text-[#3E2723] font-['Cairo']">
          الفئات العمرية للمقيمين
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[280px] w-full bg-[#F4EFE9]" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {/* layout="horizontal" makes bars vertical (standing up) */}
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#D7CCC8"
                vertical={false}
              />
              <XAxis
                dataKey="age"
                tick={{ fill: "#3E2723", fontSize: 12, fontFamily: "Cairo" }}
                axisLine={{ stroke: "#5D4037" }}
              />
              <YAxis
                textAlign="right"
                tick={{ fill: "#3E2723", fontSize: 12 }}
                axisLine={{ stroke: "#5D4037" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FEFCF8",
                  borderColor: "#5D4037",
                  borderRadius: "8px",
                  textAlign: "right",
                }}
              />
              <Bar
                dataKey="count"
                fill="#606C38" /* Earth Olive */
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
