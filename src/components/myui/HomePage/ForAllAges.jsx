/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

import { BookOpen, Sparkles, GraduationCap, Coffee } from "lucide-react";

import babyage from "../../../assets/images/babyage.png";
import teenage from "../../../assets/images/teenage.png";
import adultage from "../../../assets/images/adultage.png";
import teacherage from "../../../assets/images/teacherage.png";

/* -------------------------------------------
    DATA
------------------------------------------- */
const steps = [
  {
    title: "للأطفال",
    subtitle: "بداية الخيال",
    text: "قصص مصوّرة وحكايات تفاعلية تبني مفردات الطفل وتغرس فيه حب الاستكشاف منذ الصغر.",
    icon: Sparkles,
    imgSrc: babyage,
  },
  {
    title: "لليافعين",
    subtitle: "عالم من المغامرة",
    text: "روايات خيال علمي وكتب تطوير ذات تواكب فضولهم وتجيب على تساؤلاتهم المتزايدة.",
    icon: BookOpen,
    imgSrc: teenage,
  },
  {
    title: "للكبار",
    subtitle: "واحة المعرفة",
    text: "مكتبة عربية وعالمية ثرية تناسب استراحة القهوة، وتعمّق الفهم في شتى المجالات.",
    icon: Coffee,
    imgSrc: adultage,
  },
  {
    title: "للمعلّمين",
    subtitle: "شريك التعليم",
    text: "أدوات تتبع دقيقة وموارد تعليمية مساندة تساعد في بناء جيل قارئ ومثقف.",
    icon: GraduationCap,
    imgSrc: teacherage,
  },
];

export default function ForAllAgesPro() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  /* Scroll control */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const stepLength = 1 / steps.length;
    const idx = Math.min(Math.floor(v / stepLength), steps.length - 1);
    setActiveStep(idx);
  });

  const verticalLineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full bg-[var(--earth-cream)]"
      style={{ height: `${steps.length * 100}vh` }}
    >

      <div className="sticky top-0 h-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* MOBILE FULLSCREEN IMAGE - Moved inside the sticky container */}
        <div className="absolute inset-0 md:hidden">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={activeStep}
              src={steps[activeStep].imgSrc}
              alt={steps[activeStep].title}
              initial={{ opacity: 0, scale: 1.0 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        {/* DESKTOP LAYOUT elements (Timeline, Dots, Text Block, Image Side) */}
        
        {/* DESKTOP TIMELINE */}
        <div className="hidden md:block absolute right-10 top-[18%] bottom-[18%] w-[3px] bg-[var(--earth-brown)]/20 rounded-full overflow-hidden">
          <motion.div
            style={{ height: verticalLineHeight }}
            className="w-full bg-[var(--earth-olive)]"
          />
        </div>

        {/* DESKTOP DOTS */}
        <div className="hidden md:flex absolute right-[34px] top-[18%] bottom-[18%] flex-col justify-between">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`
                rounded-full border-[3px] transition-all duration-300
                ${
                  i <= activeStep
                    ? "w-5 h-5 bg-[var(--earth-olive)] border-[var(--earth-olive)]"
                    : "w-4 h-4 bg-white border-[var(--earth-brown)]/20"
                }
              `}
            />
          ))}
        </div>

        {/* MOBILE + DESKTOP TEXT BLOCK */}
        <div className="relative w-full md:w-1/2 h-full flex items-center justify-center z-20 px-6">

          {/* Mobile Glass Card */}
          <div className="
            md:hidden
            absolute bottom-10 inset-x-4
            bg-white/15 backdrop-blur-xl
            rounded-3xl p-6 
            border border-white/20 shadow-xl
          ">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.45 }}
                className="text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center p-4 rounded-2xl mb-4 text-white bg-[var(--earth-olive)] shadow-md mx-auto">
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon size={24} />;
                  })()}
                </div>

                <h4 className="text-sm font-bold text-white/70 mb-1">
                  {steps[activeStep].subtitle}
                </h4>

                <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
                  {steps[activeStep].title}
                </h2>

                <p className="text-white/95 text-lg leading-relaxed">
                  {steps[activeStep].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DESKTOP TEXT BLOCK */}
          <div className="hidden md:block w-full max-w-lg text-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className="inline-flex items-center justify-center p-4 rounded-2xl mb-6 text-white bg-[var(--earth-olive)]">
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon size={28} />;
                  })()}
                </div>

                <h4 className="text-sm font-bold text-[var(--earth-brown)]/60 mb-1">
                  {steps[activeStep].subtitle}
                </h4>

                <h2 className="text-5xl font-extrabold text-[var(--earth-brown-dark)] mb-6 leading-tight font-[family-name:var(--font-arabic)]">
                  {steps[activeStep].title}
                </h2>

                <p className="text-xl text-[var(--earth-brown)]/90 leading-relaxed">
                  {steps[activeStep].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* DESKTOP IMAGE SIDE */}
        <div className="hidden md:block relative w-1/2 h-full overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeStep}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              
            >
              <img
                src={steps[activeStep].imgSrc}
                alt={steps[activeStep].title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[var(--earth-brown)]/15 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[var(--earth-olive)]/15" />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}