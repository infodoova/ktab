import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const FOOTER_SECTIONS = [
  {
    id: "platform",
    title: "المنصّة",
    links: [
      { id: "p1", label: "كيف يعمل كتّاب؟", target: "hero" },
      { id: "p2", label: "القصص التفاعلية", target: "interactive-stories" },
      { id: "p3", label: "المكتبة العربية", target: "books-catalog" },
      { id: "p4", label: "الاشتراكات والأسعار", target: "pricing" },
    ],
  },
  {
    id: "audience",
    title: "لمن؟",
    links: [
      { id: "a1", label: "للأهل واليافعين", href: "/login" },
      { id: "a2", label: "للمعلّمين والفصول", href: "/login" },
      { id: "a3", label: "للمدارس والمؤسسات", href: "/login" },
      { id: "a4", label: "للمؤلفين وصنّاع المحتوى", href: "/login" },
    ],
  },
  {
    id: "support",
    title: "الدعم",
    links: [
      { id: "s1", label: "الأسئلة الشائعة", target: "FAQ" },
      { id: "s2", label: "مركز المساعدة", href: "/login" },
      { id: "s3", label: "تواصل معنا", href: "mailto:support@ktab.com" },
    ],
  },
  {
    id: "legal",
    title: "قانوني",
    links: [
      { id: "l1", label: "الشروط والأحكام", href: "/terms" },
      { id: "l2", label: "سياسة الخصوصية", href: "/privacy" },
      { id: "l3", label: "ملفات الارتباط", href: "/cookies" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com" },
  { id: "mail", label: "Email", href: "mailto:support@ktab.com" },
];

/**
 * Hook for Footer logic, navigation, and structured link groups.
 */
export function useFooter() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleLinkClick = useCallback(
    (e, link) => {
      if (link.target) {
        e.preventDefault();
        const el = document.getElementById(link.target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
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
