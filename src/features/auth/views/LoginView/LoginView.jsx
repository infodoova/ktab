import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { AuthLayout } from "../../components/AuthLayout";
import { ResetPasswordModal } from "../../components/ResetPasswordModal";
import { GoogleRoleModal } from "../../components/GoogleRoleModal";
import { useLogin } from "../../hooks/useLogin";
import "./LoginView.css";

/**
 * Pure presentation view for the Login page in Light Mode.
 * Styled after Eleven Reader and Apple editorial design.
 */
export function LoginView() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get("redirect");
  const backUrl = redirectTarget && redirectTarget.startsWith("/") ? redirectTarget : "/";
  const signupLink = location.search ? `/signup${location.search}` : "/signup";

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    loading,
    googleLoading,
    isGoogleReady,
    googleBtnRef,
    triggerGooglePrompt,
    resetOpen,
    setResetOpen,
    googleRoleOpen,
    setGoogleRoleOpen,
    selectedGoogleRole,
    setSelectedGoogleRole,
    googleCompleteLoading,
    handleCompleteGoogleRegistration,
    handleSubmit,
  } = useLogin();

  return (
    <AuthLayout backUrl={backUrl}>
      <div className="login-view-container" dir="rtl">
        {googleRoleOpen ? (
          <GoogleRoleModal
            selectedRole={selectedGoogleRole}
            onSelectRole={setSelectedGoogleRole}
            onSubmit={handleCompleteGoogleRegistration}
            loading={googleCompleteLoading}
            onClose={() => setGoogleRoleOpen(false)}
          />
        ) : !resetOpen ? (
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

            {/* Divider */}
            <div className="login-divider">
              <span className="login-divider-line"></span>
              <span className="login-divider-text">أو المتابعة عبر</span>
              <span className="login-divider-line"></span>
            </div>

            {/* Google OAuth Action: Clean native Google button */}
            <div className="login-google-wrap">
              <div
                ref={googleBtnRef}
                className="login-google-btn-rendered"
              />
              {!isGoogleReady && (
                <div className="login-google-skeleton" aria-hidden="true" />
              )}
            </div>

            {googleLoading && (
              <p className="login-google-loading-text">جاري التحقق من حساب Google...</p>
            )}

            {/* Footer: Sign up link */}
            <footer className="login-footer">
              <p className="login-footer-text">
                ليس لديك حساب بعد؟
                <Link to={signupLink} className="login-footer-link">
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
