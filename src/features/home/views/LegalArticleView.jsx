import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { LEGAL_ARTICLES } from "../constants/legalArticles";
import "./LegalArticleView.css";

/**
 * Dedicated Pure-Text Legal Article View for Terms of Service or Privacy Policy.
 * Each document is rendered on its own standalone page (no merged tabs).
 * Pure typography, mobile-optimized, bilingual (Arabic & English), zero AI badges.
 */
export default function LegalArticleView() {
  const { articleId: paramId } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Language state: 'ar' (Arabic, default) or 'en' (English)
  const initialLang = searchParams.get("lang") === "en" ? "en" : "ar";
  const [lang, setLang] = useState(initialLang);

  // Sync state if query param changes externally
  useEffect(() => {
    const qLang = searchParams.get("lang");
    if (qLang === "en" && lang !== "en") setLang("en");
    if (qLang === "ar" && lang !== "ar") setLang("ar");
  }, [searchParams, lang]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    const newParams = new URLSearchParams(searchParams);
    if (newLang === "en") {
      newParams.set("lang", "en");
    } else {
      newParams.delete("lang");
    }
    setSearchParams(newParams, { replace: true });
  };

  // Determine active article from params or pathname (terms or privacy)
  const activeId = useMemo(() => {
    if (paramId && LEGAL_ARTICLES[paramId]) return paramId;
    const path = location.pathname.replace(/^\//, "").split("/")[0];
    if (path && LEGAL_ARTICLES[path]) return path;
    return "terms";
  }, [paramId, location.pathname]);

  const articleGroup = LEGAL_ARTICLES[activeId] || LEGAL_ARTICLES.terms;
  const doc = articleGroup[lang] || articleGroup.ar;

  const isRtl = lang === "ar";
  const otherDocPath = activeId === "terms" ? "/privacy" : "/terms";
  const otherDocLabel =
    activeId === "terms"
      ? lang === "ar"
        ? "الانتقال إلى سياسة الخصوصية"
        : "View Privacy Policy"
      : lang === "ar"
      ? "الانتقال إلى الشروط والأحكام"
      : "View Terms of Service";

  const langQuery = lang === "en" ? "?lang=en" : "";

  return (
    <div className={`legal-pure-wrap ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Top Header */}
      <header className="legal-pure-header">
        <div className="legal-pure-header-inner">
          <Link to="/" aria-label="Ktab Home" className="legal-pure-brand">
            <img src={logo} alt="كتّاب" className="legal-pure-logo" />
          </Link>

          <div className="legal-pure-header-actions">
            {/* Bilingual Switcher */}
            <div className="legal-pure-lang-switch" role="group" aria-label="Language Switcher">
              <button
                type="button"
                className={`legal-pure-lang-btn ${lang === "ar" ? "is-active" : ""}`}
                onClick={() => handleLangChange("ar")}
              >
                العربية
              </button>
              <span className="legal-pure-lang-divider">/</span>
              <button
                type="button"
                className={`legal-pure-lang-btn ${lang === "en" ? "is-active" : ""}`}
                onClick={() => handleLangChange("en")}
              >
                English
              </button>
            </div>

            {/* Back to Home Link with Left-pointing Arrow */}
            <Link
              to="/"
              className="legal-pure-back-link"
              aria-label={lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            >
              <ArrowLeft size={15} strokeWidth={2.2} className="legal-pure-back-arrow" />
              <span className="legal-pure-back-text-full">
                {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </span>
              <span className="legal-pure-back-text-short">
                {lang === "ar" ? "الرئيسية" : "Home"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout (Dedicated to this single document, zero merged tabs) */}
      <main className="legal-pure-main">
        {/* Pure-Text Document Article */}
        <article className="legal-pure-article">
          <header className="legal-pure-doc-header">
            <h1 className="legal-pure-doc-title">{doc.title}</h1>
            {doc.subtitle && <p className="legal-pure-doc-subtitle">{doc.subtitle}</p>}
            <p className="legal-pure-doc-date">
              {lang === "ar" ? `آخر تحديث: ${doc.lastUpdated}` : `Last updated: ${doc.lastUpdated}`}
            </p>
          </header>

          {/* Early Access MVP Phase 2 Notice */}
          {doc.phaseNotice && (
            <div className="legal-pure-notice" role="note">
              <p>{doc.phaseNotice}</p>
            </div>
          )}

          {/* Introduction */}
          {doc.intro && (
            <div className="legal-pure-intro">
              <p>{doc.intro}</p>
            </div>
          )}

          {/* Body Sections */}
          <div className="legal-pure-sections">
            {doc.sections?.map((section) => (
              <section key={section.id} className="legal-pure-section">
                <h2 className="legal-pure-section-title">{section.title}</h2>
                <p className="legal-pure-section-text">{section.content}</p>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="legal-pure-bullets">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="legal-pure-bullet-item">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Pure-Text Footer Note */}
          <footer className="legal-pure-footer">
            <div className="legal-pure-footer-nav">
              <Link to={`${otherDocPath}${langQuery}`} className="legal-pure-other-link">
                {otherDocLabel}
              </Link>
            </div>
            <p className="legal-pure-copyright">
              {lang === "ar"
                ? `منصة كتّاب (مرحلة الوصول المبكر، المرحلة الثانية) © ${new Date().getFullYear()}، جميع الحقوق محفوظة لشركة Doova.`
                : `Ktab Platform (Early Access MVP Phase 2) © ${new Date().getFullYear()}. All rights reserved by Doova.`}
            </p>
          </footer>
        </article>
      </main>
    </div>
  );
}
