// Centralized fake/mock media and book data
// Placed in src/fakedataorassets/ so it can easily be swapped or removed later.

import cover1 from "@/assets/images/covers/b1.webp";
import cover2 from "@/assets/images/covers/b2.webp";
import cover3 from "@/assets/images/covers/b3.webp";
import cover4 from "@/assets/images/covers/b4.webp";
import cover5 from "@/assets/images/covers/a1.webp";
import cover6 from "@/assets/images/covers/a2.webp";

// Optimized WebP thumbnails for catalog marquee (under 40KB each vs 7MB)
import thumb1 from "@/assets/images/thumbs/b1.webp";
import thumb2 from "@/assets/images/thumbs/b2.webp";
import thumb3 from "@/assets/images/thumbs/b3.webp";
import thumb4 from "@/assets/images/thumbs/b4.webp";
import thumb5 from "@/assets/images/thumbs/a1.webp";
import thumb6 from "@/assets/images/thumbs/a2.webp";
import thumb7 from "@/assets/images/thumbs/a3.webp";
import thumb8 from "@/assets/images/thumbs/a4.webp";
import thumb9 from "@/assets/images/thumbs/interactive.webp";
import thumb10 from "@/assets/images/thumbs/listen.webp";
import thumb11 from "@/assets/images/thumbs/progress.webp";
import thumb12 from "@/assets/images/thumbs/ai.webp";

import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import dinoCover from "@/assets/images/children-stories/dino.jpg";
import astroCover from "@/assets/images/children-stories/astro.jpg";

import soundSampleAudio from "@/assets/fakes/sound_sample.mp3";

export const FAKE_SOUND_SAMPLE = soundSampleAudio;

const TTS_SAMPLE_STORY =
  "في صباح هادئ، خرج سامر من منزله متجها إلى المدرسة. وبينما كان يسير في الطريق، وجد صندوقا صغيرا تحت شجرة قديمة. فتحه بحذر، فوجد بداخله رسالة غامضة ومفتاحا لامعا. أخذ سامر الرسالة، وبدأ يتساءل: ترى، إلى ماذا يفتح هذا المفتاح؟";

export const FAKE_HERO_BOOKS = [
  {
    id: "book-1",
    title: "أخلاقيات الرأسمالية",
    subtitle: "ما لن يخبرك به أستاذك في الاقتصاد الحديث",
    author: "د. توم بالمر",
    narrator: "صوت: راوي كتاب التوليدي (طبيعي فائق النقاء)",
    category: "فكر واقتصاد",
    rating: 4.9,
    cover: cover1,
    audioSrc: soundSampleAudio,
    pages: 340,
    firstPageChapter: "الفصل الأول: معضلة الأسواق والإنسان",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "book-2",
    title: "مدخل إلى الليبرالية الكلاسيكية",
    subtitle: "أصول الحرية الفردية والحكومة المحدودة",
    author: "إيمون بتلر",
    narrator: "صوت: راوي كتاب التوليدي (طبيعي فائق النقاء)",
    category: "فلسفة وسياسة",
    rating: 4.8,
    cover: cover2,
    audioSrc: soundSampleAudio,
    pages: 210,
    firstPageChapter: "الفصل الأول: ولادة الفكرة",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "book-3",
    title: "الفقر والحرية",
    subtitle: "إعادة التفكير في سياسات التنمية البشرية",
    author: "بروفيسور جون ريان",
    narrator: "صوت: راوي كتاب التوليدي (طبيعي فائق النقاء)",
    category: "تنمية ومجتمع",
    rating: 4.9,
    cover: cover3,
    audioSrc: soundSampleAudio,
    pages: 420,
    firstPageChapter: "الفصل الأول: إشراقة الغد",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "book-4",
    title: "أصدقاء إلى الأبد",
    subtitle: "قصص ملهمة عن الصداقة والوفاء والنشأة",
    author: "منى السالم",
    narrator: "صوت: راوي كتاب التوليدي (طبيعي فائق النقاء)",
    category: "أدب وقصص",
    rating: 4.7,
    cover: cover4,
    audioSrc: soundSampleAudio,
    pages: 180,
    firstPageChapter: "الفصل الأول: حكاية في الذاكرة",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "book-5",
    title: "أسرار الفضاء والكون",
    subtitle: "دليل المبتكرين لاكتشاف عوالم ما بعد النجوم",
    author: "فريق باحثي كتاب",
    narrator: "صوت: راوي كتاب التوليدي (طبيعي فائق النقاء)",
    category: "علوم وفضاء",
    rating: 5.0,
    cover: cover5,
    audioSrc: soundSampleAudio,
    pages: 290,
    firstPageChapter: "الفصل الأول: وراء الأفق المرئي",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "book-6",
    title: "عالم الذكاء التوليدي",
    subtitle: "كيف يعيد الذكاء الاصطناعي صياغة مستقبل المعرفة",
    author: "د. سامي رضوان",
    narrator: "صوت: راوي كتاب التوليدي (طبيعي فائق النقاء)",
    category: "تقنية ومستقبل",
    rating: 4.9,
    cover: cover6,
    audioSrc: soundSampleAudio,
    pages: 260,
    firstPageChapter: "الفصل الأول: عندما يتعلم الجماد النطق",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
];

export const FAKE_CATALOG_BOOKS = [
  {
    id: "cat-1",
    title: "أخلاقيات الرأسمالية",
    author: "د. توم بالمر",
    narrator: "راوي كتاب التوليدي",
    cover: thumb1,
    audioSrc: soundSampleAudio,
    category: "فكر واقتصاد",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-2",
    title: "مدخل إلى الليبرالية الكلاسيكية",
    author: "إيمون بتلر",
    narrator: "راوي كتاب التوليدي",
    cover: thumb2,
    audioSrc: soundSampleAudio,
    category: "فلسفة وسياسة",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-3",
    title: "الفقر والحرية",
    author: "بروفيسور جون ريان",
    narrator: "راوي كتاب التوليدي",
    cover: thumb3,
    audioSrc: soundSampleAudio,
    category: "تنمية ومجتمع",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-4",
    title: "أصدقاء إلى الأبد",
    author: "منى السالم",
    narrator: "راوي كتاب التوليدي",
    cover: thumb4,
    audioSrc: soundSampleAudio,
    category: "أدب وقصص",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-5",
    title: "أسرار الفضاء والكون",
    author: "فريق باحثي كتاب",
    narrator: "راوي كتاب التوليدي",
    cover: thumb5,
    audioSrc: soundSampleAudio,
    category: "علوم وفضاء",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-6",
    title: "عالم الذكاء التوليدي",
    author: "د. سامي رضوان",
    narrator: "راوي كتاب التوليدي",
    cover: thumb6,
    audioSrc: soundSampleAudio,
    category: "تقنية ومستقبل",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-7",
    title: "تاريخ الأفكار الكبرى",
    author: "د. إبراهيم الفقي",
    narrator: "راوي كتاب التوليدي",
    cover: thumb7,
    audioSrc: soundSampleAudio,
    category: "فلسفة وفكر",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-8",
    title: "رحلة في أعماق العقل",
    author: "د. أحمد خالد توفيق",
    narrator: "راوي كتاب التوليدي",
    cover: thumb8,
    audioSrc: soundSampleAudio,
    category: "علم النفس",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-9",
    title: "قصص تفاعلية ملهمة",
    author: "نجيب محفوظ",
    narrator: "راوي كتاب التوليدي",
    cover: thumb9,
    audioSrc: soundSampleAudio,
    category: "روايات وأدب",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-10",
    title: "فن الاستماع الفعّال",
    author: "كتاب الصوتيات الذكية",
    narrator: "راوي كتاب التوليدي",
    cover: thumb10,
    audioSrc: soundSampleAudio,
    category: "تطوير الذات",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-11",
    title: "مسارات التقدم الأكاديمي",
    author: "د. مصطفى محمود",
    narrator: "راوي كتاب التوليدي",
    cover: thumb11,
    audioSrc: soundSampleAudio,
    category: "تعليم ومعرفة",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
  {
    id: "cat-12",
    title: "خوارزميات المستقبل",
    author: "أكاديمية كتاب للابتكار",
    narrator: "راوي كتاب التوليدي",
    cover: thumb12,
    audioSrc: soundSampleAudio,
    category: "ذكاء اصطناعي",
    firstPageExcerpt: TTS_SAMPLE_STORY,
  },
];

/**
 * Centralized Demo/Mock Analytics Data for Author Dashboard
 * Includes age demographic brackets, chapter reading frequencies, and summary totals.
 */
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

/**
 * Centralized Demo/Mock Reviews Data for Author Ratings & Reviews
 */
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

export const FAKE_CHILDREN_STORY_BOOKS = [
  {
    id: "child-story-1",
    title: "مغامرة الأرنب سمسم في الغابة السحرية",
    subtitle: "رحلة البحث عن الفطر المضيء والكنز المفقود",
    author: "نورا السالم",
    illustrator: "استوديو حكايات",
    cover: bunnyCover,
    ageGroup: "3-6",
    ageLabel: "٣-٦ سنوات",
    category: "مغامرات وخيال",
    readingTime: "٥ دقائق",
    pages: 18,
    isInteractive: true,
    likesCount: 1420,
    accentColor: "var(--brand-teal)",
    summary:
      "يخرج الأرنب الشجاع سمسم في صباح يوم مشرق بحثاً عن الجزرة الذهبية وسط أشجار الغابة السحرية حيث الفطر المضيء والحيوانات الصديقة.",
  },
  {
    id: "child-story-2",
    title: "التنين الصغير ونجمة الأمنيات",
    subtitle: "كيف تعلم التنين اللطيف الطيران بين الغيوم الملونة",
    author: "كريم عبد الله",
    illustrator: "منى فؤاد",
    cover: dinoCover,
    ageGroup: "3-6",
    ageLabel: "٣-٦ سنوات",
    category: "حكايات قبل النوم",
    readingTime: "٦ دقائق",
    pages: 22,
    isInteractive: false,
    likesCount: 980,
    accentColor: "#f59e0b",
    summary:
      "قصة دافئة وهادئة تروي مغامرة تنين صغير لطيف يحمل بالون نجمة لامعة فوق السحاب الوردي ليعيدها إلى مكانها في السماء قبل أن ينام.",
  },
  {
    id: "child-story-3",
    title: "رائد الفضاء الصغير وعالم الحلوى",
    subtitle: "مغامرة كروية بين كواكب الكعك ونجوم السكر",
    author: "طارق المهندس",
    illustrator: "ريم البلوشي",
    cover: astroCover,
    ageGroup: "6-9",
    ageLabel: "٦-٩ سنوات",
    category: "فضاء وخيال علمي",
    readingTime: "٨ دقائق",
    pages: 26,
    isInteractive: true,
    likesCount: 2310,
    accentColor: "#38bdf8",
    summary:
      "يسافر الطفل ماجد مع قطه رائد الفضاء في مركبته السريعة ليكتشف مجرة مصنوعة بالكامل من الدونات والسكاكر الملونة في رحلة فضائية شيقة وممتعة.",
  },
  {
    id: "child-story-4",
    title: "سر الشجرة ذات الأوراق الفضية",
    subtitle: "قصة عن التعاون وحماية الطبيعة",
    author: "هدى العلي",
    illustrator: "أحمد كمال",
    cover: dinoCover,
    ageGroup: "6-9",
    ageLabel: "٦-٩ سنوات",
    category: "عالم الطبيعة",
    readingTime: "٧ دقائق",
    pages: 20,
    isInteractive: true,
    likesCount: 875,
    accentColor: "var(--brand-teal)",
    summary:
      "تتحد كائنات الغابة الصغيرة لمساعدة الشجرة الفضية القديمة على استعادة بريقها، ليتعلم الجميع أهمية التعاون والصداقة الصادقة.",
  },
  {
    id: "child-story-5",
    title: "الأميرة سلمى وساعة الزمن الوردية",
    subtitle: "حكاية ملهمة لتعليم الأطفال تنظيم الوقت",
    author: "سارة الحمد",
    illustrator: "استوديو حكايات",
    cover: bunnyCover,
    ageGroup: "9-12",
    ageLabel: "٩-١٢ سنة",
    category: "قيم وتربية",
    readingTime: "١٠ دقائق",
    pages: 32,
    isInteractive: false,
    likesCount: 1650,
    accentColor: "#ec4899",
    summary:
      "تجد الأميرة سلمى ساعة أثرية توقف الزمن عند اللحظات السعيدة، لكنها تكتشف سر قيمة الوقت وكيف تصنع من كل دقيقة إنجازاً وفرحاً.",
  },
  {
    id: "child-story-6",
    title: "الغواصة الصفراء وسر المحيط المرجاني",
    subtitle: "استكشاف أعماق البحار والكائنات اللامعة",
    author: "د. سامح مروان",
    illustrator: "دار الألوان",
    cover: astroCover,
    ageGroup: "6-9",
    ageLabel: "٦-٩ سنوات",
    category: "عالم الحيوان والبحار",
    readingTime: "٧ دقائق",
    pages: 24,
    isInteractive: true,
    likesCount: 1890,
    accentColor: "#14b8a6",
    summary:
      "رحلة مشوقة في أعماق المحيط لاكتشاف أسرار الشعاب المرجانية، الدلافين الودودة، وحوت العنبر العملاق في قالب تفاعلي رائع.",
  },
];







