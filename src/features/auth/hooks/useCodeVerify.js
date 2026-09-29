import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailApi, resendVerificationCodeApi } from "@/core/api/authApi";
import { AlertToast } from "@/components/myui/AlertToast";
import { sanitizeEmail } from "@/lib/sanitize";
import { validateVerificationCode, validateEmail } from "@/utils/validation";
import logger from "@/lib/logger";

/**
 * Hook managing email OTP verification, countdown timer, resend, and redirect to login.
 */
export function useCodeVerify({ email } = {}) {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cleanEmail = sanitizeEmail(email);
  const canResend = timer === 0;

  // Countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle safe code update (only digits, max 6 characters)
  const handleSetCode = (val) => {
    if (typeof val !== "string") return;
    const digitsOnly = val.replace(/\D/g, "").slice(0, 6);
    setCode(digitsOnly);
  };

  // Resend OTP code
  const handleResend = async () => {
    const emailErr = validateEmail(cleanEmail);
    if (emailErr) {
      AlertToast(emailErr, "ERROR");
      return;
    }
    if (!canResend || loading) return;

    setLoading(true);
    try {
      const data = await resendVerificationCodeApi({ email: cleanEmail });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "فشل إعادة إرسال الرمز", data?.messageStatus || "ERROR");
        return;
      }

      setTimer(60);
      AlertToast(data?.message || "تمت إعادة إرسال رمز التحقق بنجاح", "SUCCESS");
    } catch (err) {
      logger.error("Resend OTP error:", err);
      AlertToast("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP code for verification
  const handleVerify = async () => {
    const cleanCode = code.replace(/\D/g, "");
    const emailErr = validateEmail(cleanEmail);
    if (emailErr) {
      AlertToast(emailErr, "ERROR");
      return;
    }

    const codeErr = validateVerificationCode(cleanCode);
    if (codeErr) {
      AlertToast(codeErr, "ERROR");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const data = await verifyEmailApi({ email: cleanEmail, code: cleanCode });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "رمز التحقق غير صحيح", data?.messageStatus || "ERROR");
        return;
      }

      AlertToast(data?.message || "تم تأكيد الحساب بنجاح", "SUCCESS");

      setTimeout(() => {
        const search = window.location.search;
        navigate(search ? `/login${search}` : "/login");
      }, 1000);
    } catch (error) {
      logger.error("Verification error:", error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return {
    code,
    setCode: handleSetCode,
    timer,
    canResend,
    loading,
    handleResend,
    handleVerify,
  };
}

export default useCodeVerify;

