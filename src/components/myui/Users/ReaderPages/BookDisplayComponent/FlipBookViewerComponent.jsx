import React, { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

/* ---------------- PAGE ---------------- */
function splitTextByWords(text, wordsPerPage = 300) {
  const words = text.trim().split(/\s+/);
  const pages = [];
  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(' '));
  }
  return pages;
}

const Page = forwardRef(({ number, children }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white border-r border-gray-200 overflow-hidden"
      style={{ direction: "rtl" }}
    >
      <div className="h-full p-6 flex flex-col">
        <div className="flex-grow flex flex-col justify-center text-center">
          <div
            className="font-serif leading-8 text-gray-700"
            style={{
              fontSize: '13px', // fallback if class below doesn't override
            }}
          >
            {/* Responsive font size classes - mobile smaller! */}
            <span className="block text-[13px]">
              {children}
            </span>
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

/* --- Custom scrollbar CSS --- */
const style = document.createElement("style");
style.innerHTML = `
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}
`;
document.head.appendChild(style);

/* ---------------- COVER ---------------- */
const Cover = ({ image, title, subtitle, onClick, animateOut }) => {
  return (
    <div
      className={
        `absolute inset-0 flex items-center justify-center transition-transform transition-opacity duration-700 ease-in-out z-50 ` +
        (animateOut ? 'scale-110 opacity-0 pointer-events-none' : 'scale-100 opacity-100')
      }
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer', background: 'none' }}
    >
      <div className={
        "relative shadow-2xl rounded-3xl overflow-hidden w-72 h-[420px] flex flex-col items-center justify-center group bg-black " +
        "hover:scale-105 hover:shadow-3xl transition-transform duration-300"}
      >
        <img
          src={image.trim()}
          alt="Cover"
          className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
             style={{
               background: 'rgba(20, 24, 34, 0.45)',
               backdropFilter: 'blur(6px)',
               WebkitBackdropFilter: 'blur(6px)',
               borderRadius: 'inherit'
             }}
        >
          <h1 className="text-white drop-shadow-lg text-3xl font-serif mb-3 tracking-wide font-bold">
            {title}
          </h1>
          {subtitle && <p className="text-gray-200 text-base mb-2 drop-shadow-sm">{subtitle}</p>}
          <span className="mt-8 text-white bg-gradient-to-r from-pink-600/80 to-sky-500/80 px-4 py-1 rounded-2xl shadow font-semibold animate-pulse">
            اضغط لفتح الكتاب
          </span>
        </div>
      </div>
    </div>
  );
};

// SKELETON
const BookSkeleton = ({height, width}) => (
  <div
    className="flex items-center justify-center w-full h-full absolute inset-0 z-40"
    style={{ pointerEvents: 'none', direction: 'rtl' }}
  >
    <div
      className="relative rounded-3xl bg-gradient-to-tr from-gray-200/70 to-gray-100/90 shadow-inner flex flex-col items-center justify-center"
      style={{width: width || 288, height: height || 420}}
    >
      <div className="w-3/5 h-5 my-4 rounded bg-gray-300 animate-pulse" />
      <div className="w-4/5 h-3 rounded bg-gray-200 mb-4 animate-pulse" />
      <div className="w-5/6 h-32 rounded-lg bg-gray-300 animate-pulse" />
      <div className="w-2/6 h-4 my-6 rounded bg-gray-200 animate-pulse" />
      <div className="w-[80%] h-8 mt-8 bg-gradient-to-r from-slate-400/80 via-gray-100/70 to-slate-300/80 rounded-lg animate-pulse" />
    </div>
  </div>
);

// --- Dummy Book Content (for demo: replace with real content later) ---
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

// -- END PAGE COMPONENT --
const EndPage = ({ onReturnToCover }) => (
  <div
    className="h-full w-full flex flex-col items-center justify-center bg-white text-center"
    style={{ minHeight: 300, direction: "rtl" }}
  >
    <div className="rounded-xl shadow-md bg-white px-10 py-16 border border-gray-200 max-w-md w-full">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
        النهاية
      </h1>

      <p className="text-base md:text-lg text-gray-500 font-serif mb-10">
        نتمنى أن تكون رحلتك مع هذا الكتاب ممتعة ومُلهمة
      </p>

      <button
        onClick={onReturnToCover}
        className="px-8 py-2 rounded-full bg-indigo-600 text-white font-medium text-lg shadow-sm hover:bg-indigo-700 transition"
      >
        العودة إلى الغلاف
      </button>
    </div>
  </div>
);

/* ---------------- VIEWER ---------------- */
export default function FlipBookViewer({ bookRef, isRTL = true }) {
  const containerRef = useRef(null);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [coverAnim, setCoverAnim] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

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
      } catch (err) {
        console.error("Flip error:", err.message);
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
    // On desktop (lg: ≥1024), match the cover h-[420px]
    if (w >= 1024) return 420;
    if (w < 700) return window.innerHeight * 0.35;
    if (w < 1200) return window.innerHeight * 0.55;
    return window.innerHeight * 0.85;
  };

  // Set words per page based on window width
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const wordsPerPage = isMobile ? 100 : 200;
  const paginatedText = splitTextByWords(DUMMY_TEXT, wordsPerPage);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ direction: "rtl" }}
    >
      {!showFlipbook && !showSkeleton && (
        <Cover
          image="https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg"
          title="أسرار الواحة"
          subtitle="رحلة في المجهول"
          animateOut={coverAnim}
          onClick={() => {
            setCoverAnim(true);
            setTimeout(() => {
              setShowSkeleton(true);
              setTimeout(() => {
                setShowFlipbook(true);
                setShowSkeleton(false);
              }, 1200); // skeleton show duration
            }, 650); // Cover animation duration
          }}
        />
      )}
      {showSkeleton && (
        <BookSkeleton width={Math.min(window.innerWidth * 0.45, 800)} height={getBookHeight()} />
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
          {/* Title Page */}
          <Page number={1}>
            <h2 className="text-2xl font-serif text-gray-700">
              أسرار الواحة المنسية
            </h2>
            <p className="mt-2 text-gray-500">د. إبراهيم الكوني</p>
          </Page>
          {/* Dynamic Book Content Pages */}
          {paginatedText.map((pageText, idx) => (
            <Page key={idx+2} number={idx + 2}>
              <p style={{textAlign: 'justify', whiteSpace: 'pre-line'}}>{pageText}</p>
            </Page>
          ))}
          {/* END PAGE */}
          <Page number={null}>
            <EndPage onReturnToCover={() => {
              if (bookRef.current && bookRef.current.pageFlip) {
                try {
                  bookRef.current.pageFlip().flip(0);
                } catch {
                  // fallback for direct flip method
                  if (bookRef.current.flip) bookRef.current.flip(0);
                }
              }
            }} />
          </Page>
        </HTMLFlipBook>
      )}
    </div>
  );
}
