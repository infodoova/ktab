// Centralized Demo/Mock Analytics and Reviews Data for Author Dashboard
// Pure data with no external asset imports.

export const FAKE_AUTHOR_ANALYTICS = {
  isDemo: true,
  summary: {
    totalReads: 2840,
    totalReviews: 196,
    totalBooks: 8,
    averageRating: 4.9,
  },
  ageStats: [
    { age: "18-24", count: 420 },
    { age: "25-34", count: 980 },
    { age: "35-44", count: 740 },
    { age: "45-54", count: 480 },
    { age: "55+", count: 220 },
  ],
  mostReadStats: [
    { name: "المقدمة والبداية", value: 410 },
    { name: "الفصل الأول: البدايات", value: 360 },
    { name: "الفصل الثاني: التحدي", value: 290 },
    { name: "نقطة التحول الكبرى", value: 240 },
    { name: "خاتمة العمل والتأملات", value: 180 },
  ],
};

export const FAKE_AUTHOR_REVIEWS = [
  {
    id: 1,
    userName: "أحمد بن سلطان",
    rating: 5,
    createdAt: "2026-03-14T10:30:00Z",
    bookTitle: "ثورة دونالد ترامب: قواعد القوى العظمى",
    comment: "كتاب فكري واستراتيجي متميز جداً. أسلوب التحليل السياسي عميق ورائع، والنسخة الصوتية واضحة للغاية.",
  },
  {
    id: 2,
    userName: "سارة القحطاني",
    rating: 5,
    createdAt: "2026-03-12T15:45:00Z",
    bookTitle: "أبواب الروح: رحلة في التصوف المعاصر",
    comment: "من أجمل الكتب التي قرأتها هذا العام، لغة عذبة وتحليل فلسفي متزن يستحق كل النجوم.",
  },
  {
    id: 3,
    userName: "د. عمر التميمي",
    rating: 4.8,
    createdAt: "2026-03-09T08:15:00Z",
    bookTitle: "ثورة دونالد ترامب: قواعد القوى العظمى",
    comment: "طرح جريء ورؤية استشرافية متميزة للمشهد الدولي. شكراً للمؤلف على هذا الجهد القيم.",
  },
  {
    id: 4,
    userName: "منى المنصور",
    rating: 5,
    createdAt: "2026-03-05T19:20:00Z",
    bookTitle: "صوت الرياح القديمة",
    comment: "سرد ممتع وإيقاع أدبي فريد. استمتعت بكل فصل وقراءة ممتعة جداً.",
  },
  {
    id: 5,
    userName: "فيصل الشمري",
    rating: 4.5,
    createdAt: "2026-02-28T14:10:00Z",
    bookTitle: "أبواب الروح: رحلة في التصوف المعاصر",
    comment: "كتاب مفيد وغني بالأفكار التأملية، أنصح بقراءته ومشاركته.",
  },
];
