import { useMemo } from "react";
import { Headphones, MessageSquare, BookOpen, Star } from "lucide-react";

/**
 * Hook preparing and formatting metric cards data for AuthorStatsCards.
 */
export function useAuthorStatsCards(stats) {
  const cards = useMemo(
    () => [
      {
        title: "إجمالي القراءات",
        value: Number(stats?.totalReads ?? 0).toLocaleString("en-US"),
        subValue: "عملية قراءة عبر كافة الأعمال",
        icon: Headphones,
      },
      {
        title: "التقييمات والمراجعات",
        value: Number(stats?.totalReviews ?? 0).toLocaleString("en-US"),
        subValue: "مراجعة نقدية مسجلة",
        icon: MessageSquare,
      },
      {
        title: "الكتب المنشورة",
        value: Number(stats?.totalBooks ?? 0).toLocaleString("en-US"),
        subValue: "عمل متاح للقراء",
        icon: BookOpen,
      },
      {
        title: "متوسط التقييم العام",
        value:
          typeof stats?.averageRating === "number"
            ? stats.averageRating.toFixed(1)
            : stats?.averageRating || "0.0",
        subValue: "من 5 نجوم",
        icon: Star,
      },
    ],
    [stats]
  );

  return { cards };
}

export default useAuthorStatsCards;
