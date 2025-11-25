import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AlertToast } from "../myui/AlertToast";
import { useNavigate } from "react-router-dom";

export default function CodeVerify({ email, onClose }) {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(30);
  const canResend = timer === 0;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const showToast = (variant, title, description) => {
    setToast({ open: true, variant, title, description });
  };

  // Countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Resend handler
  const handleResend = () => {
    setTimer(30);
    
    showToast("info", "تم إرسال رمز جديد", "تحقق من بريدك الإلكتروني.");
  };

  // Submit handler
const handleVerify = async () => {
  if (code.length < 6) return;

  setLoading(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      }
    );

    const data = await response.json();
    console.log("VERIFY RESPONSE =", data);

    if (!data.success) {
      showToast(
        "error",
        "رمز غير صحيح",
        data.message || "يرجى المحاولة مجدداً."
      );
      return;
    }

    showToast("success", "تم التحقق", "يمكنك الآن تسجيل الدخول.");

    setTimeout(() => navigate("/Screens/auth/login"), 1000);

  } catch (error) {
    console.error(error);
    showToast("error", "خطأ", "تعذر الاتصال بالخادم.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center
        bg-[var(--earth-cream)]
        px-4 py-8
      "
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-[var(--earth-brown)]/60 hover:text-[var(--earth-brown)] transition"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Title */}
      <h1 className="text-[var(--earth-brown-dark)] text-3xl font-extrabold mb-2 text-center">
        تأكيد البريد الإلكتروني
      </h1>

      <p className="text-[var(--earth-brown)]/70 text-sm text-center mb-10 max-w-xs sm:max-w-sm">
        أدخل رمز التحقق المكوّن من 6 أرقام والذي تم إرساله إلى {email}
      </p>

      {/* OTP */}
      <div dir="ltr" className="w-full flex justify-center">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup className="flex gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="
                  !w-12 !h-12 text-xl
                  sm:!w-16 sm:!h-16 sm:text-2xl
                  font-bold text-center
                  bg-white
                  border border-[var(--earth-sand)]
                  rounded-md
                  shadow-sm
                "
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Confirm */}
      <Button
        disabled={code.length < 6 || loading}
        onClick={handleVerify}
        className="
          w-full max-w-xs sm:max-w-sm 
          mt-10 py-3 sm:py-4
          text-lg font-bold
          bg-[var(--earth-brown)] text-white
          hover:bg-[var(--earth-brown-dark)]
          rounded-xl
          disabled:bg-[var(--earth-brown)]/40
        "
      >
        {loading ? "جاري التحقق..." : "تأكيد الرمز"}
      </Button>

      {/* Resend */}
      <div className="mt-6 text-[var(--earth-brown)]/70 text-sm">
        {canResend ? (
          <span
            onClick={handleResend}
            className="font-semibold text-[var(--earth-brown)] hover:underline cursor-pointer"
          >
            إعادة إرسال الرمز
          </span>
        ) : (
          <span>
            يمكنك إعادة الإرسال بعد{" "}
            <span className="font-bold text-[var(--earth-brown)]">{timer}</span>{" "}
            ثانية
          </span>
        )}
      </div>

      {/* Toast */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
