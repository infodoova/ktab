import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye, EyeOff, X, ArrowRight, ArrowLeft } from "lucide-react";
import { AlertToast } from "./AlertToast";
import { postHelper } from "../../../apis/apiHelpers";
export default function ResetPassword({ onClose }) {
  const [step, setStep] = useState(1);

  // Form States
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // UI States
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // -------------------------------
  // STEP 1 — Send Email (Fetch)
  // -------------------------------
  const sendEmail = async () => {
    const e = {};

    if (!email.trim()) e.email = "يرجى إدخال البريد الإلكتروني";
    else if (!emailRegex.test(email)) e.email = "صيغة بريد إلكتروني غير صحيحة";

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/send-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (data.messageStatus != "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        return;
      }

      setStep(2);
      setCooldown(15); // Start cooldown
      AlertToast(data?.message, data?.messageStatus);
    } catch {
      AlertToast("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً", "ERROR");
    }
  };

  // -------------------------------
  // STEP 2 — Verify Code
  // -------------------------------
  const verifyCode = async () => {
    if (code.length < 6) {
      setErrors({ code: "الرمز غير مكتمل" });
      AlertToast("يرجى إدخال الرمز المكون من 6 أرقام بالكامل", "ERROR");
      return;
    }

    setErrors({});
    setStep(3);
  };

  // -------------------------------
  // STEP 3 — Save New Password (Fetch)
  // -------------------------------
  const savePassword = async () => {
    const e = {};

    if (!newPw) e.newPw = "كلمة المرور مطلوبة";
    else if (!passwordRegex.test(newPw))
      e.newPw =
        "يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم ورمز.";

    if (!confirmPw) e.confirmPw = "يرجى تأكيد كلمة المرور";
    else if (newPw !== confirmPw) e.confirmPw = "كلمتا المرور غير متطابقتين";

    if (Object.keys(e).length) {
      setErrors(e);
      AlertToast("يرجى التأكد من صحة البيانات المدخلة", "ERROR");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },

          body: JSON.stringify({
            email,
            code,
            newPassword: newPw,
          }),
        },
      );

      const data = await response.json();

      if (data.messageStatus != "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        return;
      }
      AlertToast(data?.message, data?.messageStatus);

      // Delay close slightly so user sees the toast
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch {
      AlertToast("لم يتم حفظ كلمة المرور بسبب مشكلة في الاتصال", "error");
    }
  };

  // -------------------------------
  // FAKE RESEND WITH COOLDOWN
  // -------------------------------
  const resendCode = async () => {
    if (cooldown > 0) return;

    try {
      const data = await postHelper({
        url: `${import.meta.env.VITE_API_URL}/auth/send-reset`,
        body: { email },
      });

      if (data.messageStatus != "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        return;
      }

      setCooldown(150); // 2.5 minutes
      AlertToast(data?.message, data?.messageStatus);
    } catch {
      AlertToast("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً", "error");
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white px-4 py-8 overflow-y-auto custom-scrollbar"
    >
      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-black/50 hover:text-black transition"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* CARD */}
      <div
        className="
        w-full max-w-md
        bg-[var(--glass-bg)]
        backdrop-blur-md
        shadow-[var(--shadow-soft)]
        rounded-3xl
        px-8 py-10
        border border-[var(--glass-border)]
        animate-fadeIn
      "
      >
        {/* TITLE */}
        <h1 className="text-2xl font-extrabold text-[var(--primary-text)] text-center">
          إعادة تعيين كلمة المرور
        </h1>

        <p className="text-center text-black/60 mt-3 text-sm leading-relaxed">
          {step === 1 && "أدخل بريدك الإلكتروني لاستعادة كلمة المرور"}
          {step === 2 && "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني"}
          {step === 3 && "قم بإنشاء كلمة مرور جديدة لحسابك"}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="mt-10 space-y-6">
            <Label className="text-black font-medium">البريد الإلكتروني</Label>

            <Input
              dir="ltr"
              type="email"
              value={email}
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white h-12 text-sm rounded-xl border-black/10 focus-visible:ring-black/20"
            />

            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email}</p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                className="w-1/2 h-12 bg-black/5 text-black rounded-xl hover:bg-black/10"
              >
                <ArrowRight className="w-4 ml-2" /> رجوع
              </Button>

              <Button
                onClick={sendEmail}
                className="w-1/2 h-12 text-black font-bold rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: "var(--gradient)" }}
              >
                التالي <ArrowLeft className="w-4 mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="mt-10 space-y-8">
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
                  className="cursor-pointer text-black font-semibold hover:underline"
                >
                  إعادة إرسال الرمز
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                className="w-1/2 h-12 bg-black/5 text-black rounded-xl hover:bg-black/10"
              >
                <ArrowRight className="w-4 ml-2" /> رجوع
              </Button>

              <Button
                onClick={verifyCode}
                className="w-1/2 h-12 text-black font-bold rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: "var(--gradient)" }}
              >
                التالي <ArrowLeft className="w-4 mr-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="mt-10 space-y-6">
            <Label className="text-black font-medium">
              كلمة المرور الجديدة
            </Label>

            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="bg-white h-12 rounded-xl border-black/10 pr-12"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.newPw && (
              <p className="text-red-600 text-xs">{errors.newPw}</p>
            )}

            <Label className="text-black font-medium">تأكيد كلمة المرور</Label>

            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="bg-white h-12 rounded-xl border-black/10 pr-12"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPw && (
              <p className="text-red-600 text-xs">{errors.confirmPw}</p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setStep(2)}
                className="w-1/2 h-12 bg-black/5 text-black rounded-xl hover:bg-black/10"
              >
                <ArrowRight className="w-4 ml-2" /> رجوع
              </Button>

              <Button
                onClick={savePassword}
                className="w-1/2 h-12 text-black font-bold rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: "var(--gradient)" }}
              >
                حفظ <ArrowLeft className="w-4 mr-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
