/* eslint-disable no-unused-vars */
"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Lock, Smile } from "lucide-react";
import owl6 from "../../../assets/character/owl6.png"
const pillars = [
  {
    icon: ShieldCheck,
    title: "منصة آمنة وموثوقة للجميع",
    desc: "تجربة مبنية على حماية الأطفال وتطوير مهارات القراءة بشكل ممتع وخالٍ من المشتتات.",
    center: true,
  },
  {
    icon: Smile,
    title: "تعلم منظم وواضح",
    desc: "تقدم دقيق وسهل المتابعة.",
  },
  {
    icon: Sparkles,
    title: "قراءة محفزة وشيّقة",
    desc: "نقاط، إنجازات، ومكافآت تزيد الحماس.",
  },
  {
    icon: Lock,
    title: "خصوصية كاملة وبدون إعلانات",
    desc: "لا نشارك أي بيانات مع جهات خارجية، وتجربة خالية من التتبع.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function ModernTrustedSection() {
  const featuredPillar = pillars.find((p) => p.center);
  const otherPillars = pillars.filter((p) => !p.center);

  return (
    <section
      id="trusted-section"
      dir="rtl"
      className="
        w-full py-28 md:py-36 
        bg-[var(--earth-paper)] 
        relative overflow-hidden
      "
    >
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--earth-sand)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-[var(--earth-olive)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="md:flex md:space-x-12 rtl:space-x-reverse items-center justify-between mb-20 md:mb-28">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="md:w-1/2 text-right mb-10 md:mb-0"
          >
            <p className="text-xl font-medium text-[var(--earth-olive)] mb-3">
              الأساس الذي نبني عليه
            </p>
            <h2
              className="
                text-4xl md:text-6xl font-extrabold 
                text-[var(--earth-brown-dark)] 
              "
            >
              لماذا نثق بـ{" "}
              <span className="text-[var(--earth-olive)]">كتاب؟</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--earth-brown)]/80 max-w-lg">
              التزامنا بالجودة، الأمان، والتجربة الممتعة يجعلنا الخيار الأول
              لتعليم القراءة في العالم العربي.
            </p>
          </motion.div>

       <div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: true, amount: 0.5 }}
  className="
    md:w-1/2 
    aspect-video 
    bg-[var(--earth-cream)] 
    rounded-3xl 
    shadow-inner 
    flex items-center justify-center 
    border border-[var(--earth-sand)]
    overflow-hidden
  "
>
  <img 
    src={owl6} 
    alt="Ktab Owl Character"
  loading="lazy"
    className="w-full h-full fill drop-shadow-lg rounded-3xl"
  />
</div>

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="
            grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-6 
            items-stretch
          "
        >
          {featuredPillar && (
            <PillarCard
              key={0}
              pillar={featuredPillar}
              className="md:col-span-3 lg:col-span-4 p-8 md:p-12 text-center"
              isFeatured={true}
            />
          )}

          {otherPillars.map((p, i) => (
            <PillarCard
              key={i + 1}
              pillar={p}
              className={`
                p-6 md:p-8 
                ${
                  i === 0
                    ? "md:col-span-2 lg:col-span-2"
                    : "md:col-span-2 lg:col-span-3"
                }
                ${i === 2 ? "md:col-start-2 lg:col-start-4" : ""}
              `}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const PillarCard = ({ pillar, className = "", isFeatured = false }) => {
  const Icon = pillar.icon;

  const iconAnimation = {
    y: [0, isFeatured ? -12 : -6, 0],
    rotate: [0, 2, -2, 0],
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`
        flex flex-col 
        rounded-3xl shadow-lg 
        border-2 border-[var(--earth-sand)]/50
        text-[var(--earth-brown-dark)]
        transition-all duration-300 ease-in-out
        backdrop-filter backdrop-blur-md bg-[var(--earth-cream)]/70
        hover:shadow-2xl hover:border-[var(--earth-olive)]/50
        ${className}
      `}
    >
      <div className="flex flex-col items-start h-full">
        {/* ICON CONTAINER */}
        <motion.div
          animate={iconAnimation}
          transition={{
            duration: isFeatured ? 6 : 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className={`
            mb-4 md:mb-6 
            rounded-full 
            flex items-center justify-center 
            ${
              isFeatured
                ? "w-20 h-20 bg-[var(--earth-olive)]/10"
                : "w-16 h-16 bg-[var(--earth-sand)]/50"
            }
          `}
        >
          <Icon
            className={`
            ${
              isFeatured
                ? "w-8 h-8 text-[var(--earth-olive)]"
                : "w-7 h-7 text-[var(--earth-brown)]"
            }
          `}
          />
        </motion.div>

        {/* TITLE */}
        <h3
          className={`
            font-bold leading-snug mb-3
            ${isFeatured ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}
          `}
        >
          {pillar.title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className={`
            text-[var(--earth-brown)]/80 leading-relaxed
            ${isFeatured ? "text-xl" : "text-md"}
          `}
        >
          {pillar.desc}
        </p>
      </div>
    </motion.div>
  );
};
