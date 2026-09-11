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

