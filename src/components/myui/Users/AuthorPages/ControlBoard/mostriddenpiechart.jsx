import React, { useEffect, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";

const DUMMY_DATA = [
  { name: "الفصل الأول", value: 45 },
  { name: "الفصل الثاني", value: 30 },
  { name: "الفصل الثالث", value: 25 },
];

const COLORS = ["#5de3ba", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e"];

export default function MostRiddenPieChart({ bookId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackShown = useRef(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await getHelper({ url: `/api/books/${bookId}/most-read` });
        if (active && Array.isArray(res)) setData(res);
      } catch {
        if (!fallbackShown.current) {
          AlertToast("تم استخدام بيانات افتراضية للأكثر قراءة", "info");
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
      <CardHeader>
        <CardTitle className="text-right text-black font-black tracking-tight">
          الكتب الأكثر قراءة
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <Skeleton className="h-[280px] w-full bg-black/5" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="42%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={10}
                label={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={4}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                    backgroundColor: "white",
                    borderColor: "rgba(0,0,0,0.05)",
                    borderRadius: "16px",
                    textAlign: "right",
                    boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                    border: "none"
                }}
                itemStyle={{ color: "black", fontWeight: 700 }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "30px", fontWeight: 700, fontSize: "12px", color: "rgba(0,0,0,0.5)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
