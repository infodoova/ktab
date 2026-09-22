import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { Select } from "@/components/myui/forms";
import { AuthLayout } from "../../components/AuthLayout";
import { CodeVerifyModal } from "../../components/CodeVerifyModal";
import { useSignup } from "../../hooks/useSignup";
import "./SignupView.css";

/**
 * Minimalist, Streamlined 2-Step Signup View in Light Mode.
 * - Integrated MyUI Select Dropdown (قارئ / مؤلف)
 * - Clean, uncluttered 2-step input progression
 */
export function SignupView() {
  const {
    step,
    nextStep,
    prevStep,
    form,
    setFormField,
    setRole,
    errors,
    loading,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    verifyOpen,
    setVerifyOpen,
    handleSubmit,
  } = useSignup();

  return (
    <AuthLayout backUrl="/">
      <div className="signup-view-container" dir="rtl">
        {!verifyOpen ? (
          <>
            {/* Header with App Logo */}
            <header className="signup-header">
              <Link to="/" className="auth-logo-link" aria-label="الرئيسية">
                <img src={logo} alt="Ktab Logo" className="auth-logo-img" />
              </Link>
              <h1 className="signup-title">إنشاء حساب جديد</h1>
              <p className="signup-subtitle">
                {step === 1
                  ? "أدخل بياناتك الأساسية للبدء في المنصة"
                  : "عيّن كلمة المرور لتأمين حسابك"}
              </p>
            </header>

            {/* Minimal Step Indicator */}
            <div className="signup-step-indicator">
              <span className="signup-step-text">
                {step === 1 ? "الخطوة 1: البيانات الأساسية" : "الخطوة 2: تأمين الحساب"}
              </span>
              <div className="signup-step-dots" aria-hidden="true">
                <span className={`signup-dot ${step >= 1 ? "is-active" : ""}`} />
                <span className={`signup-dot ${step >= 2 ? "is-active" : ""}`} />
              </div>
            </div>

            {/* Form Content with Animated Step Transition */}
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* ══════════════════════════════════════════════════════
                     STEP 1: BASIC INFO & SELECT ROLE
                     ══════════════════════════════════════════════════════ */
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    className="signup-form-step"
                  >
                    {/* Role Selection using MyUI Select */}
                    <Select
                      id="roleSelect"
                      label="نوع الحساب"
                      value={form.role}
                      onChange={(e) => setRole(e.target.value)}
                      options={[
                        { value: "READER", label: "قارئ" },
                        { value: "AUTHOR", label: "مؤلف" },
                      ]}
                      error={errors.role}
                    />

                    {/* Names Grid: First & Last Name */}
                    <div className="signup-names-grid">
                      {/* First Name */}
                      <div className="signup-field-wrap">
                        <label className="signup-label" htmlFor="firstName">
                          الاسم الأول
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          placeholder="مثال: أحمد"
                          value={form.firstName}
                          onChange={(e) => setFormField("firstName", e.target.value)}
                          className={`signup-input ${errors.firstName ? "has-error" : ""}`}
                          autoComplete="given-name"
                        />
                        {errors.firstName && (
                          <p className="signup-error-msg">{errors.firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div className="signup-field-wrap">
                        <label className="signup-label" htmlFor="lastName">
                          الاسم الأخير
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          placeholder="مثال: العلي"
                          value={form.lastName}
                          onChange={(e) => setFormField("lastName", e.target.value)}
                          className={`signup-input ${errors.lastName ? "has-error" : ""}`}
                          autoComplete="family-name"
                        />
                        {errors.lastName && (
                          <p className="signup-error-msg">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="signup-field-wrap">
                      <label className="signup-label" htmlFor="email">
                        البريد الإلكتروني
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => setFormField("email", e.target.value)}
                        className={`signup-input ${errors.email ? "has-error" : ""}`}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="signup-error-msg">{errors.email}</p>
                      )}
                    </div>

                    {/* Step 1 CTA: Continue */}
                    <div className="signup-actions-wrap">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="signup-btn-primary"
                      >
                        <span>المتابعة إلى الخطوة التالية</span>
                        <ArrowLeft size={16} strokeWidth={2.4} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ══════════════════════════════════════════════════════
                     STEP 2: PASSWORD & SECURITY
                     ══════════════════════════════════════════════════════ */
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="signup-form-step"
                  >
                    {/* Password Field */}
                    <div className="signup-field-wrap">
                      <label className="signup-label" htmlFor="password">
                        كلمة المرور
                      </label>
                      <div className="signup-password-wrap">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="8 أحرف تشمل حروفاً كبيرة وصغيرة ورقماً ورمزاً"
                          value={form.password}
                          onChange={(e) => setFormField("password", e.target.value)}
                          className={`signup-input signup-password-input ${errors.password ? "has-error" : ""}`}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="signup-eye-btn"
                          aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="signup-error-msg">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="signup-field-wrap">
                      <label className="signup-label" htmlFor="confirmPassword">
                        تأكيد كلمة المرور
                      </label>
                      <div className="signup-password-wrap">
                        <input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="أعد إدخال كلمة المرور"
                          value={form.confirmPassword}
                          onChange={(e) => setFormField("confirmPassword", e.target.value)}
                          className={`signup-input signup-password-input ${errors.confirmPassword ? "has-error" : ""}`}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="signup-eye-btn"
                          aria-label={showConfirm ? "إخفاء التأكيد" : "إظهار التأكيد"}
                        >
                          {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="signup-error-msg">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Step 2 Actions: Back + Submit */}
                    <div className="signup-actions-wrap">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="signup-btn-secondary"
                      >
                        <ArrowRight size={16} strokeWidth={2.4} />
                        <span>السابق</span>
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="signup-btn-primary"
                      >
                        <span>{loading ? "جاري الإنشاء..." : "إنشاء الحساب"}</span>
                        {!loading && <ArrowLeft size={16} strokeWidth={2.4} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Footer: Sign in link */}
            <footer className="signup-footer">
              <p className="signup-footer-text">
                لديك حساب بالفعل؟
                <Link to="/login" className="signup-footer-link">
                  سجل دخولك الآن
                </Link>
              </p>
            </footer>
          </>
        ) : (
          <CodeVerifyModal
            inline={true}
            email={form.email}
            onClose={() => setVerifyOpen(false)}
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default SignupView;
