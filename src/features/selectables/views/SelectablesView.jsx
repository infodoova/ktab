import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpLeft } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import ktabBrandIcon from "@/assets/logo/BrandIcon.png";
import { SELECTABLES_LINKS } from "../constants/selectablesLinks";
import "./SelectablesView.css";

/**
 * Accurate Official Instagram Logo Glyph
 */
function OfficialInstagramLogo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="ktab-selectables-icon-svg"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="#ffffff"
        strokeWidth="2.1"
      />
      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke="#ffffff"
        strokeWidth="2.1"
      />
      <circle cx="17.4" cy="6.6" r="1.3" fill="#ffffff" />
    </svg>
  );
}

/**
 * Accurate Classical Library & Books Emblem (for Early Access)
 */
function AccurateLibraryLogo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ktab-selectables-icon-svg"
    >
      <path d="M3 21h18" />
      <path d="M5 18h14" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M2 10l10-6.5L22 10H2z" />
    </svg>
  );
}

/**
 * Accurate Perforated Voucher / Ticket Glyph (for Free Voucher)
 */
function AccurateVoucherLogo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ktab-selectables-icon-svg"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
      <path d="M12 8v8" strokeDasharray="2 2" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  );
}

function renderAccurateAppIcon(item) {
  switch (item.id) {
    case "main-app":
      return (
        <img
          src={ktabBrandIcon}
          alt="كتاب"
          className="ktab-selectables-brand-img"
        />
      );
    case "instagram":
      return <OfficialInstagramLogo size={28} />;
    case "early-access":
      return <AccurateLibraryLogo size={28} />;
    case "free-voucher":
    default:
      return <AccurateVoucherLogo size={28} />;
  }
}

/**
 * Selectables View — Apple Slanted Showcase Section (Full-Width, Non-Scrollable).
 * Edge-to-edge layout, accurate app logos, zero upper text, no footer.
 */
export default function SelectablesView() {
  return (
    <div className="ktab-selectables-page" dir="rtl" style={{ colorScheme: "light" }}>
      <main className="ktab-selectables-container" aria-label="روابط منصة كتاب">
        {/* Minimal Clean Logo Top Bar */}
        <header className="ktab-selectables-header">
          <Link to="/" aria-label="كتاب — الرئيسية" className="ktab-selectables-logo-wrap">
            <img src={logo} alt="كتاب" className="ktab-selectables-logo" />
          </Link>
        </header>

        {/* 4 Diagonal Slanted Slices Showcase (Full-Width Edge-to-Edge) */}
        <nav className="ktab-selectables-showcase" aria-label="الوجهات المتاحة">
          {SELECTABLES_LINKS.map((item, index) => {
            const isExternal = item.isExternal;

            const sectionContent = (
              <>
                {/* Right side (RTL lead): Authentic App Squircle + Typography */}
                <div className="ktab-selectables-section__lead">
                  <div
                    className={`ktab-selectables-icon-squircle ktab-selectables-icon--${item.theme}`}
                    aria-hidden="true"
                  >
                    {renderAccurateAppIcon(item)}
                  </div>

                  <div className="ktab-selectables-section__text">
                    <h2 className="ktab-selectables-section__title">{item.title}</h2>
                    <p className="ktab-selectables-section__subtitle">{item.subtitle}</p>
                  </div>
                </div>

                {/* Left side (RTL end): Subtle tag badge + new tab action arrow */}
                <div className="ktab-selectables-section__action">
                  <span className="ktab-selectables-section__badge">{item.badge}</span>
                  <span className="ktab-selectables-section__arrow" aria-hidden="true">
                    <ArrowUpLeft size={19} strokeWidth={2.4} />
                  </span>
                </div>
              </>
            );

            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="ktab-selectables-slant-divider" aria-hidden="true">
                    <svg
                      viewBox="0 0 1000 24"
                      preserveAspectRatio="none"
                      className="ktab-selectables-slant-svg"
                    >
                      <line
                        x1="0"
                        y1="2"
                        x2="1000"
                        y2="22"
                        stroke="rgba(0, 0, 0, 0.08)"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                )}

                {isExternal ? (
                  <a
                    href={item.href}
                    className={`ktab-selectables-section ktab-selectables-section--${item.theme}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} — يفتح في نافذة جديدة`}
                  >
                    {sectionContent}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`ktab-selectables-section ktab-selectables-section--${item.theme}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} — يفتح في نافذة جديدة`}
                  >
                    {sectionContent}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
