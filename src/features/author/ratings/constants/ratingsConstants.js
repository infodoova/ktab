/**
 * Author Ratings & Reviews Constants
 * Filter options, sorting configurations, and rating scale metadata.
 */

export const RATING_FILTER_OPTIONS = [
  { id: "ALL", label: "جميع التقييمات", minRating: 0 },
  { id: "5_STARS", label: "5 نجوم", minRating: 5 },
  { id: "4_PLUS", label: "4 نجوم فأكثر", minRating: 4 },
  { id: "3_PLUS", label: "3 نجوم فأكثر", minRating: 3 },
];

export const RATING_SORT_OPTIONS = [
  { value: "NEWEST", label: "الأحدث أولاً" },
  { value: "HIGHEST", label: "الأعلى تقييماً" },
  { value: "LOWEST", label: "الأقل تقييماً" },
];
