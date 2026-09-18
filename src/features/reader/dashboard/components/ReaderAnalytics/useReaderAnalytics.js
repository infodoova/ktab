import { useMemo } from "react";
import { BookOpen, Clock, Star, Award } from "lucide-react";

/**
 * Hook to compute and format reader analytics summary metrics.
 * Derives numbers directly from active library collections with zero hardcoded visual fluff.
 *
 * @param {Object} params
 * @param {Array} [params.assignedBooks=[]]
 * @param {Array} [params.continueReadingBooks=[]]
 * @param {Object} [params.customStats]
 */
export function useReaderAnalytics({
  assignedBooks = [],
  continueReadingBooks = [],
  customStats,
} = {}) {
  const metrics = useMemo(() => {
    // Total books currently in library
    const totalBooks = customStats?.totalBooks ?? assignedBooks.length;

    // Approximate reading hours derived from total progress pages (assuming ~2 mins per page)
    const totalPagesRead = continueReadingBooks.reduce((acc, book) => {
      const page = Number(book.progress || book.lastReadPage || 0);
      return acc + (Number.isFinite(page) ? page : 0);
    }, 0);
    const calculatedHours = Math.round((totalPagesRead * 2) / 60);
    const readingHours = customStats?.readingHours ?? calculatedHours;

    // Average user rating across books with ratings
    const booksWithRatings = assignedBooks.filter(
      (b) => typeof b.averageRating === "number" && b.averageRating > 0
    );
    const avgRating =
      customStats?.avgRating ??
      (booksWithRatings.length > 0
        ? (
            booksWithRatings.reduce((sum, b) => sum + b.averageRating, 0) /
            booksWithRatings.length
          ).toFixed(1)
        : "0.0");

    // Total unlocked achievements count
    const unlockedAchievements = customStats?.unlockedAchievements ?? 0;

    return [
      {
        id: "books-count",
        label: "الكتب في مكتبتك",
        value: totalBooks,
        sublabel: "كتاب محفوظ",
        icon: BookOpen,
      },
      {
        id: "reading-hours",
        label: "ساعات القراءة",
        value: readingHours,
        sublabel: "ساعة مسجلة",
        icon: Clock,
      },
      {
        id: "average-rating",
        label: "متوسط التقييم",
        value: avgRating,
        sublabel: "من 5 نجوم",
        icon: Star,
      },
      {
        id: "achievements-unlocked",
        label: "الإنجازات المفتوحة",
        value: unlockedAchievements,
        sublabel: "شارة مكتسبة",
        icon: Award,
      },
    ];
  }, [assignedBooks, continueReadingBooks, customStats]);

  return { metrics };
}

export default useReaderAnalytics;
