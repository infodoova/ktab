import React from "react";
import { Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/myui/forms";
import { X, ArrowLeft, LoaderCircle } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { useCodeVerify } from "../../hooks/useCodeVerify";
import "./CodeVerifyModal.css";

/** Renders email verification inside the signup panel or as a standalone overlay. */
export function CodeVerifyModal({ email, onClose, onVerified, inline = false }) {
  const {
    code, setCode, timer, canResend, loading,
    handleResend, handleSubmit,
  } = useCodeVerify({ email, onVerified });

  const content = (
    <section dir="rtl" className="code-verify" aria-labelledby="code-verify-title">
      <header className="code-verify-header">
        <Link to="/" className="code-verify-logo-link" aria-label="الرئيسية">
          <img src={logo} alt="كتاب" className="code-verify-logo" />
        </Link>
        <h1 id="code-verify-title" className="code-verify-title">تأكيد البريد الإلكتروني</h1>
        <p id="code-verify-description" className="code-verify-description">
          أرسلنا إليك رمزًا من 6 أرقام. أدخله لتفعيل حسابك.
        </p>
        <p className="code-verify-email" dir="ltr">{email}</p>
      </header>

      <form className="code-verify-form" onSubmit={handleSubmit} aria-busy={loading}>
        <div dir="ltr" className="code-verify-input-wrap">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            disabled={loading}
            autoFocus
            autoComplete="one-time-code"
            inputMode="numeric"
            aria-label="رمز التحقق المكوّن من 6 أرقام"
            aria-describedby="code-verify-description"
            containerClassName="code-verify-input"
          >
            <InputOTPGroup className="code-verify-digits">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} className={`code-verify-digit${code[index] ? " is-filled" : ""}`} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button type="submit" className="code-verify-submit" disabled={code.length < 6 || loading}>
          <span>{loading ? "جاري التحقق..." : "تأكيد الرمز"}</span>
          {loading ? <LoaderCircle size={18} className="code-verify-spinner" aria-hidden="true" /> : <ArrowLeft size={18} aria-hidden="true" />}
        </button>
      </form>

      <div className="code-verify-help">
        <p className="code-verify-hint">لم يصلك الرمز؟ تحقّق من البريد غير المرغوب فيه.</p>
        {canResend ? (
          <button type="button" onClick={handleResend} disabled={loading} className="code-verify-resend">
            إعادة إرسال الرمز
          </button>
        ) : (
          <p className="code-verify-countdown">
            يمكنك إعادة الإرسال بعد <strong dir="ltr">{timer}</strong> ثانية
          </p>
        )}
      </div>

      {onClose && (
        <button type="button" onClick={onClose} disabled={loading} className="code-verify-edit">
          تعديل البريد الإلكتروني أو البيانات
        </button>
      )}
    </section>
  );

  if (inline) return content;

  return (
    <div dir="rtl" className="code-verify-overlay" role="dialog" aria-modal="true" aria-labelledby="code-verify-title">
      {onClose && (
        <button type="button" onClick={onClose} className="code-verify-close" aria-label="إغلاق">
          <X size={22} />
        </button>
      )}
      {content}
    </div>
  );
}

export default CodeVerifyModal;
