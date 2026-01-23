/* eslint-disable */
import React from "react";
import { motion } from "framer-motion";
import imgAI from "../../../assets/images/ai.png";
import imgListen from "../../../assets/images/listen.png";
import imgInteractive from "../../../assets/images/interactive.png";
import imgProgress from "../../../assets/images/progress.png";
import ResponsiveImageSkeleton from "../imageSkeletonLoaderCP";

const FEATURES = [
  {
    id: "ai",
    title: "مساعد ذكي لتبسيط المعرفة",
    desc: "القارئ لم يعد مضطرًا للبحث خارج الكتاب عن تفسير أو شرح أو تلخيص. مساعد كُتّاب الذكي يتفاعل معك داخل التجربة نفسها—يفهم الفقرة التي تقرأها، يبسّط المعاني الصعبة، يقدّم أمثلة توضيحية، ويولّد أسئلة اختبار لفهمك. ليس مجرد روبوت؛ بل مدرس خاص يعمل بالذكاء الاصطناعي، حاضر معك في كل صفحة، يصنع لك تجربة تعلم سلسة، شخصية، وسريعة.",
    image: imgAI,
  },
  {
    id: "interactive",
    title: "مسارات قصصية تفاعلية",
    desc: "القراءة هنا ليست مجرد تقليب صفحات… بل مغامرة تتغيّر وفق قراراتك. اختر مسارك، واجه المواقف، واتخذ الخيارات التي تغيّر النهاية كليًا. كل قصة تحتوي على نقاط تفرّع تجعل كل إعادة قراءة مختلفة عن السابقة، مما يخلق تجربة غامرة تشبه اللعب، ويحوّل القارئ من متلقٍ سلبي إلى مشارك أساسي في بناء الأحداث.",
    image: imgInteractive,
  },
  {
    id: "audio",
    title: "استماع غامر أثناء التنقل",
    desc: "لا حاجة للتوقّف عن القراءة بسبب الانشغال. اضغط زرًا واحدًا، وسيتحوّل أي كتاب إلى تجربة صوتية طبيعية بفضل محرّك القراءة البشرية. يمكنك متابعة رحلتك المعرفية في السيارة، في النادي، أو أثناء ترتيب المنزل—بجودة صوت نقية ووتيرة تراعي راحتك. صُمّم هذا الأسلوب ليجعل المعرفة مرافقة لك طوال اليوم دون أي مجهود بصري.",
    image: imgListen,
  },
  {
    id: "progress",
    title: "لوحة إنجازات متطورة",
    desc: "لكل قارئ رحلة، ولكل رحلة إنجازات. كُتّاب يقدم لوحة متابعة ذكية تعرض تقدّمك بأسلوب بصري جميل—الصفحات التي قرأتها، الساعات التي قضيتها، الكتب التي أنهيتها، والمستويات التي حققتها. تتلقى شارات تحفيزية، تحديات أسبوعية، وتنبيهات ذكية تساعدك على بناء عادة قراءة مستمرة. هنا، لا تحفظ المعلومات فقط… بل ترى أثرها ينبض أمامك.",
    image: imgProgress,
  },
];

export default function WhatAbout() {
  return (
    <section
      id="what-about"
      dir="rtl"
      className="relative py-32 overflow-hidden bg-[var(--bg-dark)]"
    >
      {/* --- LIGHTWEIGHT BACKGROUND EFFECT (Optimized for Performance) --- */}

      {/* 1. Static Gradient Base (Replaces heavy moving blobs) */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 15% 50%, rgba(var(--primary-button-rgb, 139, 92, 246), 0.15), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.1), transparent 25%)
          `,
        }}
      />

      {/* 2. The Grid Pattern (Clean & Fast) */}
      <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      {/* --- CONTENT --- */}

      {/* HEADER SECTION */}
      <div className="text-center mb-24 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
      

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[var(--secondary-text)] tracking-tight">
            كيف تبدو{" "}
            <span className=" bg-clip-text text-[var(--primary-button)]">
              التجربة؟
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-[var(--secondary-text)]/60 font-medium leading-relaxed">
            رحلة قراءة مصمّمة بهدوء، تتكشف خطوةً خطوة عبر مسارات تفاعلية مذهلة.
          </p>
        </motion.div>
      </div>

      {/* STEPS */}
      <div className="max-w-6xl mx-auto px-6 space-y-36 relative z-10">
        {/* CENTRAL PATH - Gradient Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] hidden md:block overflow-hidden z-0">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-[var(--primary-button)]/30 to-transparent" />
        </div>

        {FEATURES.map((f, i) => {
          const right = i % 2 === 0;

          return (
            <div
              key={f.id}
              className="relative md:flex md:items-center gap-20 z-10"
            >
              {/* HORIZONTAL BRIDGE */}
              <div
                className={`
                  hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-[var(--primary-button)]/30 to-transparent
                  ${right ? "left-1/2 right-[calc(50%+120px)] bg-gradient-to-r" : "right-1/2 left-[calc(50%+120px)] bg-gradient-to-l"}
                  z-0
                `}
              />

              {/* IMAGE (Restored User's Images) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`
                  mb-10 md:mb-0
                  mx-auto md:mx-0
                  w-44 h-44 md:w-60 md:h-60
                  rounded-full overflow-hidden
                  bg-[var(--bg-card)]
                  shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]
                  ring-1 ring-white/10
                  flex-shrink-0
                  z-20
                  relative
                  ${right ? "md:order-2" : ""}
                  group
                `}
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-[var(--primary-button)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30 mix-blend-overlay" />

                <ResponsiveImageSkeleton
                  src={f.image}
                  alt=""
                  className="w-full h-full relative z-20"
                  imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                  rounded="rounded-full"
                />
              </motion.div>

              {/* TEXT CARD */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6 }}
                className={`
                  max-w-xl
                  mx-auto md:mx-0
                  p-10 md:p-14
                  rounded-[2.5rem]
                  /* Glassmorphism optimized for dark theme */
                  bg-[var(--bg-card)]/80 backdrop-blur-md
                  border border-white/5
                  shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]
                  text-center md:text-right
                  relative
                  overflow-hidden
                  z-20
                  ${right ? "md:mr-auto" : "md:ml-auto"}
                  hover:border-[var(--primary-button)]/20 hover:bg-[var(--bg-card)]/90
                  transition-colors duration-300
                `}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--secondary-text)] mb-4 relative z-10">
                  {f.title}
                </h3>

                <p className="text-lg leading-relaxed text-[var(--secondary-text)]/70 relative z-10">
                  {f.desc}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
