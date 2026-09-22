import React from "react";
import { Link } from "react-router-dom";
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
    <AuthLayout backUrl="/">
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

            {/* Google OAuth Action: Official GIS Button */}
            <div className="login-google-wrap">
              <div className="login-google-container">
                <div
                  ref={googleBtnRef}
                  className={`login-google-btn-rendered ${!isGoogleReady ? "login-google-btn-rendered--hidden" : ""}`}
                />
                {!isGoogleReady && (
                  <button
                    type="button"
                    className="login-btn-google"
                    aria-label="تسجيل الدخول باستخدام Google"
                    disabled={googleLoading}
                    onClick={triggerGooglePrompt}
                  >
                    <svg
                      className="login-google-icon"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>المتابعة باستخدام Google</span>
                  </button>
                )}
              </div>

              {googleLoading && (
                <p className="login-google-loading-text">جاري التحقق من حساب Google...</p>
              )}
            </div>

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
