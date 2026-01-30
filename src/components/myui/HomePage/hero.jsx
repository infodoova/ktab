import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import heroVideo from "../../../assets/videos/hero1.mp4";
import EarlyAccess from "./earlyaccess";

export default function Hero() {
  const navigate = useNavigate();
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.8, staggerChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
  <section
    id="hero"
    className="relative w-full h-screen overflow-hidden bg-black select-none"
  >
    {/* Video */}
    <div className="absolute inset-0 w-full h-full">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src={heroVideo}
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>

    {/* Content */}
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        relative z-10 w-full h-full 
        flex flex-col items-center justify-center 
        text-center px-4 sm:px-6
      "
      dir="rtl"
    >
      {/* TITLE */}
      <motion.h1
        variants={itemVariants}
        className="
          font-black text-center
          leading-[1.3] lg:leading-[1.8]
          text-[clamp(2.2rem,9vw,110px)]
          py-8 lg:py-16
          px-4
          mx-auto
          whitespace-normal
          relative
          overflow-visible
          block
          bg-gradient-to-b from-white/20 via-white/90 to-white
          bg-clip-text text-transparent
          drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]
        "
      >
مكتبتك الإلكترونية الجديدة      </motion.h1>

      {/* BUTTONS */}
      <motion.div
        variants={itemVariants}
        className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center w-full"
      >
        {/* PRIMARY CTA */}
        <button
          onClick={() => navigate("/Screens/auth/login")}
          className="
            w-[230px]
            px-10 py-5 rounded-full
            text-[var(--bg-dark)]
            text-lg font-black
            transition-all duration-300 hover:scale-105
            shadow-2xl shadow-[var(--primary-button)]/40
            relative overflow-hidden
          "
          style={{ background: "var(--gradient)" }}
        >
          ابدأ الآن
        </button>

        {/* SECONDARY CTA */}
        <button
          onClick={() => scrollToSection("age")}
          className="
            w-[230px]
            px-10 py-4 rounded-full
            bg-white/10 backdrop-blur-md
            border border-white/30
            text-white text-lg font-bold
            transition-all duration-300 hover:scale-105
            shadow-lg
          "
        >
          اكتشف المنصة
        </button>

        {/* EARLY ACCESS CTA */}
        <button
          onClick={() => setIsEarlyAccessOpen(true)}
          className="
            w-[230px]
            px-10 py-4 rounded-full
            bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 via-red-500 via-yellow-500 to-teal-500 
            bg-[length:300%_300%] animate-rainbow-fast
            text-white text-lg font-black
            transition-all duration-500 hover:scale-110 hover:-translate-y-1
            shadow-[0_15px_45px_rgba(255,255,255,0.15)]
            relative overflow-hidden group
          "
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            الوصول المبكر
            <Sparkles size={18} className="animate-pulse" />
          </span>
          {/* Glass Overlay on Hover */}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </motion.div>
    </motion.div>

    {/* MODAL */}
    <EarlyAccess 
      isOpen={isEarlyAccessOpen} 
      onClose={() => setIsEarlyAccessOpen(false)} 
    />
    
    <style jsx>{`
      @keyframes rainbow-fast {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-rainbow-fast {
        animation: rainbow-fast 8s ease infinite;
      }
    `}</style>
  </section>
);
}
