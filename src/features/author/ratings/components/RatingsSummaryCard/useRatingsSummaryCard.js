import { useMemo } from "react";
import { Headphones, MessageSquare, BookOpen, Star } from "lucide-react";

/**
 * Hook preparing and formatting metric cards matching the main author dashboard.
 */
export function useRatingsSummaryCard({ stats }) {
  const cards = useMemo(() => {
    const rawData = stats?.data || stats;
    const rawRating = Number(rawData?.averageRating ?? 0);
    const formattedRating = !isNaN(rawRating) ? rawRating.toFixed(1) : "0.0";
    const totalReviews = Number(rawData?.totalReviews ?? 0);
    const totalReads = Number(rawData?.totalReads ?? 0);
    const totalBooks = Number(rawData?.totalBooks ?? 0);

    return [
      {
        id: "totalReads",
        title: "إجمالي القراءات",
        value: totalReads.toLocaleString("en-US"),
        subValue: "عملية قراءة عبر كافة الأعمال",
        icon: Headphones,
      },
      {
        id: "totalReviews",
        title: "التقييمات والمراجعات",
        value: totalReviews.toLocaleString("en-US"),
        subValue: "مراجعة نقدية مسجلة",
        icon: MessageSquare,
      },
      {
        id: "totalBooks",
        title: "الكتب المنشورة",
        value: totalBooks.toLocaleString("en-US"),
        subValue: "عمل متاح للقراء",
        icon: BookOpen,
      },
      {
        id: "averageRating",
        title: "متوسط التقييم العام",
        value: formattedRating,
        subValue: "من 5 نجوم",
        icon: Star,
      },
    ];
  }, [stats]);

  return { cards };
}

export default useRatingsSummaryCard;
