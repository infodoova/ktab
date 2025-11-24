/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

import imgAI from "../../../assets/images/ai.png";
import imgListen from "../../../assets/images/listen.png";
import imgInteractive from "../../../assets/images/interactive.png";
import imgProgress from "../../../assets/images/progress.png";

const FEATURES = [
  {
    id: "ai",
    title: "مساعد ذكي لتبسيط المعرفة",
    desc: "لا تكتفِ بالقراءة السطحية. اسأل مساعد الذكاء الاصطناعي ليشرح لك الفقرات المعقدة، يلخص الفصول، أو يختبر فهمك لحظياً.",
    image: imgAI,
  },
  {
    id: "interactive",
    title: "مسارات قصصية تفاعلية",
    desc: "أنت بطل القصة. اتخذ قرارات مصيرية تغير مجرى الأحداث، واستمتع بنهايات متعددة تجعل كل قراءة تجربة جديدة كلياً.",
    image: imgInteractive,
  },
  {
    id: "audio",
    title: "استماع غامر أثناء التنقل",
    desc: "حوّل مكتبتك إلى بودكاست. استمتع بسرد صوتي طبيعي ومريح للأعصاب أثناء القيادة أو الرياضة دون إجهاد عينيك.",
    image: imgListen,
  },
  {
    id: "progress",
    title: "لوحة إنجازات متطورة",
    desc: "راقب نموك المعرفي. تتبع صفحاتك، ساعات القراءة، والكتب المنجزة برسوم بيانية جميلة ومحفزة.",
    image: imgProgress,
  },
];

export default function WhatAbout() {
  return (
    <section
      id="what-about"
      dir="rtl"
      className="w-full py-24 overflow-hidden bg-[var(--earth-cream)] relative"
    >
      {/* OPTIONAL: Global subtle noise or pattern here if desired */}
      
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* CONNECTING LINE (Desktop Only) - Guides the eye */}
        <div className="hidden md:block absolute top-40 bottom-20 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[var(--earth-olive)]/30 to-transparent dashed-line" />

        {/* HEADER */}
        <div className="text-center mb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--earth-brown-dark)] mb-6">
              تجربة قراءة{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[var(--earth-olive)]">استثنائية</span>
                {/* Subtle underline highlight */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[var(--earth-sand)] -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.4" />
                </svg>
              </span>
            </h2>

            <p className="text-lg md:text-2xl max-w-3xl mx-auto text-[var(--earth-brown)]/80 leading-relaxed">
              ندمج بين أصالة الكتاب الورقي وقوة التكنولوجيا الحديثة لنقدم لك منصة
              تفهمك وتتفاعل معك.
            </p>
          </motion.div>
        </div>

        {/* FEATURES SECTION */}
        <div className="flex flex-col gap-24 md:gap-40">
          {FEATURES.map((feature, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={feature.id}
                initial="hidden"
                whileInView="visible"
                // 'amount: 0.4' ensures animation triggers only when 40% of the item is visible
                viewport={{ once: true, amount: 0.4 }} 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
                className={`
                  relative flex flex-col items-center justify-between gap-12
                  ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
                `}
              >
                {/* TEXT SIDE */}
                <motion.div 
                  className="flex-1 text-center md:text-right space-y-6 relative z-10"
                  variants={{
                    hidden: { opacity: 0, x: isEven ? 50 : -50 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.8, ease: "easeOut" } 
                    }
                  }}
                >
                  {/* Feature Number / Icon placeholder (Optional) */}
                  <span className="inline-block px-4 py-1 rounded-full bg-[var(--earth-sand)]/20 text-[var(--earth-brown)] text-sm font-bold mb-2">
                    0{index + 1}
                  </span>

                  <h3 className="text-3xl md:text-5xl font-bold text-[var(--earth-brown-dark)]">
                    {feature.title}
                  </h3>

                  <p className="text-lg md:text-xl text-[var(--earth-brown)]/80 leading-loose max-w-xl mx-auto md:mx-0">
                    {feature.desc}
                  </p>
                </motion.div>

                {/* IMAGE SIDE */}
                <motion.div 
                  className="flex-1 w-full flex justify-center relative"
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, x: isEven ? -50 : 50 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      x: 0,
                      transition: { duration: 0.8, ease: "easeOut" } 
                    }
                  }}
                >
                  {/* ATMOSPHERIC GLOW (Behind Image) */}
                  <div className={`
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[140%] h-[140%] rounded-full blur-3xl -z-10 opacity-40
                    ${isEven ? 'bg-[var(--earth-sand)]' : 'bg-[var(--earth-olive)]/20'}
                  `} />

                  {/* Decorative Card Background */}
                  <div
                    className={`
                      hidden md:block
                      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[110%] h-[110%]
                      rounded-[2.5rem]
                      bg-[var(--earth-paper)]
                      border border-[var(--earth-sand)]/60
                      shadow-sm
                      -z-0
                      transition-transform duration-700
                      ${isEven ? "rotate-6 group-hover:rotate-3" : "-rotate-6 group-hover:-rotate-3"}
                    `}
                  />

                  {/* Main Image Container with Float Animation */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ 
                      duration: 4, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      delay: index * 1 // Stagger the floating effect so they don't all move in sync
                    }}
                    // CHANGED: Reduced sizes here
                    className="
                      relative z-10
                      overflow-hidden rounded-[2rem]
                      border-4 border-[var(--earth-paper)]
                      bg-[var(--earth-cream)]
                      shadow-2xl shadow-[var(--earth-shadow)]/20
                      aspect-square
                      w-[240px] h-[240px]        
                      md:w-[320px] md:h-[320px]
                      lg:w-[400px] lg:h-[400px]
                    "
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="
                        w-full h-full object-cover
                        transition-transform duration-700
                        hover:scale-110
                      "
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}