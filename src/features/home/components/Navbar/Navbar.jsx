import React from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { useNavbar } from "../../hooks/useNavbar";
import "./Navbar.css";

/**
 * Pure presentational Navbar component styled after Eleven Reader.
 * Logic is encapsulated in useNavbar hook.
 * Styles are encapsulated in Navbar.css.
 */
export default function Navbar() {
  const {
    isOpen,
    isScrolled,
    toggleMenu,
    scrollToSection,
    scrollToTop,
    handleLogin,
    handleSignup,
    navLinks,
  } = useNavbar();

  return (
    <header
      className={`er-navbar-header ${isScrolled ? "scrolled" : ""}`}
      dir="rtl"
    >
      <div className="er-navbar-container">
        {/* Brand / Logo */}
        <button
          className="er-navbar-brand"
          onClick={scrollToTop}
          type="button"
          aria-label="كُتّاب الرئيسية"
        >
          <img src={logo} alt="Ktab Logo" className="er-navbar-logo" />
        </button>

        {/* Center Desktop Links */}
        <nav className="er-navbar-nav" aria-label="روابط الموقع">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.target)}
              className="er-navbar-link"
              type="button"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="er-navbar-actions">
          <button
            onClick={handleLogin}
            className="er-btn-signin"
            type="button"
          >
            تسجيل دخول
          </button>
          <button
            onClick={handleSignup}
            className="er-btn-signup"
            type="button"
          >
            تسجيل حساب
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={toggleMenu}
          className="er-hamburger-btn"
          type="button"
          aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="er-mobile-drawer">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.target)}
              className="er-mobile-link"
              type="button"
            >
              {link.label}
            </button>
          ))}

          <div className="er-mobile-divider" />

          <div className="er-mobile-actions">
            <button
              onClick={handleLogin}
              className="er-btn-signin"
              type="button"
            >
              تسجيل دخول
            </button>
            <button
              onClick={handleSignup}
              className="er-btn-signup"
              type="button"
            >
              تسجيل حساب جديد
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
