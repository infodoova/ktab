/* eslint-disable */
import { useRef, useState, useEffect, memo } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { BookOpen, Sparkles, Coffee, Globe } from "lucide-react";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";
import a1 from "../../../assets/images/a1.png";
import a2 from "../../../assets/images/a2.png";
import a3 from "../../../assets/images/a3.png";
import a4 from "../../../assets/images/a4.png";
import a1mob from "../../../assets/images/a1mob.png";
import a2mob from "../../../assets/images/a2mob.png";
import a3mob from "../../../assets/images/a3mob.png";
import a4mob from "../../../assets/images/a4mob.png";

/* ───────────────────────────────
   CARD DATA
─────────────────────────────────── */
const allSteps = {
  mobile: [
    {
      title: "للأطفال",
      subtitle: "بداية الخيال",
      text: "قصص مصوّرة وحكايات تفاعلية تبني مفردات الطفل وتغرس فيه حب الاستكشاف.",
      icon: Sparkles,
      img: a1mob,
      color: "var(--primary-button)",
    },
    {
      title: "لليافعين",
      subtitle: "عالم من المغامرة",
      text: "رويات علمية وتفاعلية حيث يمكنك تغيير مسار القصة واتخاذ قرارات تؤثر على تطور الأحداث، مع إمكانية تتبع تقدمك والتمتع بتجربة فريدة تناسب اهتماماتك.",
      icon: BookOpen,
      img: a2mob,
      color: "var(--primary-border)",
    },
    {
      title: "للكبار",
      subtitle: "واحة المعرفة",
      text: "كتب علمية وفكرية تعزز الفهم العميق وتفتح آفاقاً جديدة لانتقاء القراءات، مع تقديم مسار مرن يتيح لك تغيير مجريات الأحداث كما تحب.",
      icon: Coffee,
      img: a3mob,
      color: "var(--primary-button)",
    },
    {
      title: "للجميع",
      subtitle: "عالم يجمع القرّاء",
      text: "مكتبة رقمية تتيح لكل قارئ الاستمتاع بتجربة قراءة مميزة، حيث يمكن الوصول إلى المحتوى في أي وقت ومن أي مكان، مع خيارات تتناسب مع كل الأعمار والاهتمامات.",
      icon: Globe,
      img: a4mob,
      color: "var(--primary-button)",
    },
  ],
  desktop: [
    {
      title: "للأطفال",
      subtitle: "بداية الخيال",
      text: "قصص مصوّرة وحكايات تفاعلية تبني مفردات الطفل وتغرس فيه حب الاستكشاف.",
      icon: Sparkles,
      img: a1,
      color: "var(--primary-button)",
    },
    {
      title: "لليافعين",
      subtitle: "عالم من المغامرة",
      text: "رويات علمية وتفاعلية حيث يمكنك تغيير مسار القصة واتخاذ قرارات تؤثر على تطور الأحداث، مع إمكانية تتبع تقدمك والتمتع بتجربة فريدة تناسب اهتماماتك  ",
      icon: BookOpen,
      img: a2,
      color: "var(--primary-border)",
    },
    {
      title: "للكبار",
      subtitle: "واحة المعرفة",
      text: "كتب علمية وفكرية تعزز الفهم العميق وتفتح آفاقاً جديدة لانتقاء القراءات، مع تقديم مسار مرن يتيح لك تغيير مجريات الأحداث كما تحب.",
      icon: Coffee,
      img: a3,
      color: "var(--primary-button)",
    },
    {
      title: "للجميع",
      subtitle: "عالم يجمع القرّاء",
      text: "مكتبة رقمية تتيح لكل قارئ الاستمتاع بتجربة قراءة مميزة، حيث يمكن الوصول إلى المحتوى في أي وقت ومن أي مكان، مع خيارات تتناسب مع كل الأعمار والاهتمامات.",
      icon: Globe,
      img: a4,
      color: "var(--primary-button)",
    },
  ],
};

/* ───────────────────────────────
   CARD
─────────────────────────────────── */
const Card = memo(function Card({
  i,
  title,
  text,
  subtitle,
  color,
  img,
  Icon,
  scaleValue,
  imageScaleValue,
}) {
  return (
    <div
      id="age"
      className="relative h-screen bg-[var(--bg-dark)] flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale: scaleValue,
          top: `calc(5vh + ${i * 20}px)`,
          transformOrigin: "center top",
          willChange: "transform",
        }}
        className="relative flex flex-col items-center justify-center w-[95%] h-[80vh] md:w-[90%] md:h-[80vh] max-w-[1600px]"
      >
        <div
          dir="rtl"
          className="relative w-full h-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/10 bg-[var(--bg-card)] shadow-2xl"
        >
          {/* IMAGE */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ scale: imageScaleValue, willChange: "transform" }}
          >
            <ResponsiveImageSkeleton
              src={img}
              alt={title}
              className="w-full h-full"
              imgClassName="object-cover"
              rounded="rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>

          {/* TEXT */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-16 text-right">
            <div className="absolute top-12 right-12 flex items-center gap-4">
              <div
                className="p-4 text-white rounded-full shadow-xl"
                style={{ backgroundColor: color }}
              >
                <Icon size={28} />
              </div>

              <span className="font-black tracking-widest text-xs uppercase px-6 py-3 rounded-full shadow-lg backdrop-blur-md bg-[var(--bg-surface)]/90 text-white border border-white/10">
                {subtitle}
              </span>
            </div>

            <div className="relative z-10 max-w-2xl ml-auto mb-4">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-xl">
                {title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed drop-shadow-md">
                {text}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

/* ───────────────────────────────
   MAIN SECTION
─────────────────────────────────── */
export default function ForAllAges() {
  const container = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const resize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const projects = isDesktop ? allSteps.desktop : allSteps.mobile;

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main
      ref={container}
      id="age"
      className="relative bg-[var(--bg-dark)]
"
      dir="rtl"
    >
      {/* HEADER SECTION - Unified Design */}
      <div className="max-w-7xl mx-auto px-6 py-28 md:py-40 text-center relative z-10">
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-[var(--secondary-text)] tracking-tight">
          مكتبة لكل{" "}
          <span className="text-[var(--primary-button)]">الأعمار</span>
        </h2>

        <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-medium text-[var(--secondary-text)] leading-relaxed">
          من خلال مكتبتك الرقمية الذكية، تابع تقدمك، استمتع بالقصص التفاعلية،
          واستمتع بالقراءة كما لم تفعل من قبل
        </p>
      </div>

      {/* STACKED CARDS */}
      <div>
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;

          const scaleValue = useTransform(
            scrollYProgress,
            [i * 0.25, (i + 1) * 0.25 + 0.05],
            [1, targetScale],
          );

          const imageScaleValue = useTransform(
            scrollYProgress,
            [i * 0.25, (i + 1) * 0.25],
            [2, 1],
          );

          return (
            <Card
              key={project.title}
              i={i}
              {...project}
              Icon={project.icon}
              scaleValue={scaleValue}
              imageScaleValue={imageScaleValue}
            />
          );
        })}
      </div>
    </main>
  );
}
