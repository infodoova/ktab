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

/* ==========================================================================
   FAKE BIG TEST BOOK (Easily removable for rapid reader pagination testing)
   Generates a realistic 120+ page book with 20 distinct chapters.
   ========================================================================== */
export const FAKE_BIG_TEST_BOOK = (() => {
  const chapters = [
    { title: "الفصل الأول: نداء الحكمة والبدايات", theme: "عن المعرفة والرحلة الأولى في فضاء الفكر الإنساني وتأملات الوجود." },
    { title: "الفصل الثاني: أصداء الزمان البعيد", theme: "كيف تشكلت المدن والمجتمعات عبر الأساطير والقصص المتوارثة جيلاً بعد جيل." },
    { title: "الفصل الثالث: فلسفة النور والظلال", theme: "في الجمال والتوازن بين ما نراه من حقائق وما ندركه ببصيرتنا." },
    { title: "الفصل الرابع: حوارات في فجر التاريخ", theme: "مناظرات الحكماء الأوائل حول العدل والحرية ومعنى السعادة الحقيقية." },
    { title: "الفصل الخامس: لغة الروح والوجدان", theme: "قوة الكلمات في تحريك العواطف وبناء الجسور بين الثقافات المختلفة." },
    { title: "الفصل السادس: أسرار المخطوطات القديمة", theme: "البحث عن المعنى المفقود في خزائن الوراقين ومكتبات الشرق العظيمة." },
    { title: "الفصل السابع: سيمفونية الطبيعة والكون", theme: "التناغم العجيب بين مسارات النجوم وحركة الكواكب ودورة الحياة." },
    { title: "الفصل الثامن: مرايا النفس والوعي", theme: "رحلة استكشاف الذات والتغلب على المخاوف في مواجهة التحديات الكبرى." },
    { title: "الفصل التاسع: مآثر الفرسان والشعراء", theme: "بطولات خلدتها القصائد وأقوال أصبحت نبراساً لمن جاء بعدهم." },
    { title: "الفصل العاشر: جسور الأمل والمستقبل", theme: "رؤية استشرافية لعالم يملأه السلام وتتكامل فيه المعرفة مع الإنسانية." },
    { title: "الفصل الحادي عشر: رياح التغيير الكبرى", theme: "كيف غيرت الاكتشافات العلمية مسار الحضارات وأيقظت العقول." },
    { title: "الفصل الثاني عشر: أفق لا ينتهي", theme: "أحلام المغامرين الذين عبروا البحار بحثاً عن أراضٍ وعوالم جديدة." },
    { title: "الفصل الثالث عشر: بلاغة الصمت والتأمل", theme: "حين تصمت الأصوات وتتحدث الأفكار بوضوح في محراب العزلة الجميلة." },
    { title: "الفصل الرابع عشر: شعلة الإبداع والابتكار", theme: "سر الشرارة التي تلهم المبدعين لصناعة الفارق وترك بصمة خالدة." },
    { title: "الفصل الخامس عشر: حكايات على ضفاف النهر", theme: "ذكريات طفولة ودروس من الحياة اليومية تنبض بالصدق والبساطة." },
    { title: "الفصل السادس عشر: توازن القوى والمجتمع", theme: "تحليل عميق لديناميكيات القيادة وبناء المؤسسات الراسخة." },
    { title: "الفصل السابع عشر: ألوان الأفق والغروب", theme: "لوحات أدبية تصف تبدل الفصول وإيقاع الحياة المستمر." },
    { title: "الفصل الثامن عشر: في معنى الصداقة والوفاء", theme: "أسمى الروابط البشرية وكيف تصمد أمام اختبارات الزمن الصعبة." },
    { title: "الفصل التاسع عشر: إرث الأجداد للأحفاد", theme: "حفظ الذاكرة والهوية في عصر التسارع الرقمي والتغيرات الشاملة." },
    { title: "الفصل العشرون: خاتمة الرحلة وبداية الأثر", theme: "خلاصات فكرية ودعوة دائمة لمواصلة القراءة والبحث عن النور." },
  ];

  let fullBook = "";
  chapters.forEach((ch, idx) => {
    fullBook += `\n\n=== ${ch.title} ===\n\n`;
    fullBook += `${ch.theme} كان التفكير في هذا الموضوع منذ العصور القديمة يشغل بال الفلاسفة والعلماء. فقد أدرك الإنسان منذ اللحظة الأولى أن بقاءه مرهون بمدى فهمه للعالم المحيط به وقدرته على استخلاص العبر من تجارب السابقين وصياغة رؤى جديدة لمستقبل واعد ومشرق.\n\n`;
    fullBook += `تتوالى الأيام وتتشابك الأحداث لتصنع نسيجاً غنياً من الخبرات الإنسانية المتراكمة. وفي كل منعطف تاريخي، كان هناك صوت حكيم يرتفع ليذكر الناس بالقيم الأصيلة التي تضمن استقرار المجتمعات وازدهارها. ليست المعرفة مجرد حفظ للمعلومات وتكديس للكتب في الخزائن، بل هي نور يضيء البصيرة ويهدي السائرين في دروب الحياة الوعرة نحو الحقيقة.\n\n`;
    fullBook += `عندما نقف أمام هذه الصفحات ونتأمل ما سطرته أيدي المفكرين عبر القرون، ندرك حجم المسؤولية الملقاة على عاتقنا في نقل هذه الأمانة إلى الأجيال القادمة بنقاء ووضوح. إن قوة الكلمة الحرة تكمن في قدرتها على كسر قيود الجهل وبناء صروح الفكر والحرية والكرامة الإنسانية، وتوجيه الطاقات نحو البناء والعطاء المستمر.\n\n`;
    fullBook += `ومع كل صفحة نطويها، نكتشف جانباً جديداً من الحقيقة لم نكن نلتفت إليه من قبل، وكأن الكتاب مرآة نرى فيها ذواتنا وطموحاتنا وأشواقنا إلى غد أفضل وأكثر إشراقاً وأملاً. إنها رحلة لا تنتهي، ومسيرة مستمرة من الإلهام والبحث الدؤوب عن المعنى والجمال الكامن في تفاصيل الوجود اليومي.\n\n`;
    fullBook += `إن التأمل في مسار الحضارات يعلمنا أن الأمم التي نهضت لم تكن تملك بالضرورة وفرة في الموارد المادية وحدها، بل كانت تمتلك إيماناً راسخاً بقوة العلم وشغفاً لا ينطفئ بالمعرفة وحرصاً على رعاية العقول المبدعة وتشجيع التساؤل والبحث النقدي البناء.\n\n`;
    fullBook += `المحور الثاني: التجربة الإنسانية المشتركة. لقد توارثت الأجيال حكايات الشجاعة والتضحية والإخلاص، وجعلت منها نماذج يُحتذى بها في تربية النشء وتوجيه مسار المجتمع نحو الفضيلة. وإذا أردنا أن نبني نهضة فكرية معاصرة، فعلينا أن نبدأ بإحياء روح القراءة الجادة والتفكير المستقل، والابتعاد عن التلقين السطحي والأفكار الجاهزة التي لا تثمر وعياً حقيقياً.\n\n`;
    fullBook += `المحور الثالث: آفاق التطور واستشراف الغد. إن التحديات التي تواجه عالمنا اليوم تتطلب عقولاً منفتحة قادرة على الجمع بين الأصالة والمعاصرة، والاستفادة من مكتسبات العلم الحديث مع التمسك بالثوابت الأخلاقية والقيم الإنسانية النبيلة. فالتقدم الحقيقي ليس مجرد أدوات وتقنيات متطورة، بل هو قبل كل شيء ارتقاء بسلوك الإنسان ونظرته لأخيه الإنسان في هذا الكوكب المشترك.\n\n`;
    fullBook += `وهكذا يظل السؤال مفتوحاً أمام الباحثين والمفكرين في كل زمان: كيف نبني مستقبلاً يليق بكرامة الإنسان ويحقق تطلعاته المشروعة؟ الإجابة لا تكمن في الجمل الجاهزة أو النظريات المجردة، بل في الممارسة اليومية والالتزام الأخلاقي الصادق بنشر العدل والخير والتنوير بين كافة البشر، ومد جسور الحوار والتفاهم الإنساني الراقي.\n\n`;
    fullBook += `خاتمة الباب: وفي نهاية هذا الفصل، نجد أن كل خطوة نخطوها في مدارج المعرفة هي خطوة نحو تحرير العقل من الأوهام والارتقاء بالنفس نحو آفاق أرحب من الحكمة والسكينة والوعي الخالص الذي يدوم أثره عبر الأجيال.\n\n`;
  });

  return fullBook.trim();
})();




