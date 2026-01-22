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
import { postHelper } from "../../../apis/apiHelpers";
export default function CodeVerify({ email, onClose }) {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const canResend = timer === 0;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Resend handler
  const handleResend = async () => {
    if (!canResend) return;

    try {
      const data = await postHelper({
        url: `${import.meta.env.VITE_API_URL}/auth/send-re-verify`,
        body: { email },
      });

      if (data.messageStatus != "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        return;
      }

      setTimer(60); // 1 minutes
      AlertToast(data?.message, data?.messageStatus);
    } catch {
      AlertToast("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً", "error");
    }
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
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ email, code }),
        },
      );

      const data = await response.json();
      console.log("VERIFY RESPONSE =", data);

      if (data.messageStatus != "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        return;
      }
      AlertToast(data?.message, data?.messageStatus);

      setTimeout(() => navigate("/Screens/auth/login"), 1000);
    } catch (error) {
      console.error(error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
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
      bg-white
      px-4 py-8
    "
    >
      {/* CLOSE BUTTON */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-black/50 hover:text-black transition"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* TITLE */}
      <h1 className="text-black text-3xl font-extrabold mb-2 text-center">
        تأكيد البريد الإلكتروني
      </h1>

      <p className="text-black/60 text-sm text-center mb-10 max-w-xs sm:max-w-sm leading-relaxed">
        أدخل رمز التحقق المكوّن من 6 أرقام والذي تم إرساله إلى{" "}
        <span className="font-semibold text-black">{email}</span>
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
                border border-black/10
                rounded-md
                shadow-sm
                focus:border-black
              "
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* CONFIRM — ONLY COLOR */}
      <Button
        disabled={code.length < 6 || loading}
        onClick={handleVerify}
        className="
        w-full max-w-xs sm:max-w-sm
        mt-10 py-3 sm:py-4
        text-lg font-bold
        text-black
        rounded-xl
        transition-all
        hover:scale-[1.02]
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
        style={{ background: "var(--gradient)" }}
      >
        {loading ? "جاري التحقق..." : "تأكيد الرمز"}
      </Button>

      {/* RESEND */}
      <div className="mt-6 text-black/60 text-sm">
        {canResend ? (
          <span
            onClick={handleResend}
            className="font-semibold text-black hover:underline cursor-pointer"
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
    </div>
  );
}
