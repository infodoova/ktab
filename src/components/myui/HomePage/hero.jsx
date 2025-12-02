/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import owl from "../../../assets/gifs/owl.gif";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      dir="rtl"
      className="
        relative w-full 
        min-h-screen 
        flex items-center justify-center 
        overflow-hidden 
        bg-[var(--earth-cream)]
        pt-32 md:pt-36
      "
    >
      {/* 🔆 Soft gradient / fade background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Main radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--earth-cream)] via-[var(--earth-cream)]/90 to-[var(--earth-olive)]/5" />

        {/* Extra blurs for depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--earth-olive)]/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-[-25%] left-[-10%] w-[650px] h-[650px] bg-[var(--earth-brown)]/8 rounded-full blur-3xl"
        />
        {/* Bottom fade to clean edge */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[var(--earth-cream)] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* 📝 Text side */}
        <div className="text-center lg:text-right order-2 lg:order-1 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
              font-black text-[var(--earth-brown-dark)] 
              leading-[1.15] tracking-tight mb-8
            "
          >
            جيل جديد من
            <br />
            <span className="relative inline-block text-[var(--earth-olive)]">
              القراءة العربية
              <svg
                className="absolute w-full h-3 -bottom-1 right-0 text-[var(--earth-sand)] opacity-60"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="
              text-lg md:text-2xl 
              text-[var(--earth-brown)] opacity-80 
              leading-loose font-medium 
              max-w-2xl mx-auto lg:mx-0 mb-10
            "
          >
            تجربة قراءة تتجاوز مجرد النصوص. نجمع بين الكتب التفاعلية، السرد الصوتي،
            والذكاء الاصطناعي في منصة واحدة تناسب الجميع.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="
              flex flex-col sm:flex-row gap-5 
              justify-center lg:justify-start
            "
          >
            <button
              className="
                px-10 py-4 rounded-xl
                bg-[var(--earth-brown-dark)] text-white 
                text-lg font-bold 
                shadow-lg
                hover:shadow-xl hover:-translate-y-0.5
                transition-all duration-300
              "
              onClick={() => {
                navigate("/Screens/auth/login");
              }}
            >
              ابدأ الآن
            </button>

            <button
              onClick={() => scrollToSection("for-all-ages")}
              className="
                px-10 py-4 rounded-xl
                border border-[var(--earth-brown)]/30
                text-[var(--earth-brown-dark)] 
                text-lg font-bold
                bg-white/40 backdrop-blur-sm
                hover:bg-[var(--earth-brown)] hover:text-white hover:border-transparent
                transition-all duration-300
              "
            >
              اكتشف المنصة
            </button>
          </motion.div>
        </div>

        {/* 🦉 Owl visual */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[480px]"
          >
        
              <img
                src={owl}
                alt="Animated Owl of project ktab"
                loading="lazy"
                className="w-full h-auto object-contain"
              />

          </motion.div>
        </div>
      </div>
    </section>
  );
}
