import React from "react";
import { Instagram, Facebook, Youtube, Mail, ArrowUp } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { useFooter } from "../../hooks/useFooter";
import "./Footer.css";

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  mail: Mail,
};

/**
 * Rebranded Footer Component — Eleven Reader + Apple inspired.
 * Pure Light Mode, prominent official logo, zero clutter, strictly no 'صنع بحب'.
 */
export default function Footer() {
  const { year, sections, socials, handleLinkClick, scrollToTop } = useFooter();

  return (
    <footer className="er-footer" dir="rtl">
      <div className="er-footer-container">
        {/* Main Grid: Brand Column + 4 Nav Columns */}
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

            {/* Social Links */}
            <div className="er-footer-socials" aria-label="روابط التواصل الاجتماعي">
              {socials.map((item) => {
                const IconComponent = SOCIAL_ICONS[item.id] || Mail;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="er-footer-social-btn"
                    aria-label={item.label}
                  >
                    <IconComponent size={18} strokeWidth={2} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
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

        {/* Bottom Bar: Pure Copyright + Back to top */}
        <div className="er-footer-bottom">
          <p className="er-footer-copy">
            © {year} كُتّاب — جميع الحقوق محفوظة.
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
    </footer>
  );
}
