import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, X, ArrowLeft, ArrowRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/myui/forms";
import logo from "@/assets/logo/logo.png";
import { useResetPassword } from "../../hooks/useResetPassword";
import "./ResetPasswordModal.css";

/**
 * Editorial Password Reset Component (Eleven Reader & Apple Light Mode).
 * Supports both inline rendering inside auth layouts and standalone modal dialogues.
 *
 * @param {Object} props
 * @param {() => void} props.onClose - Action to close or return from reset flow
 * @param {boolean} [props.inline=false] - Whether to render inline inside auth layout
 */
export function ResetPasswordModal({ onClose, inline = false }) {
  const {
    step,
    setStep,
    email,
    setEmail,
    code,
    setCode,
    newPw,
    setNewPw,
    confirmPw,
    setConfirmPw,
    showPw,
    setShowPw,
    showConfirm,
    setShowConfirm,
    errors,
    cooldown,
    loading,
    sendEmail,
    verifyCode,
    resendCode,
    savePassword,
  } = useResetPassword({ onClose });

  const renderContent = () => (
    <div className="reset-flow-container" dir="rtl">
      {/* Header */}
      <header className="reset-header">
        {inline && (
          <Link to="/" className="reset-logo-link" aria-label="الصفحة الرئيسية">
            <img src={logo} alt="Ktab Logo" className="reset-logo-img" />
          </Link>
        )}

        {/* 3-Step Pill Progress Bar */}
        <div className="reset-stepper" aria-hidden="true">
          <span
            className={`reset-stepper-bar ${
              step >= 1 ? (step === 1 ? "is-active" : "is-completed") : ""
            }`}
          />
          <span
            className={`reset-stepper-bar ${
              step >= 2 ? (step === 2 ? "is-active" : "is-completed") : ""
            }`}
          />
          <span
            className={`reset-stepper-bar ${
              step >= 3 ? (step === 3 ? "is-active" : "is-completed") : ""
            }`}
          />
        </div>

        <h1 className="reset-title">
          {step === 1 && "استعادة كلمة المرور"}
          {step === 2 && "رمز التحقق"}
          {step === 3 && "كلمة مرور جديدة"}
        </h1>

        <p className="reset-subtitle">
          {step === 1 && "أدخل بريدك الإلكتروني لتلقي رمز التحقق واستعادة حسابك"}
          {step === 2 && (
            <>
              أدخل رمز التحقق المكون من 6 أرقام المرسل إلى{" "}
              <span className="reset-email-highlight">{email}</span>
            </>
          )}
          {step === 3 && "قم بإنشاء كلمة مرور قوية وجديدة لتأمين حسابك"}
        </p>
      </header>

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <form
          className="reset-form"
          onSubmit={(e) => {
            e.preventDefault();
            sendEmail();
          }}
        >
          <div className="reset-field-wrap">
            <label className="reset-label" htmlFor="resetEmail">
              البريد الإلكتروني
            </label>
            <input
              id="resetEmail"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={`reset-input ${errors.email ? "has-error" : ""}`}
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <p className="reset-error-msg">{errors.email}</p>
            )}
          </div>

          <div className="reset-actions-wrap">
            <button
              type="submit"
              disabled={loading}
              className="reset-btn-primary"
            >
              <span>{loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}</span>
              {!loading && <ArrowLeft size={16} strokeWidth={2.4} />}
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="reset-btn-secondary"
              >
                <ArrowRight size={16} strokeWidth={2.4} />
                <span>العودة لتسجيل الدخول</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* STEP 2: Enter OTP Code */}
      {step === 2 && (
        <form
          className="reset-form"
          onSubmit={(e) => {
            e.preventDefault();
            verifyCode();
          }}
        >
          <div className="reset-otp-wrap">
            <div dir="ltr">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                autoFocus
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      hasError={Boolean(errors.code)}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {errors.code && (
              <p className="reset-error-msg">{errors.code}</p>
            )}

            {cooldown > 0 ? (
              <p className="reset-cooldown-text">
                إعادة إرسال الرمز خلال <strong>{cooldown}</strong> ثانية
              </p>
            ) : (
              <button
                type="button"
                onClick={resendCode}
                disabled={loading}
                className="reset-resend-link"
              >
                لم يصلك الرمز؟ إعادة الإرسال
              </button>
            )}
          </div>

          <div className="reset-actions-wrap">
            <button
              type="submit"
              disabled={code.length < 6 || loading}
              className="reset-btn-primary"
            >
              <span>المتابعة</span>
              <ArrowLeft size={16} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="reset-btn-secondary"
            >
              <ArrowRight size={16} strokeWidth={2.4} />
              <span>تعديل البريد الإلكتروني</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Enter New Password */}
      {step === 3 && (
        <form
          className="reset-form"
          onSubmit={(e) => {
            e.preventDefault();
            savePassword();
          }}
        >
          {/* New Password */}
          <div className="reset-field-wrap">
            <label className="reset-label" htmlFor="resetNewPassword">
              كلمة المرور الجديدة
            </label>
            <div className="reset-password-wrap">
              <input
                id="resetNewPassword"
                type={showPw ? "text" : "password"}
                dir="ltr"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="أدخل كلمة المرور الجديدة"
                className={`reset-input reset-password-input ${errors.newPw ? "has-error" : ""}`}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="reset-eye-btn"
                aria-label={showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.newPw && (
              <p className="reset-error-msg">{errors.newPw}</p>
            )}
            <p className="reset-helper-hint">
              يجب أن تحتوي على 8 أحرف على الأقل، تشمل حروفاً كبيرة وصغيرة ورقماً ورمزاً.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="reset-field-wrap">
            <label className="reset-label" htmlFor="resetConfirmPassword">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="reset-password-wrap">
              <input
                id="resetConfirmPassword"
                type={showConfirm ? "text" : "password"}
                dir="ltr"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                className={`reset-input reset-password-input ${errors.confirmPw ? "has-error" : ""}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="reset-eye-btn"
                aria-label={showConfirm ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.confirmPw && (
              <p className="reset-error-msg">{errors.confirmPw}</p>
            )}
          </div>

          <div className="reset-actions-wrap">
            <button
              type="submit"
              disabled={loading}
              className="reset-btn-primary"
            >
              <span>{loading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}</span>
              {!loading && <ArrowLeft size={16} strokeWidth={2.4} />}
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="reset-btn-secondary"
            >
              <ArrowRight size={16} strokeWidth={2.4} />
              <span>رجوع للرمز</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (inline) {
    return renderContent();
  }

  return (
    <div className="reset-modal-backdrop" dir="rtl">
      <div className="reset-modal-card">
        {onClose && (
          <button
            onClick={onClose}
            className="reset-modal-close-btn"
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
}

export default ResetPasswordModal;
