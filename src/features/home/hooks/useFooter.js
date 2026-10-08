import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const FOOTER_SECTIONS = [
  {
    id: "platform",
    title: "المنصّة",
    links: [
      { id: "p1", label: "كيف يعمل كتّاب؟", target: "hero" },
      { id: "p2", label: "المكتبة العربية", target: "library" },
      { id: "p3", label: "القصص التفاعلية", target: "interactive-stories" },
      { id: "p4", label: "اقرأ في أي مكان", target: "read-anywhere" },
      { id: "p5", label: "لمن كتّاب؟", target: "roles" },
    ],
  },
 
  {
    id: "support",
    title: "الدعم والمساعدة",
    links: [
      { id: "s1", label: "الأسئلة الشائعة", target: "FAQ" },
      { id: "s3", label: "تسجيل الدخول", href: "/login" },
    ],
  },
  {
    id: "legal",
    title: "الشروط والخصوصية",
    links: [
      { id: "l1", label: "الشروط والأحكام", href: "/terms", targetBlank: true },
      { id: "l2", label: "سياسة الخصوصية", href: "/privacy", targetBlank: true },
    ],
  },
];

export const SOCIAL_LINKS = [];

/**
 * Hook for Footer logic and structured in-app link navigation.
 */
export function useFooter() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleLinkClick = useCallback(
    (e, link) => {
      // If targetBlank, let browser natively open the link in a new tab
      if (link.targetBlank) {
        return;
      }

      // Smooth scroll to anchor on current page
      if (link.target) {
        e.preventDefault();
        const el = document.getElementById(link.target);
        if (el) {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          return;
        } else {
          navigate(`/#${link.target}`);
          return;
        }
      }

      // In-app route navigation
      if (link.href && link.href.startsWith("/")) {
        e.preventDefault();
        navigate(link.href);
      }
    },
    [navigate]
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    year,
    sections: FOOTER_SECTIONS,
    socials: SOCIAL_LINKS,
    handleLinkClick,
    scrollToTop,
  };
}

export default useFooter;
