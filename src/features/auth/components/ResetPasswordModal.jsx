import React from "react";
import {
  Input,
  Label,
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/myui/forms";
import { Eye, EyeOff, X, ArrowRight, ArrowLeft } from "lucide-react";
import { useResetPassword } from "../hooks/useResetPassword";

/**
 * Password reset flow component.
 * Can be rendered directly inline replacing the auth form (inline=true),
 * or as a standalone modal (inline=false).
 *
 * @param {{ onClose: () => void, inline?: boolean }} props
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

  const content = (
    <div
      className={
        inline
          ? "w-full max-w-[460px] flex flex-col"
          : "w-full max-w-md bg-[var(--glass-bg)] backdrop-blur-md shadow-[var(--shadow-soft)] rounded-3xl px-8 py-10 border border-[var(--glass-border)] animate-fadeIn"
      }
      dir="rtl"
    >
      {/* Title */}
      <h1 className="text-3xl font-black text-[var(--brand-black, #0a0a0a)] text-center mb-2 tracking-tight">
        إعادة تعيين كلمة المرور
      </h1>

      <p className="text-center text-[#64748b] text-sm leading-relaxed mb-8">
        {step === 1 && "أدخل بريدك الإلكتروني لاستعادة كلمة المرور"}
        {step === 2 && "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني"}
        {step === 3 && "قم بإنشاء كلمة مرور جديدة لحسابك"}
      </p>

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[var(--brand-black, #0a0a0a)] font-bold text-xs">
              البريد الإلكتروني
            </Label>
            <Input
              type="email"
              value={email}
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white h-12 text-sm rounded-xl border-black/10 focus-visible:ring-black/20"
            />
            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              disabled={loading}
              onClick={sendEmail}
              className="w-1/2 h-12 text-black font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{ background: "var(--brand-teal, #5de3ba)" }}
            >
              <span>{loading ? "جاري الإرسال..." : "التالي"}</span>
              <ArrowLeft className="w-4 mr-2" />
            </Button>

            <Button
              type="button"
              onClick={onClose}
              className="w-1/2 h-12 bg-black/5 text-black rounded-xl hover:bg-[var(--brand-teal-soft,#e6faf4)] hover:border-[var(--brand-teal,#5de3ba)] border border-transparent font-bold transition-all"
            >
              <ArrowRight className="w-4 ml-2" /> إلغاء
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Enter OTP Code */}
      {step === 2 && (
        <div className="space-y-8">
          <div dir="ltr" className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="flex gap-3">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="
                      !w-12 !h-14
                      text-xl font-bold
                      bg-white
                      border border-black/10
                      rounded-xl
                    "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {errors.code && (
            <p className="text-red-600 text-xs text-center">{errors.code}</p>
          )}

          <p className="text-center text-black/60 text-sm">
            {cooldown > 0 ? (
              <>
                إعادة الإرسال خلال <b>{cooldown}</b> ثانية
              </>
            ) : (
              <span
                onClick={resendCode}
                className="cursor-pointer text-black font-semibold hover:text-[var(--brand-teal-dark,#4ed4ab)] hover:underline transition-colors"
              >
                إعادة إرسال الرمز
              </span>
            )}
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              disabled={code.length < 6 || loading}
              onClick={verifyCode}
              className="w-1/2 h-12 text-black font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{ background: "var(--brand-teal, #5de3ba)" }}
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 mr-2" />
            </Button>

            <Button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/2 h-12 bg-black/5 text-black rounded-xl hover:bg-[var(--brand-teal-soft,#e6faf4)] hover:border-[var(--brand-teal,#5de3ba)] border border-transparent font-bold transition-all"
            >
              <ArrowRight className="w-4 ml-2" /> رجوع
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Enter New Password */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[var(--brand-black, #0a0a0a)] font-bold text-xs">
              كلمة المرور الجديدة
            </Label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="bg-white h-12 rounded-xl border-black/10 pr-12 text-right"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-[var(--brand-teal,#5de3ba)] transition-colors"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPw && (
              <p className="text-red-600 text-xs">{errors.newPw}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--brand-black, #0a0a0a)] font-bold text-xs">
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="bg-white h-12 rounded-xl border-black/10 pr-12 text-right"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-[var(--brand-teal,#5de3ba)] transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPw && (
              <p className="text-red-600 text-xs">{errors.confirmPw}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              disabled={loading}
              onClick={savePassword}
              className="w-1/2 h-12 text-black font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{ background: "var(--brand-teal, #5de3ba)" }}
            >
              <span>{loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}</span>
              <ArrowLeft className="w-4 mr-2" />
            </Button>

            <Button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/2 h-12 bg-black/5 text-black rounded-xl hover:bg-[var(--brand-teal-soft,#e6faf4)] hover:border-[var(--brand-teal,#5de3ba)] border border-transparent font-bold transition-all"
            >
              <ArrowRight className="w-4 ml-2" /> رجوع
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white px-4 py-8 overflow-y-auto custom-scrollbar font-sans"
    >
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

export default ResetPasswordModal;
