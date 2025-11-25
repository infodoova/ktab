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
import { AlertToast } from "./AlertToast"; // Adjust path as needed

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

  // Toast State
  const [toastState, setToastState] = useState({
    open: false,
    variant: "info", // 'success', 'error', 'info'
    title: "",
    description: "",
  });

  // Helper to show toast
  const showToast = (variant, title, description) => {
    setToastState({
      open: true,
      variant,
      title,
      description,
    });
  };

  // Close toast handler
  const handleCloseToast = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        // ERROR TOAST
        showToast("error", "فشل الإرسال", "تعذر إرسال رمز إعادة تعيين كلمة المرور");
        return;
      }

      setStep(2);
      setCooldown(15); // Start cooldown
      // OPTIONAL INFO TOAST
      showToast("success", "تم الإرسال", "تحقق من بريدك الإلكتروني للحصول على الرمز");

    } catch {
      showToast("error", "خطأ في الاتصال", "تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    }
  };

  // -------------------------------
  // STEP 2 — Verify Code
  // -------------------------------
  const verifyCode = async () => {
    if (code.length < 6) {
      setErrors({ code: "الرمز غير مكتمل" });
      showToast("error", "الرمز غير صالح", "يرجى إدخال الرمز المكون من 6 أرقام بالكامل");
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
      e.newPw = "يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم ورمز.";

    if (!confirmPw) e.confirmPw = "يرجى تأكيد كلمة المرور";
    else if (newPw !== confirmPw) e.confirmPw = "كلمتا المرور غير متطابقتين";

    if (Object.keys(e).length) {
      setErrors(e);
      showToast("error", "خطأ في البيانات", "يرجى التأكد من صحة البيانات المدخلة");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            code,
            newPassword: newPw,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        showToast("error", "فشل التغيير", "حدث خطأ أثناء تغيير كلمة المرور، حاول مرة أخرى");
        return;
      }

      // SUCCESS TOAST
      showToast("success", "تم بنجاح", "تم تغيير كلمة المرور بنجاح");
      
      // Delay close slightly so user sees the toast
      setTimeout(() => {
        onClose?.();
      }, 2000);

    } catch {
      showToast("error", "خطأ في النظام", "لم يتم حفظ كلمة المرور بسبب مشكلة في الاتصال");
    }
  };

  // -------------------------------
  // FAKE RESEND WITH COOLDOWN
  // -------------------------------
  const resendCode = () => {
    if (cooldown > 0) return;
    setCooldown(15);
    showToast("info", "إعادة إرسال", "تم إرسال رمز جديد إلى بريدك الإلكتروني");
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
  <div
  dir="rtl"
  className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--earth-cream)] px-4 py-8"
>
  <AlertToast
    open={toastState.open}
    variant={toastState.variant}
    title={toastState.title}
    description={toastState.description}
    onClose={handleCloseToast}
  />

  {/* CLOSE BUTTON */}
  {onClose && (
    <button
      onClick={onClose}
      className="absolute left-6 top-6 text-[var(--earth-brown)]/60 hover:text-[var(--earth-brown)] transition"
    >
      <X className="w-6 h-6" />
    </button>
  )}

  {/* CARD */}
  <div className="
      w-full max-w-md 
      bg-white/70 
      backdrop-blur-lg 
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
      rounded-3xl 
      px-8 py-10
      border border-[var(--earth-sand)]/40
      animate-fadeIn
    "
  >
    {/* TITLE */}
    <h1 className="text-2xl font-extrabold text-[var(--earth-brown-dark)] text-center">
      إعادة تعيين كلمة المرور
    </h1>

    <p className="text-center text-[var(--earth-brown)]/60 mt-2 text-sm leading-relaxed">
      {step === 1 && "أدخل بريدك الإلكتروني لاستعادة كلمة المرور"}
      {step === 2 && "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني"}
      {step === 3 && "قم بإنشاء كلمة مرور جديدة لحسابك"}
    </p>

    {/* STEP 1 */}
    {step === 1 && (
      <div className="mt-10 space-y-6">
        <Label className="text-[var(--earth-brown)] font-medium">البريد الإلكتروني</Label>
        <Input
          dir="ltr"
          type="email"
          value={email}
          placeholder="example@mail.com"
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white h-12 text-sm rounded-xl border-[var(--earth-sand)]"
        />
        {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onClose}
            className="w-1/2 h-12 bg-gray-200 text-black rounded-xl hover:bg-gray-300"
          >
            <ArrowRight className="w-4 ml-2" /> رجوع
          </Button>
          <Button
            onClick={sendEmail}
            className="w-1/2 h-12 bg-[var(--earth-brown)] text-white rounded-xl hover:bg-[var(--earth-brown-dark)]"
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
                  className="!w-12 !h-14 text-xl font-bold bg-white border border-[var(--earth-sand)] rounded-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {errors.code && (
          <p className="text-red-600 text-xs text-center">{errors.code}</p>
        )}

        {/* RESEND */}
        <p className="text-center text-[var(--earth-brown)]/70 text-sm">
          {cooldown > 0 ? (
            <>إعادة الإرسال خلال <b>{cooldown}</b> ثانية</>
          ) : (
            <span
              onClick={resendCode}
              className="cursor-pointer text-[var(--earth-brown)] font-semibold hover:underline"
            >
              إعادة إرسال الرمز
            </span>
          )}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <Button
            onClick={() => setStep(1)}
            className="w-1/2 h-12 bg-gray-200 text-black rounded-xl hover:bg-gray-300"
          >
            <ArrowRight className="w-4 ml-2" /> رجوع
          </Button>
          <Button
            onClick={verifyCode}
            className="w-1/2 h-12 bg-[var(--earth-brown)] text-white rounded-xl hover:bg-[var(--earth-brown-dark)]"
          >
            التالي <ArrowLeft className="w-4 mr-2" />
          </Button>
        </div>
      </div>
    )}

    {/* STEP 3 */}
    {step === 3 && (
      <div className="mt-10 space-y-6">
        <Label className="text-[var(--earth-brown)] font-medium">كلمة المرور الجديدة</Label>
        <div className="relative">
          <Input
            type={showPw ? "text" : "password"}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="bg-white h-12 rounded-xl border-[var(--earth-sand)] pr-12"
          />
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPw(!showPw)}
          >
            {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPw && <p className="text-red-600 text-xs">{errors.newPw}</p>}

        <Label className="text-[var(--earth-brown)] font-medium">تأكيد كلمة المرور</Label>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="bg-white h-12 rounded-xl border-[var(--earth-sand)] pr-12"
          />
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPw && <p className="text-red-600 text-xs">{errors.confirmPw}</p>}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => setStep(2)}
            className="w-1/2 h-12 bg-gray-200 text-black rounded-xl hover:bg-gray-300"
          >
            <ArrowRight className="w-4 ml-2" /> رجوع
          </Button>
          <Button
            onClick={savePassword}
            className="w-1/2 h-12 bg-[var(--earth-brown)] text-white rounded-xl hover:bg-[var(--earth-brown-dark)]"
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