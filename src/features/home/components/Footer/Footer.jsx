import React from "react";
import { ArrowUp } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { useFooter } from "../../hooks/useFooter";
import LegalArticleModal from "../LegalArticleModal/LegalArticleModal";
import "./Footer.css";

/**
 * Minimalist luxury Footer for Ktab platform.
 * Pure Light Mode, prominent official logo, zero clutter, big brand signature under.
 */
export default function Footer() {
  const {
    year,
    sections,
    activeArticleId,
    isArticleModalOpen,
    openArticle,
    closeArticle,
    handleLinkClick,
    scrollToTop,
  } = useFooter();

  return (
    <footer className="er-footer" dir="rtl">
      <div className="er-footer-container">
        {/* Main Grid: Brand Column + 2 Local Sections */}
        <div className="er-footer-grid">
          {/* Brand Column with Prominent Logo */}
          <div className="er-footer-brand-col">
            <button
              type="button"
              className="er-footer-logo-btn"
              onClick={scrollToTop}
              aria-label="كتاب — العودة للأعلى"
            >
              <img src={logo} alt="Ktab Logo" className="er-footer-logo" />
            </button>

            <p className="er-footer-bio">
              المنصة العربية الأولى الرائدة في القراءة والاستماع الذكي وصناعة
              القصص التفاعلية لمختلف الأجيال.
            </p>
          </div>

          {/* Links Columns (الدعم والمساعدة + السياسات والضوابط) */}
          <div className="er-footer-links-group">
            {sections.map((section) => (
              <div key={section.id} className="er-footer-col">
                <h4 className="er-footer-col-title">{section.title}</h4>
                <ul className="er-footer-links-list">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href || `#${link.target}`}
                        className="er-footer-link"
                        onClick={(e) => handleLinkClick(e, link)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright + Back to top */}
        <div className="er-footer-bottom">
          <p className="er-footer-copy">
            © {year} كتاب — جميع الحقوق محفوظة.
          </p>

          <button
            type="button"
            className="er-footer-top-btn"
            onClick={scrollToTop}
            aria-label="العودة إلى أعلى الصفحة"
          >
            <span>العودة للأعلى</span>
            <ArrowUp size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Production Legal & Policy Article Modal */}
      <LegalArticleModal
        articleId={activeArticleId}
        isOpen={isArticleModalOpen}
        onClose={closeArticle}
        onSelectArticle={openArticle}
      />
    </footer>
  );
}
