import React from "react";
import { ArrowUp } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { useFooter } from "../../hooks/useFooter";
import "./Footer.css";

/**
 * Minimalist luxury Footer for Ktab platform.
 * Pure Light Mode, prominent official logo, zero clutter, in-app navigation redirects.
 */
export default function Footer() {
  const {
    year,
    sections,
    handleLinkClick,
    scrollToTop,
  } = useFooter();

  return (
    <footer className="er-footer" dir="rtl">
      <div className="er-footer-container">
        {/* Main Grid: Brand Column + In-App Navigation Sections */}
        <div className="er-footer-grid">
          {/* Brand Column with Prominent Logo */}
          <div className="er-footer-brand-col">
            <button
              type="button"
              className="er-footer-logo-btn"
              onClick={scrollToTop}
              aria-label="كتّاب: العودة للأعلى"
            >
              <img src={logo} alt="Ktab Logo" className="er-footer-logo" />
            </button>

            <p className="er-footer-bio">
              المنصة العربية الأولى الرائدة في القراءة والاستماع الذكي وصناعة
              القصص التفاعلية لمختلف الأجيال.
            </p>
          </div>

          {/* Links Columns (In-app Navigation) */}
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
                        target={link.targetBlank ? "_blank" : undefined}
                        rel={link.targetBlank ? "noopener noreferrer" : undefined}
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

        {/* Bottom Bar: Copyright + Legal Links + Back to top */}
        <div className="er-footer-bottom">
          <div className="er-footer-bottom-info">
            <p className="er-footer-copy">
              © {year} كتّاب. جميع الحقوق محفوظة.
            </p>
            <div className="er-footer-bottom-legal">
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="er-footer-bottom-legal-link"
              >
                الشروط والأحكام
              </a>
              <span className="er-footer-bottom-sep" aria-hidden="true">·</span>
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="er-footer-bottom-legal-link"
              >
                سياسة الخصوصية
              </a>
            </div>
          </div>

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
    </footer>
  );
}
