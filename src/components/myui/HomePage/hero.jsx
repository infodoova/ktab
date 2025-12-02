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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // Wait 1 second before starting the sequence, then stagger children
        delayChildren: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      filter: "blur(10px)", // Cinematic blur effect
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] // Custom "easeOut" bezier
      }
    },
  };

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* 1. Full Screen Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={heroVideo}
        >
          {/* Fallback if video fails */}
          Your browser does not support the video tag.
        </video>

        {/* Dark Gradient Overlay for text readability */}
        {/* Additional radial overlay to center focus */}
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      {/* 2. Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          relative z-10 
          w-full h-full 
          flex flex-col items-center justify-center 
          text-center
          px-4 sm:px-6
        "
        dir="rtl"
      >
        
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="
            w-full max-w-[90%] md:max-w-[80%] 
            text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
            font-black text-white 
            tracking-tight leading-[1.1]
            drop-shadow-lg
          "
        >
          جيل جديد من 
          <span className="text-[var(--earth-olive)] block mt-2 sm:inline sm:mt-0 sm:mr-4">
             القراءة العربية
          </span>
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          variants={itemVariants}
          className="
            mt-8 
            w-full max-w-[85%] md:max-w-[70%] lg:max-w-[60%]
            text-lg sm:text-xl md:text-2xl 
            text-gray-100/90 font-medium 
            leading-relaxed
            drop-shadow-md
          "
        >
          تجربة قراءة تتجاوز مجرد النصوص. نجمع بين الكتب التفاعلية، السرد الصوتي،
          والذكاء الاصطناعي في منصة واحدة تناسب الجميع.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row gap-6 w-full justify-center items-center"
        >
          {/* Primary Button */}
          <button
            onClick={() => navigate("/Screens/auth/login")}
            className="
              px-12 py-5 rounded-full
              bg-[var(--earth-olive)] hover:bg-[var(--earth-olive)]/90
              text-white text-xl font-bold
              shadow-lg shadow-[var(--earth-olive)]/20
              transform transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              min-w-[200px]
            "
          >
            ابدأ الآن
          </button>

          {/* Secondary Button (Glassmorphism) */}
          <button
            onClick={() => scrollToSection("for-all-ages")}
            className="
              px-12 py-5 rounded-full
              bg-white/10 backdrop-blur-md
              border border-white/30
              text-white text-xl font-bold
              shadow-lg
              transform transition-all duration-300
              hover:bg-white/20 hover:scale-105 hover:border-white
              min-w-[200px]
            "
          >
            اكتشف المنصة
          </button>
        </motion.div>

      </motion.div>
    </section>
  );
}