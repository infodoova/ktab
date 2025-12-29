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

// Earth Palette Hex Codes
const COLORS = ["#606C38", "#DEC59E", "#5D4037"];

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
    <Card dir="rtl" className="bg-[#FEFCF8] border-[#D7CCC8] shadow-sm">
      <CardHeader>
        <CardTitle className="text-right text-[#3E2723] font-['Cairo']">
          الكتب الأكثر قراءة
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-[280px] w-full bg-[#F4EFE9]" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%" /* Lifted slightly to make room for legend */
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                label={false} /* Disabled overlapping labels */
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#FEFCF8"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FEFCF8",
                  borderColor: "#D7CCC8",
                  borderRadius: "8px",
                  textAlign: "right",
                }}
                itemStyle={{ fontFamily: "Cairo", color: "#3E2723" }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontFamily: "Cairo", paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
