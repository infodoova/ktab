/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../../../assets/videos/hero1.mp4";

export default function Hero() {
  const navigate = useNavigate();

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
            font-black text-white tracking-tight text-center
            drop-shadow-[0_10px_25px_rgba(0,0,0,0.55)]
            leading-[1.05]
            text-[clamp(40px,7vw,120px)]
                 pt-4 pb-4 

            mx-auto
            md:whitespace-nowrap
            whitespace-normal
            relative
          "
         style={{
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitMaskImage:
    "linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 50%)",
  maskImage:
    "linear-gradient(to bottom, rgba(0,0,0,0) 10%, rgba(0,0,0,1) 50%)",
}}
        >
          جيل جديد من القراءة العربية
        </motion.h1>

        {/* BUTTONS */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center w-full"
        >
          <button
            onClick={() => navigate("/Screens/auth/login")}
            className="
              w-[230px]
              px-10 py-4 rounded-full
              bg-[var(--earth-olive)] hover:bg-[var(--earth-olive)]/90
              text-white text-lg font-bold
              transition-all duration-300 hover:scale-105
              shadow-lg shadow-[var(--earth-olive)]/20
            "
          >
            ابدأ الآن
          </button>

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
        </motion.div>
      </motion.div>
    </section>
  );
}
