import { useState, useEffect } from "react";
import { sendPasswordResetApi, resetPasswordApi } from "@/core/api/authApi";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  validateEmail,
  validateVerificationCode,
  validateStrongPassword,
  validatePasswordConfirmation,
} from "@/utils/validation";

/**
 * Hook managing the 3-step Password Reset state machine and cooldown timers.
 */
export function useResetPassword({ onClose } = {}) {
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // UI & auxiliary states
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // STEP 1 — Request Reset Code
  const sendEmail = async () => {
    const nextErrors = {};

    const emailErr = validateEmail(email, {
      requiredMessage: "يرجى إدخال البريد الإلكتروني",
      invalidMessage: "صيغة بريد إلكتروني غير صحيحة",
    });
    if (emailErr) {
      nextErrors.email = emailErr;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const data = await sendPasswordResetApi({ email });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "حدث خطأ في الإرسال", data?.messageStatus || "ERROR");
        return;
      }

      setStep(2);
      setCooldown(15);
      AlertToast(data?.message || "تم إرسال رمز التحقق", "SUCCESS");
    } catch {
      AlertToast("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — Validate Code input
  const verifyCode = () => {
    const codeErr = validateVerificationCode(code, 6);
    if (codeErr) {
      setErrors({ code: "الرمز غير مكتمل" });
      AlertToast(codeErr, "ERROR");
      return;
    }

    setErrors({});
    setStep(3);
  };

  // STEP 2 — Resend Code
  const resendCode = async () => {
    if (cooldown > 0 || loading) return;

    setLoading(true);
    try {
      const data = await sendPasswordResetApi({ email });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "حدث خطأ في إعادة الإرسال", data?.messageStatus || "ERROR");
        return;
      }

      setCooldown(150); // 2.5 minutes
      AlertToast(data?.message || "تمت إعادة إرسال الرمز", "SUCCESS");
    } catch {
      AlertToast("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 — Save New Password
  const savePassword = async () => {
    const nextErrors = {};

    const pwErr = validateStrongPassword(newPw);
    if (pwErr) {
      nextErrors.newPw = pwErr;
    }

    const confirmErr = validatePasswordConfirmation(newPw, confirmPw);
    if (confirmErr) {
      nextErrors.confirmPw = confirmErr;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      AlertToast("يرجى التأكد من صحة البيانات المدخلة", "ERROR");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPasswordApi({
        email,
        code,
        newPassword: newPw,
      });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "فشل تغيير كلمة المرور", data?.messageStatus || "ERROR");
        return;
      }

      AlertToast(data?.message || "تم تغيير كلمة المرور بنجاح", "SUCCESS");

      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch {
      AlertToast("لم يتم حفظ كلمة المرور بسبب مشكلة في الاتصال", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
