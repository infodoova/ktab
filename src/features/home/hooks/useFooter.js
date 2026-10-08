import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const FOOTER_SECTIONS = [
  {
    id: "support",
    title: "الدعم والمساعدة",
    links: [
      { id: "s1", label: "الأسئلة الشائعة", target: "FAQ" },
    ],
  },
  {
    id: "legal",
    title: "السياسات والضوابط",
    links: [
      { id: "l1", label: "الشروط والأحكام", href: "/terms", articleId: "terms" },
      { id: "l2", label: "سياسة الخصوصية", href: "/privacy", articleId: "privacy" },
      { id: "l3", label: "حقوق النشر والملكية الفكرية", href: "/copyright", articleId: "copyright" },
    ],
  },
];

export const SOCIAL_LINKS = [];

/**
 * Hook for Footer logic, navigation, and article modal state.
 */
export function useFooter() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const [activeArticleId, setActiveArticleId] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const openArticle = useCallback((articleId) => {
    setActiveArticleId(articleId || "terms");
    setIsArticleModalOpen(true);
  }, []);

  const closeArticle = useCallback(() => {
    setIsArticleModalOpen(false);
  }, []);

  const handleLinkClick = useCallback(
    (e, link) => {
      // If the link opens a true legal/policy article
      if (link.articleId) {
        e.preventDefault();
        openArticle(link.articleId);
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
        }
      }

      // External or standard internal navigation
      if (link.href && link.href.startsWith("/")) {
        e.preventDefault();
        navigate(link.href);
      }
    },
    [navigate, openArticle]
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    year,
    sections: FOOTER_SECTIONS,
    socials: SOCIAL_LINKS,
    activeArticleId,
    isArticleModalOpen,
    openArticle,
    closeArticle,
    handleLinkClick,
    scrollToTop,
  };
}

export default useFooter;
