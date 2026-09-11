import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Official navigation links for the platform
const REAL_NAV_LINKS = [
  { id: "hero", label: "الرئيسية", target: "hero" },
  { id: "roles", label: "الأدوار والقرّاء", target: "roles" },
  { id: "library", label: "المكتبة العربية", target: "library" },
  { id: "interactive-stories", label: "القصص التفاعلية", target: "interactive-stories" },
  { id: "pricing", label: "الباقات والأسعار", target: "pricing" },
];

/**
 * Custom hook containing all stateful and navigation logic for the Navbar.
 * Keeps the JSX view pure and declarative.
 */
export function useNavbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for sticky navbar shadow/blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile drawer on resize to larger screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsOpen(false);
  }, []);

  const handleLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleSignup = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  return {
    isOpen,
    isScrolled,
    toggleMenu,
    closeMenu,
    scrollToSection,
    scrollToTop,
    handleLogin,
    handleSignup,
    navLinks: REAL_NAV_LINKS,
  };
}

export default useNavbar;
