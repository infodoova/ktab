import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, FileText, Scale, Calendar, CheckCircle2 } from "lucide-react";
import { LEGAL_ARTICLES } from "../../constants/legalArticles";
import "./LegalArticleModal.css";

const ARTICLE_ICONS = {
  terms: Scale,
  privacy: ShieldCheck,
  copyright: FileText,
};

/**
 * Editorial Light Mode Modal displaying full, production-grade legal articles.
 * Apple + ElevenLabs inspired typography, zero clutter, fully accessible.
 */
export default function LegalArticleModal({
  articleId,
  isOpen,
  onClose,
  onSelectArticle,
}) {
  const contentRef = useRef(null);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Scroll to top of content when article changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [articleId]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !articleId) return null;

  const currentArticle = LEGAL_ARTICLES[articleId] || LEGAL_ARTICLES.terms;
  const IconComponent = ARTICLE_ICONS[articleId] || FileText;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="legal-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          dir="rtl"
        >
          {/* Animated Modal Container */}
          <motion.div
            className="legal-modal-window"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Modal Header */}
            <div className="legal-modal-header">
              <div className="legal-modal-header-lead">
                <div className="legal-modal-icon-badge" aria-hidden="true">
                  <IconComponent size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="legal-modal-meta-row">
                    <span className="legal-modal-badge">{currentArticle.badge}</span>
                    <span className="legal-modal-date">
                      <Calendar size={13} aria-hidden="true" />
                      آخر تحديث: {currentArticle.lastUpdated}
                    </span>
                  </div>
                  <h2 id="legal-modal-title" className="legal-modal-title">
                    {currentArticle.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                className="legal-modal-close-btn"
                onClick={onClose}
                aria-label="إغلاق النافذة"
              >
                <X size={20} strokeWidth={2.4} />
              </button>
            </div>

            {/* Quick Article Switcher Tabs */}
            <nav className="legal-modal-tabs" aria-label="أقسام الوثائق القانونية">
              {Object.values(LEGAL_ARTICLES).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`legal-modal-tab ${item.id === articleId ? "is-active" : ""}`}
                  onClick={() => onSelectArticle?.(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </nav>

            {/* Scrollable Article Body */}
            <div className="legal-modal-body" ref={contentRef}>
              {currentArticle.subtitle && (
                <p className="legal-modal-subtitle">{currentArticle.subtitle}</p>
              )}

              {currentArticle.intro && (
                <div className="legal-modal-intro">
                  <p>{currentArticle.intro}</p>
                </div>
              )}

              <div className="legal-modal-sections">
                {currentArticle.sections?.map((section) => (
                  <article key={section.id} className="legal-article-section">
                    <div className="legal-section-header">
                      <span className="legal-section-number">{section.number}</span>
                      <h3 className="legal-section-title">{section.title}</h3>
                    </div>

                    <p className="legal-section-text">{section.content}</p>

                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="legal-section-bullets">
                        {section.bullets.map((bullet, idx) => (
                          <li key={idx} className="legal-section-bullet">
                            <CheckCircle2 size={16} className="legal-bullet-icon" aria-hidden="true" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="legal-modal-footer">
              <span className="legal-footer-note">
                منصة كتاب — جميع الحقوق محفوظة © {new Date().getFullYear()}
              </span>
              <button
                type="button"
                className="legal-modal-confirm-btn"
                onClick={onClose}
              >
                إغلاق وقراءة المنصة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
