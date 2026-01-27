/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ResetPassword from "../../components/myui/ResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertToast } from "../../components/myui/AlertToast";
import owlLogin from "../../assets/character/owl4.png";
import { saveToken, getUserData } from "../../../store/authToken";
import { ArrowRight } from "lucide-react";
export default function LoginPage() {
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);

  // Prevent scroll gap on login page - Using useEffect for proper cleanup on navigation
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email, password });

  // Loading state
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "الرجاء إدخال البريد الإلكتروني.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "صيغة بريد إلكتروني غير صحيحة.";

    if (!password.trim()) newErrors.password = "الرجاء إدخال كلمة المرور.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE =", data);

      if (data.messageStatus != "SUCCESS") {
        AlertToast(data?.message, data?.messageStatus);
        return;
      }
      AlertToast(data?.message, data?.messageStatus);

      saveToken(data.data);

      const user = getUserData();

      if (user.role === "AUTHOR") {
        setTimeout(() => {
          navigate("/Screens/dashboard/AuthorPages/controlBoard");
        }, 900);
      } else if (user.role === "READER") {
        setTimeout(() => {
          navigate("/Screens/dashboard/ReaderPages/MainPage");
        }, 900);
      } else {
        AlertToast(" تحويل للصفحة الرئيسية", "SUCCESS");
        setTimeout(() => {
          navigate("/");
        }, 900);
      }
    } catch (error) {
      console.error(error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 w-full bg-black flex overflow-hidden">
      {/* LEFT — FORM PANEL */}
      <div
        className="
      relative z-10
      w-full md:w-[48%]
      bg-white
      flex items-center md:justify-center
      px-6 sm:px-10 md:px-14
      overflow-y-auto
      custom-scrollbar
    "
      >
        {/* Ambient blurs for the left side - Refined for New Palette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--primary-button)]/10 blur-[80px] rounded-full" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[var(--primary-border)]/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[var(--primary-button)]/5 blur-[60px] rounded-full" />
        </div>

        {/* subtle divider */}
        <div className="absolute top-0 right-0 h-full w-px bg-black/5 hidden md:block" />

        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-8 right-8 p-2.5 rounded-2xl bg-black/5 hover:bg-black/10 transition-all duration-300 group flex items-center justify-center z-20"
          title="العودة للرئيسية"
        >
          <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-black group-hover:scale-110 transition-all duration-300" />
        </Link>

        <div className="w-full max-w-md">
          <div className="relative mb-8">
            {/* Branded Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-[var(--primary-button)] opacity-60 rounded-full" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[var(--primary-button)] uppercase">
                K T A B
              </span>
            </div>

            {/* Main Title with Decorative Element */}
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-[var(--primary-text)] leading-tight">
                أهلاً{" "}
                <span className="text-[var(--primary-button)] ">بعودتك</span>
              </h1>
              {/* Floating aesthetic dot */}
              <div className="absolute -top-4 -right-12 w-24 h-24 bg-[var(--primary-button)]/5 rounded-full blur-2xl" />
            </div>

            {/* Subtitle */}
            <p className="mt-4 text-[var(--primary-text)]/60 text-base md:text-lg leading-relaxed max-w-md font-medium">
              سجّل دخولك لمتابعة القراءة،{" "}
              <span className="text-[var(--primary-button)] font-bold">
                القصص التفاعلية،
              </span>{" "}
              وتقدمك الشخصي.
            </p>
          </div>

          <div
            className="
            mt-10
            bg-[var(--glass-bg)]
            backdrop-blur-xl
            border border-[var(--glass-border)]
            shadow-[var(--shadow-soft)]
            rounded-[2.5rem]
            px-8 py-9
            relative
            overflow-hidden
          "
          >
            {/* Subtle inner tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-button)]/[0.03] to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Email */}
              <div className="space-y-1 mb-5">
                <Label className="text-black font-medium">
                  البريد الإلكتروني
                </Label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-black/10 focus-visible:ring-black/20"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1 mb-6">
                <Label className="text-black font-medium">كلمة المرور</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-black/10 focus-visible:ring-black/20"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="
              relative z-10
              w-full py-7
              text-lg font-bold
              text-[var(--primary-text)]
              rounded-2xl
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary-button)]/20
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              mt-2
            "
              style={{ background: "var(--gradient)" }}
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </Button>

            {/* Links */}
            <div className="mt-8 text-center space-y-3 relative z-10">
              <p className="text-sm text-black/60">
                ليس لديك حساب؟{" "}
                <Link
                  to="/Screens/auth/signup"
                  className="text-black font-semibold hover:underline"
                >
                  إنشاء حساب جديد
                </Link>
              </p>

              <p className="text-sm text-black/60">
                هل نسيت كلمة المرور؟{" "}
                <span
                  onClick={() => setResetOpen(true)}
                  className="text-black font-semibold hover:underline cursor-pointer"
                >
                  إعادة تعيين كلمة المرور
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — QUIET VISUAL */}
      <div className="hidden md:flex flex-1 relative bg-black items-center justify-center">
        {/* ambient light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-white/5 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-10 max-w-md"
        >
          <img
            src={owlLogin}
            alt="owl"
            className="w-[300px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          />

          <h2 className="mt-10 text-3xl font-bold text-white">
            اقرأ. استمع. تفاعل.
          </h2>

          <p className="mt-4 text-white/70 text-lg leading-relaxed">
            كتّاب ليست منصة قراءة فقط، بل تجربة معرفية مصممة لك.
          </p>
        </motion.div>
      </div>

      {resetOpen && <ResetPassword onClose={() => setResetOpen(false)} />}
    </div>
  );
}
