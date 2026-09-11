import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import authvideo from "@/assets/videos/auth.mp4";
import "./AuthLayout.css";

/**
 * Shared split-screen layout for authentication pages.
 *
 * - Right Panel: Clean form container with floating back button (Light Mode).
 * - Left Panel: Cinematic original video background.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The form / content to render on the right panel
 * @param {string} [props.backUrl="/"] - Where the back button navigates to
 */
export function AuthLayout({ children, backUrl = "/" }) {
  const navigate = useNavigate();

  return (
    <div className="auth-layout-container" dir="rtl">
      {/* ══════════════ FORM PANEL (RTL Right) ══════════════ */}
      <main className="auth-form-panel">
        {/* Floating Circular Back Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => navigate(backUrl)}
          className="auth-back-btn"
          type="button"
          aria-label="الرجوع إلى الصفحة الرئيسية"
        >
          <ArrowRight size={19} strokeWidth={2.4} />
        </motion.button>

        {/* Scrollable Form Content */}
        <div className="auth-form-content">
          {children}
        </div>
      </main>

      {/* ══════════════ VIDEO SHOWCASE PANEL (RTL Left) ══════════════ */}
      <aside className="auth-visual-panel" aria-hidden="true">
        <video
          src={authvideo}
          autoPlay
          loop
          muted
          playsInline
          className="auth-video-element"
        />
        <div className="auth-video-overlay" />
      </aside>
    </div>
  );
}

export default AuthLayout;
