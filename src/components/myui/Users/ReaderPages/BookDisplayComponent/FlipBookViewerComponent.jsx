import React, { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

/* ---------------- DUMMY BOOK CONTENT ---------------- */
const DUMMY_TEXT = `
في بداية الرحلة، كان كل شيء يبدو ساكناً؛ الكثبان الرملية تمتد إلى الأفق بلا نهاية، والسماء العالية تعكس وهج الشمس كمرآة من نار. ومع ذلك، كانت هناك قصة تنتظر من يكتشفها بين تلك الرمال التي تحفظ أسرارها في صمت عميق. يوسف، الذي اختار الطريق دون أن يفهم سببه تماماً، شعر بأن الصحراء تناديه منذ سنوات، تصرخ باسمه في أحلامه، وتلوّح له بأن هناك شيئاً يخصه هنا، تحت هذا الاتساع المهيب.

منذ اللحظة الأولى لخطوته في الرمال، عاد إليه طيف من طفولته القديمة، عندما كان يركض في الحقول مع رفاقه، يحلم بأن يصبح رحّالة يقرأ العالم بقدميه لا بكتبه. في تلك الأيام كان يشعر أن الحياة بسيطة، وأن قلبه قادر على حمل الكون كله دون أن يرتجف. لكن الزمن تغيّر، واليوم وجد نفسه وحيداً بين كثبان لا تعرف الرحمة، يبحث عن شيء ربما لا يعرف اسمه.

حين اقترب أكثر من الواحة، لاحظ أن الرياح تغيّر اتجاهها كما لو أنها ترحب به. سمع قصصاً منذ صغره عن تلك الواحة؛ عن نخيلها الذي يُقال إنه ينحني إذا مرّ شخص صادق القلب، وعن مياهها التي تُظهر للإنسان ما يخفيه عن نفسه. كان يشعر بالرهبة، لكنه استمر في السير، فبعض الطرق لا يُسمَح لنا بالعودة منها مهما حاولنا.

جلس يوسف عند الغروب بجانب نخلة عتيقة تشبه شيخاً يروي حكاياته للمسافرين. اللون البرتقالي الذي غمر السماء جعل الصحراء تبدو كبحر ملتهب. سمع صوت خرير الماء من بعيد، همساً خفيفاً أقرب إلى نبض الحياة. أغمض عينيه، وتذكر والدته وهي تحكي له عن أجداده الذين عبروا الرمال بحثاً عن معنى، عن مكان، عن حلم… وربما كانوا يبحثون عنه هو أيضاً.

في اليوم التالي، التقى قافلة من المسافرين. رجال ونساء من دول بعيدة، يجمعهم شغف واحد: أن يجدوا أنفسهم في مكان لا يعرفهم فيه أحد. جلسوا حول نار المخيم، يشاركون قصصهم. هناك رجلٌ ترك كل شيء خلفه بحثاً عن ابنه، وامرأة تهرب من حرب، وفتى يبحث عن والده الذي لم يره منذ سنوات. تلك الليلة فهم يوسف شيئاً جوهرياً: أن البشر مهما اختلفت رحلاتهم، يحملون الواحات ذاتها في قلوبهم؛ واحات من الحنين، من الألم، ومن الأمل أيضاً.

تعلم من الصحراء الصبر، وتعلم من الرياح أن الحقيقة ليست دائماً صاخبة، بل تأتي همساً. لم تعد الوحدة تخيفه كما كانت، بل أصبحت مرآة يرى فيها ما كان يخشى النظر إليه. كان يسير ويشعر أن خطواته لم تعد تعلّمه الطريق، بل تكشف له طريقاً داخله.

ومع كل شروق شمس جديد، كان يوسف ينضج، يهدأ، ويزداد قرباً من معنى لم يعد يخاف منه. أدرك أن النهاية التي يبحث عنها ليست سوى بداية أخرى، وأن المغامرة الحقيقية تبدأ حين نجرؤ على سؤال أنفسنا عمّا نخشى مواجهته.

وفي صباح اليوم الثالث، وبينما كان يسير نحو الجهة الشرقية من الواحة، لمح من بعيد شيئاً يلمع بين الرمال. اقترب منه بحذر، فوجد صندوقاً قديماً نصفه مدفون تحت التراب. كان الخشب متشقّقاً، والحديد يعلوه الصدأ، لكنه ظل محتفظاً بطابع غامض يليق بكنز نسيه الزمن. تردّد يوسف لحظة، ثم مدّ يده وفتح الصندوق… لكن ما وجده جعل قلبه يرتجف أكثر مما توقع.

لم يجد ذهباً، ولا مجوهرات، بل وجد مجموعة من الرسائل القديمة، مكتوبة بخط يد شاعر أو عاشق أو حكيم. كانت الرسائل تتحدث عنه — عنه هو — عن طفل سيأتي بعد أجيال، سيعبر الصحراء وحيداً، وسيجد نفسه حين يظن أنه ضائع. لم يفهم يوسف كيف وصلت تلك الكلمات إلى هنا منذ زمن لم يكن فيه موجوداً بعد، لكنه شعر أن الصحراء أرادت أن تذكّره بشيء: أن الإنسان ليس مجرد مسافر فوق الأرض، بل هو أيضاً مسافر عبر زمان لم يخلقه بيديه.

أغلق يوسف الصندوق، وحمله معه. لم يعد يبحث عن كنز، بل أصبح يحمل رسالة. رسالة تعلّمه أن يواجه خوفه، أن يستمع إلى قلبه، وأن يمشي مهما طال الدرب. ومن تلك اللحظة، لم تعد الصحراء بالنسبة له مجرد أرض، بل أصبحت معلّمة، وصديقة، ووطن ثانٍ يولد فيه كل صباح.

ومع كل خطوة جديدة، كان يشعر أن حياته تتشكل من جديد، ببطء، بحكمة، وبلغة لا يسمعها إلا من يعبر الرمال بقلب مفتوح.
`;

/* ---------------- HELPERS ---------------- */
function splitTextByWords(text, wordsPerPage = 300) {
  const words = text.trim().split(/\s+/);
  const pages = [];
  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }
  return pages;
}

/* ---------------- PAGE ---------------- */
const Page = forwardRef(({ number, children }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white border-r border-gray-200 overflow-hidden"
   
    >
      <div className="h-full p-6 flex flex-col bg-white/70 backdrop-blur-sm">
        <div className="flex-grow flex flex-col justify-center text-center">
          <div className="font-serif leading-8 " style={{ fontSize: "13px" }}>
            <span className="block text-[13px]">{children}</span>
          </div>
        </div>

        {number && (
          <div className="mt-3 flex justify-center">
            <span className="text-xs text-gray-400 font-serif">{number}</span>
          </div>
        )}
      </div>
    </div>
  );
});

/* ---------------- BOOK SKELETON ---------------- */
const BookSkeleton = ({ width, height }) => (
  <div
    className="flex items-center justify-center w-full h-full absolute inset-0 z-40"
    style={{ pointerEvents: "none", direction: "rtl" }}
  >
    <div
      className="relative flex shadow-2xl rounded-xl overflow-hidden"
      style={{
        width: width || 550,
        height: height || 380,
        background: "linear-gradient(90deg,#f5f5f5 0%,#fafafa 50%,#f5f5f5 100%)",
      }}
    >
      <div className="w-1/2 h-full bg-gray-100 animate-pulse" />
      <div className="w-[4px] bg-gray-300" />
      <div className="w-1/2 h-full bg-gray-100 animate-pulse" />
    </div>
  </div>
);

/* ---------------- VIEWER ---------------- */
export default function FlipBookViewer({ bookRef, isRTL = true }) {
  const containerRef = useRef(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Auto-hide skeleton after 1 sec
useEffect(() => {
  const t = setTimeout(() => {
    setShowFlipbook(true);
    setShowSkeleton(false); // ✅ Hide skeleton
  }, 1000);
  return () => clearTimeout(t);
}, []);


  /* Scroll-to-Flip */
  useEffect(() => {
    const handleWheel = (e) => {
      if (!bookRef.current) return;
      e.preventDefault();
      try {
        const flip = bookRef.current.pageFlip();
        if (e.deltaY > 0) {
          isRTL ? flip.flipPrev() : flip.flipNext();
        } else {
          isRTL ? flip.flipNext() : flip.flipPrev();
        }
      } catch {
        //
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [bookRef, isRTL]);

  const getBookHeight = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 420;
    if (w < 700) return window.innerHeight * 0.35;
    if (w < 1200) return window.innerHeight * 0.55;
    return window.innerHeight * 0.85;
  };

  // Force 100 words per page across all screens
  const wordsPerPage = 100;

  // Expose a goToPage method on the external bookRef so parent/header can teleport with animation
  useEffect(() => {
    if (!bookRef || !bookRef.current) return;
    // attach only when flipbook is mounted (showFlipbook)
    const attach = () => {
      try {
        bookRef.current.goToPage = (pageNumber) => {
          try {
            const flip = bookRef.current.pageFlip();
            // convert 1-based page number to 0-based index expected by the flip API
            const targetIndex = Math.max(0, (Number(pageNumber) || 1) - 1);
            if (flip && typeof flip.flip === "function") {
              flip.flip(targetIndex);
            } else if (flip && typeof flip.turnToPage === "function") {
              flip.turnToPage(targetIndex);
            }
          } catch  {
            // no-op fallback
          }
        };
      } catch {
        //
      }
    };
    attach();
  }, [bookRef, showFlipbook]);

  const paginatedText = splitTextByWords(DUMMY_TEXT, wordsPerPage);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ direction: "rtl" }}
    >
      {showSkeleton && !showFlipbook && (
        <BookSkeleton
          width={Math.min(window.innerWidth * 0.45, 800)}
          height={getBookHeight()}
        />
      )}

      {showFlipbook && (
        <HTMLFlipBook
          width={Math.min(window.innerWidth * 0.45, 800)}
          height={getBookHeight()}
          size="stretch"
          minWidth={250}
          minHeight={300}
          maxWidth={900}
          maxHeight={700}
          mobileScrollSupport
          flippingTime={500}
          usePortrait
          startPage={0}
          ref={bookRef}
          maxShadowOpacity={0.25}
          className="overflow-hidden rounded-xl"
          style={{ direction: "rtl" }}
          flipDirection="rtl"
        >
          {/* FIRST PAGE — COVER PAGE */}
          <Page
            number={1}
            bgImage="https://images.pexels.com/photos/17567462/pexels-photo-17567462.jpeg"
          >
            <h2 className="text-3xl font-serif  drop-shadow mb-3">
              أسرار الواحة
            </h2>
            <p className=" text-lg drop-shadow">د. إبراهيم الكوني</p>
          </Page>

          {/* TEXT PAGES */}
          {paginatedText.map((pageText, idx) => (
            <Page key={idx + 2} number={idx + 2}>
              <p style={{ textAlign: "justify", whiteSpace: "pre-line" }}>
                {pageText}
              </p>
            </Page>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
}
