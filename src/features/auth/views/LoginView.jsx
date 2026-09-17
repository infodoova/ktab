import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordModal } from "../components/ResetPasswordModal";
import { useLogin } from "../hooks/useLogin";
import "./LoginView.css";

/**
 * Pure presentation view for the Login page in Light Mode.
 * Styled after Eleven Reader and Apple editorial design.
 */
export function LoginView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    loading,
    resetOpen,
    setResetOpen,
    handleSubmit,
  } = useLogin();

  return (
    <AuthLayout backUrl="/">
      <div className="login-view-container" dir="rtl">
        {!resetOpen ? (
          <>
            {/* Header with App Logo */}
            <header className="login-header">
              <Link to="/" className="auth-logo-link" aria-label="الرئيسية">
                <img src={logo} alt="Ktab Logo" className="auth-logo-img" />
              </Link>
              <h1 className="login-title">أهلاً بك مجدداً</h1>
              <p className="login-subtitle">
                سجّل دخولك لمتابعة الاستماع وقراءة كتبك وقصصك المفضلة
              </p>
            </header>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="login-field-wrap">
                <label className="login-label" htmlFor="loginEmail">
                  البريد الإلكتروني
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`login-input ${errors.email ? "has-error" : ""}`}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="login-error-msg">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="login-field-wrap">
                <div className="login-label-row">
                  <label className="login-label" htmlFor="loginPassword">
                    كلمة المرور
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetOpen(true)}
                    className="login-forgot-link"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <div className="login-password-wrap">
                  <input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`login-input login-password-input ${errors.password ? "has-error" : ""}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-eye-btn"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="login-error-msg">{errors.password}</p>
                )}
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn-primary"
              >
                <span>{loading ? "جاري الدخول..." : "تسجيل الدخول"}</span>
                {!loading && <ArrowLeft size={16} strokeWidth={2.4} />}
              </button>
            </form>

            {/* Footer: Sign up link */}
            <footer className="login-footer">
              <p className="login-footer-text">
                ليس لديك حساب بعد؟
                <Link to="/signup" className="login-footer-link">
                  إنشاء حساب جديد
                </Link>
              </p>
            </footer>
          </>
        ) : (
          <ResetPasswordModal
            inline={true}
            onClose={() => setResetOpen(false)}
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default LoginView;
