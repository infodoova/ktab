import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff, X } from "lucide-react";
import { postHelper } from "../../../apis/apiHelpers"; // Ensure postHelper is correctly imported

export default function ResetPassword({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  // Password regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Email regex
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Step 1 - Send Email
  const sendEmail = async () => {
    const e = {};

    if (!email.trim()) e.email = "يرجى إدخال البريد الإلكتروني";
    else if (!emailRegex.test(email)) e.email = "صيغة بريد إلكتروني غير صحيحة";

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});

    // Send reset password code to email
    try {
      const res = await postHelper({
        url: `${import.meta.env.VITE_API_URL}/auth/send-reset`,
        body: { email },
      });

      if (!res.success) {
        setErrors({ email: "تعذر إرسال رمز إعادة تعيين كلمة المرور" });
        return;
      }

      setStep(2);
    } catch (err) {
      setErrors({ email: "حدث خطأ أثناء إرسال البريد الإلكتروني",err });
    }
  };

  // Step 2 - Verify Code
  const verifyCode = async () => {

          setStep(3);

  };

  // Step 3 - Save New Password
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
      return;
    }

    try {
      const res = await postHelper({
        url: `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        body: { email, code, newPassword: newPw },
      });

      if (!res.success) {
        setErrors({ newPw: "حدث خطأ أثناء تغيير كلمة المرور" });
        return;
      }

      alert("تم تغيير كلمة المرور بنجاح");
      onClose?.();
    } catch (err) {
      setErrors({ newPw: "حدث خطأ أثناء تغيير كلمة المرور" ,err});
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--earth-cream)] px-6 py-10"
    >
      {onClose && (
        <button
          className="absolute left-4 top-4 text-[var(--earth-brown)]/60 hover:text-[var(--earth-brown)]"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* TITLE */}
      <h1 className="text-[var(--earth-brown-dark)] text-3xl font-extrabold mb-2 text-center">
        إعادة تعيين كلمة المرور
      </h1>

      {/* ========================= STEP 1 ========================= */}
      {step === 1 && (
        <div className="w-full max-w-sm mt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-[var(--earth-brown)] font-medium">البريد الإلكتروني</Label>
            <Input
              dir="ltr"
              type="email"
              value={email}
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-[var(--earth-sand)]"
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
          </div>

          <Button
            className="w-full py-3 text-lg bg-[var(--earth-brown)] text-white rounded-xl"
            onClick={sendEmail}
          >
            إرسال الرمز
          </Button>
        </div>
      )}

      {/* ========================= STEP 2 ========================= */}
      {step === 2 && (
        <div className="w-full max-w-sm mt-8 space-y-8">
          <p className="text-center text-[var(--earth-brown)]/70 text-sm">
            أدخل الرمز المرسل إلى بريدك الإلكتروني.
          </p>

          <div dir="ltr" className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="flex gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="!w-12 !h-12 sm:!w-14 sm:!h-14 text-xl sm:text-2xl font-bold bg-white border border-[var(--earth-sand)] rounded-xl shadow-sm"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {errors.code && <p className="text-red-600 text-xs text-center">{errors.code}</p>}

          <Button
            className="w-full py-3 bg-[var(--earth-brown)] text-white rounded-xl"
            onClick={verifyCode}
          >
            تحقق من الرمز
          </Button>
        </div>
      )}

      {/* ========================= STEP 3 ========================= */}
      {step === 3 && (
        <div className="w-full max-w-sm mt-8 space-y-6">
          {/* NEW PASSWORD */}
          <div className="space-y-1">
            <Label className="text-[var(--earth-brown)]">كلمة المرور الجديدة</Label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="bg-white border-[var(--earth-sand)] pr-12"
              />
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--earth-brown)]/70"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPw && <p className="text-red-600 text-xs">{errors.newPw}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1">
            <Label className="text-[var(--earth-brown)]">تأكيد كلمة المرور</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="bg-white border-[var(--earth-sand)] pr-12"
              />
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--earth-brown)]/70"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPw && <p className="text-red-600 text-xs">{errors.confirmPw}</p>}
          </div>

          <Button
            className="w-full py-3 bg-[var(--earth-brown)] text-white rounded-xl"
            onClick={savePassword}
          >
            حفظ كلمة المرور الجديدة
          </Button>
        </div>
      )}
    </div>
  );
}
