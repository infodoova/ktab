import bunnyCover from "@/assets/images/children-stories/bunny.jpg";
import dinoCover from "@/assets/images/children-stories/dino.jpg";
import astroCover from "@/assets/images/children-stories/astro.jpg";

/**
 * Children's storybook pages data provider.
 * Follows exact specification:
 * - 1 image per page (1:1 square ratio)
 * - 1 to 2 small sentences at max per page
 * - Scaled for up to 15 pages per story book
 */
export function getStoryPages(story) {
  const id = story?.id || "default";
  const coverImg = story?.cover || bunnyCover;
  const title = story?.title || "حكاية ممتعة للأطفال";
  const author = story?.author || "مؤلف كتاب";
  const illustrator = story?.illustrator || "استوديو حكايات";

  if (story?.pagesContent && Array.isArray(story.pagesContent) && story.pagesContent.length > 0) {
    const rawPages = story.pagesContent;
    let list = rawPages;
    // If the first page is a cover, move it to the end so the story starts immediately on page 1
    if (rawPages[0]?.type === "cover") {
      const coverPage = rawPages[0];
      const storyPages = rawPages.slice(1);
      list = [...storyPages, coverPage];
    } else if (rawPages[rawPages.length - 1]?.type !== "cover") {
      // Append book cover at the end so the story ends with the book cover filled
      list = [
        ...rawPages,
        {
          type: "cover",
          image: coverImg,
          title: title,
        },
      ];
    }
    return list.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
  }

  // Story 1: Bunny Samsem (9 narrative pages + final cover page)
  if (id === "child-story-1") {
    return [
      {
        pageNumber: 1,
        type: "story",
        image: bunnyCover,
        narrative: "استيقظ الأرنب سمسم في صباح مشرق. وجد خريطة غامضة عند نافذة بيته!",
      },
      {
        pageNumber: 2,
        type: "story",
        image: bunnyCover,
        narrative: "انطلق سمسم في رحلته داخل الغابة السحرية. كانت الأشجار تلمع بأنوار مبهجة.",
      },
      {
        pageNumber: 3,
        type: "story",
        image: bunnyCover,
        narrative: "التقى سمسم بالسلحفاة الحكيمة في الوادي. وأخبرته أن الكنز يختبئ قرب التلة الخضراء.",
      },
      {
        pageNumber: 4,
        type: "story",
        image: bunnyCover,
        narrative: "توقف سمسم أمام مفترق طرق مليء بالأزهار الجميلة. وقرر أن يتبع درب الفراشات اللامعة.",
      },
      {
        pageNumber: 5,
        type: "story",
        image: bunnyCover,
        narrative: "سار سمسم بشجاعة عبر الطريق المختار. ورافقته الفراشات الملونة بكل سعادة.",
      },
      {
        pageNumber: 6,
        type: "story",
        image: bunnyCover,
        narrative: "وصل سمسم أخيراً إلى الفطر المضيء. كانت تحته الجزرة الذهبية المتلألئة!",
      },
      {
        pageNumber: 7,
        type: "story",
        image: bunnyCover,
        narrative: "احتفلت حيوانات الغابة مع سمسم بهذا الاكتشاف الرائع. وغنوا معاً أجمل الأناشيد.",
      },
      {
        pageNumber: 8,
        type: "story",
        image: bunnyCover,
        narrative: "شارك سمسم فرحته مع الجميع بكل كرم. وتمنى أن يدوم السلام في الغابة السحرية.",
      },
      {
        pageNumber: 9,
        type: "story",
        image: bunnyCover,
        narrative: "عاد سمسم إلى سريره الدافئ سعيداً بما حققه اليوم. ونام في هدوء وأمان.",
      },
      {
        pageNumber: 10,
        type: "cover",
        image: bunnyCover,
        title: title || "مغامرة الأرنب سمسم السحرية",
      },
    ];
  }

  // Story 2: Dino (7 narrative pages + final cover page)
  if (id === "child-story-2") {
    return [
      {
        pageNumber: 1,
        type: "story",
        image: dinoCover,
        narrative: "كان التنين الصغير ميمو يحلم بالتحليق بين الغيوم. لكنه كان يشعر بقليل من الخوف.",
      },
      {
        pageNumber: 2,
        type: "story",
        image: dinoCover,
        narrative: "سقطت نجمة صغيرة بجوار بيته في المساء. وطلبت مساعدته للعودة إلى السماء العالية.",
      },
      {
        pageNumber: 3,
        type: "story",
        image: dinoCover,
        narrative: "أراد ميمو مساعدة صديقته النجمة بكل محبة. ففرد جناحيه الصغيرين واستعد للتحليق عالياً.",
      },
      {
        pageNumber: 4,
        type: "story",
        image: dinoCover,
        narrative: "فرد ميمو جناحيه وارتفع برشاقة في الهواء. وشعر بسعادة لا توصف وهو يطير!",
      },
      {
        pageNumber: 5,
        type: "story",
        image: dinoCover,
        narrative: "أعاد ميمو النجمة إلى مكانها في السماء المظلمة. فأضاءت له الطريق بنور دافئ.",
      },
      {
        pageNumber: 6,
        type: "story",
        image: dinoCover,
        narrative: "صفقت له العصافير الصغيرة فرحاً بشجاعته. وأصبح ميمو أمهر طائر في الوادي.",
      },
      {
        pageNumber: 7,
        type: "story",
        image: dinoCover,
        narrative: "نام ميمو فوق سحابة قطنية وهو فخور بنفسه. وتمنى أحلاماً سعيدة لكل الأطفال.",
      },
      {
        pageNumber: 8,
        type: "cover",
        image: dinoCover,
        title: title || "التنين الصغير ميمو",
      },
    ];
  }

  // Story 3: Astro (7 narrative pages + final cover page)
  if (id === "child-story-3") {
    return [
      {
        pageNumber: 1,
        type: "story",
        image: astroCover,
        narrative: "ارتدى رائد الفضاء ماجد خوذته الشفافة. وصعد إلى مركبته مع قطه اللطيف كوكو.",
      },
      {
        pageNumber: 2,
        type: "story",
        image: astroCover,
        narrative: "انطلقت المركبة بسرعة عبر الفضاء الشاسع. تاركة خلفها خطاً من النجوم اللامعة.",
      },
      {
        pageNumber: 3,
        type: "story",
        image: astroCover,
        narrative: "ظهرت أمام ماجد مجرة سحرية ملونة بالنجوم. فوجه مركبته نحو الكواكب اللامعة بفضول وفرح.",
      },
      {
        pageNumber: 4,
        type: "story",
        image: astroCover,
        narrative: "هبطت المركبة بسلام على سطح الكوكب الحلو. واستقبلتهم كائنات لطيفة بابتسامات واسعة.",
      },
      {
        pageNumber: 5,
        type: "story",
        image: astroCover,
        narrative: "جمع ماجد عينات من غبار السكر البراق. والتقط صوراً تذكارية مع أصدقائه الجدد.",
      },
      {
        pageNumber: 6,
        type: "story",
        image: astroCover,
        narrative: "عادت المركبة إلى كوكب الأرض محملة بالذكريات. وشعر ماجد بالفخر لاكتشافه الرائع.",
      },
      {
        pageNumber: 7,
        type: "story",
        image: astroCover,
        narrative: "شارك ماجد قصته الشيقة مع أسرته وأصدقائه. وهو يتطلع لرحلته الفضائية القادمة.",
      },
      {
        pageNumber: 8,
        type: "cover",
        image: astroCover,
        title: title || "رحلة الفضاء المدهشة",
      },
    ];
  }

  // Generic fallback (5 narrative pages + final cover page)
  return [
    {
      pageNumber: 1,
      type: "story",
      image: coverImg,
      narrative: "بدأت المغامرة في صباح يوم جميل ومليء بالحيوية. استعد بطلنا لاكتشاف العالم.",
    },
    {
      pageNumber: 2,
      type: "story",
      image: coverImg,
      narrative: "سار البطل في دربه باحثاً عن المعرفة والأصدقاء. وكانت الطبيعة تبتسم له في كل خطوة.",
    },
    {
      pageNumber: 3,
      type: "story",
      image: coverImg,
      narrative: "سار بطلنا في طريق الاكتشاف والصداقة بتفاؤل. وتعلم أن التعاون يرسم أجمل البسمات.",
    },
    {
      pageNumber: 4,
      type: "story",
      image: coverImg,
      narrative: "أثمر قراره الصائب عن نجاح وفرح كبير. واحتفل الجميع بما حققه من إنجاز.",
    },
    {
      pageNumber: 5,
      type: "story",
      image: coverImg,
      narrative: "اختتم اليوم بحكاية جميلة تبقى في القلب. وغداً مغامرة جديدة تنتظرنا!",
    },
    {
      pageNumber: 6,
      type: "cover",
      image: coverImg,
      title: title,
    },
  ];
}
