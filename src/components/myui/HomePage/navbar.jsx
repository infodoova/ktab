/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo/logo.png";
import logo2 from "@/assets/logo/logo2.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "الرئيسية", target: "hero" },
  { label: "رحلة لكل الأعمار", target: "age" },
  { label: "الأدوار", target: "roles" },
  { label: "ما هو كُتّاب؟", target: "what-about" },
  { label: " المكتبة ", target: "library" },

  { label: "الأسعار", target: "pricing" },
  { label: "الاسئلة الشائعة", target: "FAQ" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobileLike, setIsMobileLike] = useState(false);
  const [isHero, setIsHero] = useState(true);

  // Detect mobile / tablet
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobileLike(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Detect if the user is on the hero section
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHero(entry.isIntersecting),
      { threshold: 0.6 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 100;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setOpen(false);
  };

  // NAVBAR STYLE DYNAMIC - Netflix Dark Theme
  const headerStyle = {
    backgroundColor: isHero ? "transparent" : "rgba(10, 10, 10, 0.92)",
    backdropFilter: isHero ? "none" : "blur(20px)",
    boxShadow: isHero ? "none" : "0 4px 30px rgba(0,0,0,0.5)",
    borderBottom: isHero ? "none" : "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
  };

  // BUTTON STYLE WHEN HERO IS VISIBLE - Netflix Dark Theme
  const transparentBtn =
    "rounded-full px-6 h-11 border-white/20 text-white hover:border-white hover:bg-white/10 transition-all duration-300 font-bold";

  const filledBtn =
    "rounded-full px-6 h-11 text-[var(--bg-dark)] font-bold transition-all duration-300 hover:scale-105 shadow-xl shadow-[var(--primary-button)]/30";

  const loginBtnFilled =
    "rounded-full px-6 h-11 border-2 border-[var(--primary-border)] text-white font-bold hover:bg-[var(--primary-button)]/10 transition-all duration-300";

  return (
    <motion.header
      dir="rtl"
      className="fixed top-0 left-0 w-full z-[99]"
      style={headerStyle}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between relative">
        {/* LOGO - Fixed visual size imbalance using explicit height ratios */}
        <div
          className="cursor-pointer flex items-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img 
            src={isHero ? logo : logo2} 
            alt="Ktab logo" 
            style={{ 
              height: isHero ? (isMobileLike ? '85px' : '110px') : (isMobileLike ? '35px' : '48px'),
              width: 'auto'
            }}
            className="opacity-95 object-contain" 
          />
        </div>

        {/* MOBILE HAMBURGER */}
        {isMobileLike && (
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full text-white"
          >
            {open ? <X size={30} /> : <Menu size={30} />}
          </button>
        )}

        {/* DESKTOP LINKS */}
        {!isMobileLike && (
          <nav className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="text-[15px] transition font-medium text-white/80 hover:text-[var(--primary-button)]"
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* DESKTOP BUTTONS */}
        {!isMobileLike && (
          <div className="flex items-center gap-2">
            <Button
              className={isHero ? transparentBtn : filledBtn}
              style={!isHero ? { background: "var(--gradient)" } : {}}
              onClick={() => navigate("/Screens/auth/signup")}
            >
              تسجيل حساب
            </Button>

            <Button
              variant="outline"
              className={isHero ? transparentBtn : loginBtnFilled}
              onClick={() => navigate("/Screens/auth/login")}
            >
              تسجيل دخول
            </Button>
          </div>
        )}
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && isMobileLike && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              w-full bg-[var(--bg-surface)]/95 backdrop-blur-2xl
              border border-white/5
              shadow-2xl p-5 flex flex-col gap-3
            "
          >
            {links.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="
                  text-right px-4 py-3 rounded-xl
                  text-white/80
                  hover:bg-white/5 hover:text-[var(--primary-button)]
                  transition-all duration-200
                "
              >
                {link.label}
              </button>
            ))}

            <div className="h-px bg-white/10" />

            <Button
              variant="outline"
              className="w-full h-12 rounded-full border-2 border-[var(--primary-border)] text-white font-bold hover:bg-[var(--primary-button)]/10"
              onClick={() => navigate("/Screens/auth/login")}
            >
              تسجيل دخول
            </Button>

            <Button 
              className="w-full h-12 rounded-full text-[var(--bg-dark)] font-bold"
              style={{ background: "var(--gradient)" }}
              onClick={() => navigate("/Screens/auth/signup")}
            >
              تسجيل حساب جديد
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
