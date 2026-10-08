import React, { useMemo } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, FileText, Scale, Calendar, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { LEGAL_ARTICLES } from "../constants/legalArticles";
import "./LegalArticleView.css";

const ARTICLE_ICONS = {
  terms: Scale,
  privacy: ShieldCheck,
  copyright: FileText,
};

export default function LegalArticleView() {
  const { articleId: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active article from params or pathname
  const activeId = useMemo(() => {
    if (paramId && LEGAL_ARTICLES[paramId]) return paramId;
    const path = location.pathname.replace(/^\//, "").split("/")[0];
    if (path && LEGAL_ARTICLES[path]) return path;
    return "terms";
  }, [paramId, location.pathname]);

  const article = LEGAL_ARTICLES[activeId] || LEGAL_ARTICLES.terms;
  const IconComponent = ARTICLE_ICONS[activeId] || FileText;

  return (
    <div className="legal-page-wrap" dir="rtl">
      {/* Top Header */}
      <header className="legal-page-header">
        <div className="legal-page-header-inner">
          <Link to="/" aria-label="العودة إلى الرئيسية" className="legal-page-brand">
            <img src={logo} alt="كتاب" className="legal-page-logo" />
          </Link>

          <Link to="/" className="legal-page-back-btn">
            <span>العودة إلى الرئيسية</span>
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="legal-page-container">
        {/* Navigation Tabs */}
        <nav className="legal-page-tabs" aria-label="الوثائق القانونية">
          {Object.values(LEGAL_ARTICLES).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`legal-page-tab ${item.id === activeId ? "is-active" : ""}`}
              onClick={() => navigate(`/${item.id}`)}
            >
              {item.title}
            </button>
          ))}
        </nav>

        {/* Article Card */}
        <article className="legal-page-card">
          <header className="legal-card-header">
            <div className="legal-card-badge-wrap">
              <div className="legal-card-icon-squircle" aria-hidden="true">
                <IconComponent size={24} strokeWidth={2.2} />
              </div>
              <div className="legal-card-meta">
                <span className="legal-card-badge">{article.badge}</span>
                <span className="legal-card-date">
                  <Calendar size={13} aria-hidden="true" />
                  آخر تحديث: {article.lastUpdated}
                </span>
              </div>
            </div>

            <h1 className="legal-card-title">{article.title}</h1>
            {article.subtitle && <p className="legal-card-subtitle">{article.subtitle}</p>}
          </header>

          {article.intro && (
            <div className="legal-card-intro">
              <p>{article.intro}</p>
            </div>
          )}

          <div className="legal-card-sections">
            {article.sections?.map((section) => (
              <section key={section.id} className="legal-card-section-item">
                <div className="legal-section-item-header">
                  <span className="legal-section-item-number">{section.number}</span>
                  <h2 className="legal-section-item-title">{section.title}</h2>
                </div>

                <p className="legal-section-item-text">{section.content}</p>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="legal-section-item-bullets">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="legal-section-item-bullet">
                        <CheckCircle2 size={16} className="legal-bullet-icon" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <footer className="legal-card-footer">
            <p>منصة كتاب — جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
            <Link to="/" className="legal-card-home-btn">العودة للصفحة الرئيسية</Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
