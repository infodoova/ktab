/* eslint-disable */
import { useRef, useState, useEffect, memo } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { BookOpen, Sparkles, Coffee, Globe } from "lucide-react";

import babyage from "../../../assets/images/babyage.png";
import teenage from "../../../assets/images/teenage.png";
import adultage from "../../../assets/images/adultage.png";
import oldage from "../../../assets/images/oldage.png";

import babyageDesktop from "../../../assets/images/babyageDesktop.png";
import teenageDesktop from "../../../assets/images/teenageDesktop.png";
import adultageDesktop from "../../../assets/images/adultageDesktop.png";
import oldageDesktop from "../../../assets/images/oldageDesktop.png";

/* ───────────────────────────────
   CARD DATA
─────────────────────────────────── */
const allSteps = {
  mobile: [
    { title: "للأطفال", subtitle: "بداية الخيال", text: "قصص مصوّرة وحكايات تفاعلية تبني مفردات الطفل وتغرس فيه حب الاستكشاف.", icon: Sparkles, img: babyage, color: "var(--earth-olive)" },
    { title: "لليافعين", subtitle: "عالم من المغامرة", text: "روايات خيال علمي وكتب تطوير ذات تواكب فضولهم وتجيب على أسئلتهم.", icon: BookOpen, img: teenage, color: "var(--earth-brown-dark)" },
    { title: "للكبار", subtitle: "واحة المعرفة", text: "كتب عميقة في شتى المجالات تعزز الفهم وترافق لحظات القهوة.", icon: Coffee, img: adultage, color: "var(--earth-sand-dark)" },
    { title: "للجميع", subtitle: "عالم يجمع القرّاء", text: "مكتبة رقمية تستقبل كل قارئ، من كل مكان، بمحتوى يناسب كل الأعمار.", icon: Globe, img: oldage, color: "var(--earth-olive-dark)" },
  ],
  desktop: [
    { title: "للأطفال", subtitle: "بداية الخيال", text: "قصص مصوّرة وحكايات تفاعلية تبني مفردات الطفل وتغرس فيه حب الاستكشاف.", icon: Sparkles, img: babyageDesktop, color: "var(--earth-olive)" },
    { title: "لليافعين", subtitle: "عالم من المغامرة", text: "روايات خيال علمي وكتب تطوير ذات تواكب فضولهم وتجيب على أسئلتهم.", icon: BookOpen, img: teenageDesktop, color: "var(--earth-brown-dark)" },
    { title: "للكبار", subtitle: "واحة المعرفة", text: "كتب عميقة في شتى المجالات تعزز الفهم وترافق لحظات القهوة.", icon: Coffee, img: adultageDesktop, color: "var(--earth-sand-dark)" },
    { title: "للجميع", subtitle: "عالم يجمع القرّاء", text: "مكتبة رقمية تستقبل كل قارئ، من كل مكان، بمحتوى يناسب كل الأعمار.", icon: Globe, img: oldageDesktop, color: "var(--earth-olive-dark)" },
  ],
};

/* ───────────────────────────────
   CARD (Memoized & Lightweight)
─────────────────────────────────── */
const Card = memo(function Card({ i, title, text, subtitle, color, img, Icon, scaleValue, imageScaleValue }) {
  return (
    <div
      id="age"
      className="relative h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale: scaleValue,
          top: `calc(5vh + ${i * 20}px)`,
          transformOrigin: "center top",
          willChange: "transform"
        }}
        className="relative flex flex-col items-center justify-center w-[95%] h-[80vh] md:w-[90%] md:h-[80vh] max-w-[1600px]"
      >
        <div
          dir="rtl"
          style={{ backgroundColor: "var(--earth-paper)", borderColor: "var(--earth-brown)" }}
          className="relative w-full h-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-4 shadow-2xl"
        >
          {/* IMAGE */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ scale: imageScaleValue, willChange: "transform" }}
          >
            <img src={img} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>

          {/* TEXT */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-16 text-right">
            <div className="absolute top-12 right-12 flex items-center gap-4">
              <div className="p-4 text-white rounded-full shadow-xl" style={{ backgroundColor: color }}>
                <Icon size={28} />
              </div>

              <span
                style={{
                  color: "var(--earth-brown-dark)",
                  backgroundColor: "var(--earth-sand-dark)"
                }}
                className="font-extrabold tracking-wide text-md uppercase px-6 py-3 rounded-full shadow-lg backdrop-blur-sm"
              >
                {subtitle}
              </span>
            </div>

            <div className="relative z-10 max-w-2xl ml-auto mb-4">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-xl">{title}</h2>
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed drop-shadow-md">{text}</p>
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
    offset: ["start start", "end end"]
  });

  return (
    <main
      ref={container}
      id="age"
      className="relative"
      style={{ backgroundColor: "var(--earth-cream)" }}
      dir="rtl"
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-28 md:py-40 text-center">
        <span className="inline-block text-xl md:text-2xl font-bold mb-4 px-4 py-1 border-b-4 border-[var(--earth-olive)] text-[var(--earth-olive)]">
          لكل قارئ فيك
        </span>
        <h2 className="text-6xl md:text-8xl font-black mb-6 leading-tight text-[var(--earth-brown-dark)]">
          مكتبة لكل الأعمار
        </h2>
        <p className="text-xl md:text-2xl max-w-4xl mx-auto font-medium text-[var(--earth-brown)]">
          محتوى مُنسّق بعناية ليرافق القارئ في كل مرحلة من مراحل حياته.
        </p>
      </div>

      {/* STACKED CARDS */}
      <div className="pb-[40vh]">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;

          // derive transforms ONCE here
          const scaleValue = useTransform(scrollYProgress, [i * 0.25, (i + 1) * 0.25 + 0.05], [1, targetScale]);
          const imageScaleValue = useTransform(scrollYProgress, [i * 0.25, (i + 1) * 0.25], [2, 1]);

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
