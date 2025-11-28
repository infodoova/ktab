/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo/logo.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "الرئيسية", target: "hero" },
  { label: "رحلة لكل الأعمار", target: "for-all-ages" },
  { label: "الأدوار", target: "roles" },
  { label: "ما هو كُتّاب؟", target: "what-about" },
  {label: "لماذا نثق بكتاب", target:"trusted-section"},
  { label: "الأسعار", target: "pricing" },
  { label: "الاسئلة الشائعة", target: "FAQ" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileLike, setIsMobileLike] = useState(false);
  const scrollTimeout = useRef(null);

  const collapsedWidth = "120px";

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (open) return;
      setIsCollapsed(true);
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsCollapsed(false);
      }, 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  // Treat tablets as mobile within this component only (<= 1024px)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: 1024px)`);
    const update = () => setIsMobileLike(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return (
    <motion.header
      dir="rtl"
      initial={{ width: "92%", borderRadius: "9999px" }}
      animate={{
        width: isCollapsed ? collapsedWidth : "92%",
        borderRadius: "9999px",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="
        fixed top-6 left-1/2 -translate-x-1/2 z-50
        bg-[var(--earth-cream)]/90 backdrop-blur-lg shadow-lg
        border border-[var(--earth-brown)]/15
        h-20 sm:h-24 flex items-center justify-center
      "
      style={{ maxWidth: isCollapsed ? collapsedWidth : "1400px" }}
    >
      {/* 📌 MOBILE/TABLET LOGIN BUTTON ON THE LEFT */}
      {!isCollapsed && isMobileLike && (
        <Button
          onClick={() => navigate("/Screens/auth/login")}
          className="absolute left-3 bg-[var(--earth-brown)] text-white rounded-full px-4 py-2 text-sm"
        >
          تسجيل دخول
        </Button>
      )}

      {/* 📌 MOBILE/TABLET HAMBURGER ON THE RIGHT */}
      {!isCollapsed && isMobileLike && (
        <button
          onClick={() => setOpen(!open)}
          className="absolute right-3 p-2 rounded-full text-[var(--earth-brown)] hover:bg-[var(--earth-brown)]/10"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* 📌 DESKTOP LOGO */}
      {!isMobileLike && (
        <div
          className={`items-center justify-center cursor-pointer overflow-visible ${isCollapsed ? "absolute inset-0" : "absolute right-6"}`}
          style={{ width: isCollapsed ? "100%" : "auto" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
        <img
          src={logo}
          alt="logo"
          className={`
            object-contain select-none transition-transform duration-300
            ${
              isCollapsed
                ? "h-20 lg:h-24 scale-110"   //  collapsed desktop
                : "h-16 lg:h-20"              // bigger in normal desktop
            }
          `}
        />
        </div>
      )}

      {/* 📌 MOBILE/TABLET LOGO */}
      {isMobileLike && (
        <div
          className="flex items-center justify-center cursor-pointer h-full absolute left-1/2 -translate-x-1/2 overflow-visible"
          style={{ width: "70%" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
        <img
          src={logo}
          alt="logo"
          className={`
            object-contain transition-transform duration-300
            ${
              isCollapsed
                ? "h-30 scale-110"  // ✅ bigger when collapsed on mobile
                : "h-30"            // ✅ bigger when not collapsed on mobile
            }
          `}
        />
        </div>
      )}

      {/* DESKTOP LINKS */}
      {!isCollapsed && !isMobileLike && (
        <nav className="flex gap-2 absolute left-1/2 -translate-x-1/2">
          {links.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollToSection(link.target)}
              className="text-[var(--earth-brown)] font-semibold text-[15px] px-3 py-1.5 rounded-full hover:bg-[var(--earth-brown)]/10 transition whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}

      {/* DESKTOP BUTTONS */}
      {!isCollapsed && !isMobileLike && (
        <div className="absolute left-6 gap-2 items-center flex">
          <Button
            className="rounded-full bg-[var(--earth-brown)] text-white px-6 h-10 hover:bg-[var(--earth-olive)]"
            onClick={() => navigate("/Screens/auth/signup")}
          >
            تسجيل حساب
          </Button>

          <Button
            variant="outline"
            className="rounded-full border-[var(--earth-brown)] text-[var(--earth-brown)] h-10 px-6 hover:bg-[var(--earth-brown)] hover:text-white"
            onClick={() => navigate("/Screens/auth/login")}
          >
            تسجيل دخول
          </Button>
        </div>
      )}

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && !isCollapsed && isMobileLike && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[105%] left-0 w-full bg-[var(--earth-paper)] border border-[var(--earth-brown)]/10 rounded-3xl shadow-xl p-4 flex flex-col gap-3"
          >
            {links.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="
                  text-right font-medium px-4 py-3 rounded-xl 
                  text-[var(--earth-brown)]
                  hover:bg-[var(--earth-brown)]/15
                "
              >
                {link.label}
              </button>
            ))}
            <div className="h-px bg-[var(--earth-brown)]/10" />
            <Button
              variant="outline"
              className="w-full rounded-full border-[var(--earth-brown)]"
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
