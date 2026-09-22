import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo/logo.png";
import { useNotFound } from "./useNotFound";
import "./NotFoundView.css";

/**
 * Pure presentation view for the 404 Page Not Found screen.
 * Styled following Ktab's Eleven Reader + Apple editorial light mode aesthetic.
 */
export function NotFoundView() {
  const {
    homeUrl,
    homeLabel,
    handleGoHome,
    handleGoBack,
    quickLinks,
  } = useNotFound();

  return (
    <main className="ktab-notfound-page" dir="rtl">
      <div className="ktab-notfound-container">
        {/* Prominent Brand Logo */}
        <Link to={homeUrl} className="ktab-notfound-logo-link" aria-label="الرئيسية">
          <img src={logo} alt="Ktab Logo" className="ktab-notfound-logo-img" />
        </Link>

        {/* Minimalist 404 Code Display */}
        <div className="ktab-notfound-badge-wrap" aria-hidden="true">
          <span className="ktab-notfound-code">404</span>
        </div>

        {/* Editorial Heading & Context */}
        <h1 className="ktab-notfound-title">
          الصفحة غير موجودة
        </h1>

        <p className="ktab-notfound-desc">
          الصفحة التي تبحث عنها غير متوفرة، ربما تم تغيير مسارها أو حُذفت، أو أن الرابط الذي اتبعته غير صحيح.
        </p>

        {/* Action Controls - Clean, arrow-free editorial buttons */}
        <div className="ktab-notfound-actions">
          <button
            type="button"
            onClick={handleGoHome}
            className="ktab-notfound-btn-primary"
          >
            <span>{homeLabel}</span>
          </button>

          <button
            type="button"
            onClick={handleGoBack}
            className="ktab-notfound-btn-secondary"
          >
            <span>العودة للخلف</span>
          </button>
        </div>

        {/* Quick Discovery Navigation Pills */}
        {quickLinks && quickLinks.length > 0 && (
          <div className="ktab-notfound-links-wrap">
            <span className="ktab-notfound-links-label">روابط سريعة قد تهمك</span>
            <div className="ktab-notfound-pills">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="ktab-notfound-pill-link"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default NotFoundView;
