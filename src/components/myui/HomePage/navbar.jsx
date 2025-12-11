/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo/logo.png";
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
      { threshold: 0.6 }
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

  // NAVBAR STYLE DYNAMIC
  const headerStyle = {
    backgroundColor: isHero ? "transparent" : "rgba(255,255,255,0.65)",
    backdropFilter: isHero ? "none" : "blur(14px)",
    boxShadow: isHero ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
    borderBottom: isHero ? "none" : "1px solid rgba(0,0,0,0.05)",
    transition: "all 0.35s ease",
  };

  // BUTTON STYLE WHEN HERO IS VISIBLE
  const transparentBtn =
    "rounded-full px-5 h-10 border-white/40 text-white hover:border-white hover:bg-white/10 transition";

  const filledBtn =
    "rounded-full px-5 h-10 bg-[var(--earth-olive)] text-white hover:bg-black transition";

  const loginBtnFilled =
    "rounded-full px-5 h-10 bg-[var(--earth-brown)] text-white hover:bg-black transition";

  return (
    <motion.header
      dir="rtl"
      className="fixed top-0 left-0 w-full z-[99]"
      style={headerStyle}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between relative">

        {/* LOGO */}
        <div
          className="cursor-pointer flex items-center"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logo}
            alt="Ktab logo"
            className="h-24 sm:h-28 opacity-95"
          />
        </div>

        {/* MOBILE HAMBURGER */}
        {isMobileLike && (
          <button
            onClick={() => setOpen(!open)}
            className={`p-2 rounded-full ${
              isHero ? "text-white" : "text-black"
            }`}
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
                className={`
                  text-[15px] transition font-medium
                  ${isHero ? "text-white hover:opacity-80" : "text-black hover:text-[var(--earth-olive)]"}
                `}
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
              w-full bg-white/10 backdrop-blur-2xl
              border border-white/20 shadow-xl p-5 flex flex-col gap-3
            "
          >
            {links.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="
                  text-right px-4 py-3 rounded-xl text-black
                  hover:bg-[var(--earth-brown)]/10
                "
              >
                {link.label}
              </button>
            ))}

            <div className="h-px bg-[var(--earth-brown)]/15" />

            <Button
              variant="outline"
              className="w-full rounded-full border-[var(--earth-brown)] text-[var(--earth-brown)]"
              onClick={() => navigate("/Screens/auth/login")}
            >
              تسجيل دخول
            </Button>

            <Button
              className="w-full rounded-full bg-[var(--earth-olive)] text-white"
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
