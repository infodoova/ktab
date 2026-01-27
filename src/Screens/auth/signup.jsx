/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import CodeVerify from "@/components/myui/CodeVerify";
import { AlertToast } from "../../components/myui/AlertToast";
import owlSignup from "../../assets/character/owl5.png";

export default function SignupPage() {
  const [verifyOpen, setVerifyOpen] = useState(false);

  // Prevent scroll gap on signup page
  useState(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  });

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});


  // 🔥 Loading state
  const [loading, setLoading] = useState(false);

  const validatePassword = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pw);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "مطلوب";
    if (!form.lastName.trim()) e.lastName = "مطلوب";

    if (!form.email.trim()) e.email = "البريد مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "بريد غير صحيح";

    if (!form.role) e.role = "اختر الدور";

    if (!form.password.trim()) e.password = "كلمة المرور مطلوبة";
    else if (!validatePassword(form.password))
      e.password =
        "يجب أن تكون 8 أحرف على الأقل وتشمل رقماً وحرفاً كبيراً وصغيراً ورمزاً.";

    if (form.confirmPassword !== form.password)
      e.confirmPassword = "غير متطابقة";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",

      },
      body: JSON.stringify({
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    });

    const data = await response.json();
    console.log("REGISTER RESPONSE =", data);

 if (data.messageStatus != "SUCCESS") {
   AlertToast(data?.message, data?.messageStatus);
   return;
 }
    setVerifyOpen(true);

 AlertToast(data?.message, data?.messageStatus);

  } catch (err) {
    console.error(err);
    AlertToast("تعذر الاتصال بالخادم", "ERROR");
  } finally {
    setLoading(false);
  }
};


return (
  <div
    dir="rtl"
    className="fixed inset-0 w-full flex bg-white overflow-hidden"
  >
    {/* LEFT — SIGNUP FORM */}
    <div className="flex-1 md:basis-1/2 flex flex-col items-center md:justify-center px-6 py-12 md:px-12 bg-white relative overflow-y-auto custom-scrollbar">
      {/* Ambient blurs for the left side - Refined for New Palette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--primary-button)]/10 blur-[80px] rounded-full" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[var(--primary-border)]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[var(--primary-button)]/5 blur-[60px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Modern Header Section */}
        <div className="mb-8 text-right">
          {/* Branded Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-[var(--primary-button)] opacity-60 rounded-full" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[var(--primary-button)] uppercase">
              K T A B
            </span>
          </div>

          <div className="relative">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-[var(--primary-text)] leading-tight">
              إنشاء <span className="text-[var(--primary-button)] drop-shadow-sm">حساب جديد</span>
            </h1>
            {/* Floating aesthetic dot */}
            <div className="absolute -top-4 -right-12 w-24 h-24 bg-[var(--primary-button)]/5 rounded-full blur-2xl" />
          </div>
          
          <p className="mt-4 text-[var(--primary-text)]/60 text-base md:text-lg leading-relaxed max-w-md font-medium">
            أنشئ حسابك وابدأ رحلة <span className="text-[var(--primary-button)] font-bold">القراءة التفاعلية</span> الخاصة بك.
          </p>
        </div>

        {/* FORM CARD - Enhanced with Theme Palette */}
        <div
          className="
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
          
          <div className="relative z-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "الاسم الأول *", key: "firstName" },
                  { label: "الاسم الأوسط", key: "middleName" },
                  { label: "الاسم الأخير *", key: "lastName" },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-sm text-[var(--primary-text)]">
                      {label}
                    </Label>
                    <Input
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="bg-white border-black/10 focus-visible:ring-black/20"
                    />
                    {errors[key] && (
                      <p className="text-red-500 text-xs">{errors[key]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-[var(--primary-text)]">
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    dir="ltr"
                    className="bg-white border-black/10 focus-visible:ring-black/20"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-[var(--primary-text)]">
                    نوع الحساب *
                  </Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, role: value })}
                  >
                    <SelectTrigger className="bg-white border-black/10 text-right flex-row-reverse">
                      <SelectValue placeholder="اختر الدور" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-black/10 shadow-lg rounded-xl z-[999]">
                      <SelectItem value="20">قارئ</SelectItem>
                      <SelectItem value="10">مؤلف</SelectItem>
                      <SelectItem value="educator">قريباً</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-red-500 text-xs">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-[var(--primary-text)]">
                    كلمة المرور *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="bg-white border-black/10 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-[var(--primary-text)]">
                    تأكيد كلمة المرور *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      onPaste={(e) => e.preventDefault()}
                      className="bg-white border-black/10 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black"
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit — ENHANCED CTA */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full py-7 text-lg font-bold
                  text-[var(--primary-text)]
                  rounded-2xl
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary-button)]/20
                  active:scale-[0.98]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  mt-4
                "
                style={{ background: "var(--gradient)" }}
              >
                {loading ? "جارٍ إنشاء الحساب..." : "تسجيل الحساب"}
              </Button>

              {/* Footer */}
              <div className="text-center mt-8 text-sm text-[var(--primary-text)]/60 space-y-2">
                <p>
                  لديك حساب بالفعل؟{" "}
                  <Link
                    to="/Screens/auth/login"
                    className="font-bold text-[var(--primary-text)] hover:underline"
                  >
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT — VISUAL */}
    <div className="hidden md:flex flex-1 md:basis-1/2 items-center justify-center bg-black relative">
      {/* ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-white/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-10 relative z-10"
      >
        <img
          src={owlSignup}
          alt="Signup Owl"
          className="w-[300px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        />
        <h2 className="mt-10 text-3xl font-bold text-white">
          أهلاً بك في مجتمعنا
        </h2>
        <p className="mt-4 text-white/70 text-lg leading-relaxed max-w-md mx-auto">
          آلاف الكتب والقصص التفاعلية بانتظارك في تجربة معرفية مصممة لك.
        </p>
      </motion.div>
    </div>

    {verifyOpen && (
      <div className="fixed inset-0 z-[9999]">
        <CodeVerify email={form.email} onClose={() => setVerifyOpen(false)} />
      </div>
    )}
  </div>
);

}
