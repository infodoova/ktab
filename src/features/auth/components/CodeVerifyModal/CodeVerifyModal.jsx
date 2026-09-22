import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Button,
} from "@/components/myui/forms";
import { X, ArrowLeft } from "lucide-react";
import { useCodeVerify } from "../../hooks/useCodeVerify";

/**
 * OTP Code Verification Component.
 * Supports inline rendering directly replacing the auth form (inline=true),
 * or modal overlay rendering (inline=false).
 *
 * @param {{ email: string, onClose?: () => void, inline?: boolean }} props
 */
export function CodeVerifyModal({ email, onClose, inline = false }) {
  const {
    code,
    setCode,
    timer,
    canResend,
    loading,
    handleResend,
    handleVerify,
  } = useCodeVerify({ email });

  const content = (
    <div
      dir="rtl"
      className={
        inline
          ? "w-full max-w-[460px] flex flex-col items-center text-center"
          : "w-full max-w-md flex flex-col items-center text-center"
      }
    >
      {/* Title */}
      <h1 className="text-3xl font-black text-black mb-2 tracking-tight">
        تأكيد البريد الإلكتروني
      </h1>

      <p className="text-black/60 text-sm mb-8 max-w-xs sm:max-w-sm leading-relaxed">
        أدخل رمز التحقق المكوّن من 6 أرقام والذي تم إرساله إلى{" "}
        <span className="font-semibold text-black" dir="ltr">{email}</span>
      </p>

      {/* OTP Slots */}
      <div dir="ltr" className="w-full flex justify-center mb-6">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup className="flex gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="
                  !w-12 !h-14 text-xl
                  font-bold text-center
                  bg-white
                  border border-black/15
                  rounded-xl
                  shadow-sm
                  focus:border-black
                "
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Confirm Button */}
      <Button
        disabled={code.length < 6 || loading}
        onClick={handleVerify}
        className="
          w-full h-12
          text-base font-bold
          text-black
          rounded-xl
          transition-all
          hover:scale-[1.01]
          active:scale-[0.99]
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
        style={{ background: "var(--brand-teal, #5de3ba)" }}
      >
        <span>{loading ? "جاري التحقق..." : "تأكيد الرمز"}</span>
        {!loading && <ArrowLeft className="w-4 mr-2" />}
      </Button>

      {/* Resend Link / Timer */}
      <div className="mt-6 text-black/60 text-sm">
        {canResend ? (
          <span
            onClick={handleResend}
            className="font-semibold text-black hover:text-[var(--brand-teal-dark,#4ed4ab)] hover:underline cursor-pointer transition-colors"
          >
            إعادة إرسال الرمز
          </span>
        ) : (
          <span>
            يمكنك إعادة الإرسال بعد{" "}
            <span className="font-bold text-black">{timer}</span> ثانية
          </span>
        )}
      </div>

      {/* Back button if user made a typo in email */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-6 text-xs text-black/50 hover:text-[var(--brand-teal-dark,#4ed4ab)] transition-colors"
        >
          تعديل البريد الإلكتروني أو البيانات
        </button>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-4 py-8 font-sans"
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-black/50 hover:text-black transition"
          aria-label="إغلاق"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {content}
    </div>
  );
}

export default CodeVerifyModal;
