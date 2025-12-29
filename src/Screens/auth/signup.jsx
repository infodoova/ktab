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
      className="min-h-screen w-full flex bg-[var(--earth-cream)] overflow-y-auto md:overflow-hidden"
    >
      {/* LEFT — SIGNUP FORM */}
      <div className="flex-1 md:basis-1/2 flex flex-col items-center justify-center px-6 py-10 md:px-12 bg-[var(--earth-cream)]">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--earth-brown)]">
              حساب جديد
            </h1>
            <p className="text-[var(--earth-brown)]/70 text-base mt-2">
              انضم إلينا وابدأ رحلة القراءة الممتعة.
            </p>
          </div>

          <Card className="shadow-xl border border-[var(--earth-sand)]/40 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[var(--earth-brown)] text-sm">
                      * الاسم الأول
                    </Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      className="bg-white border-[var(--earth-sand)]/60"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[var(--earth-brown)] text-sm">
                      الاسم الاوسط
                    </Label>
                    <Input
                      value={form.middleName}
                      onChange={(e) =>
                        setForm({ ...form, middleName: e.target.value })
                      }
                      className="bg-white border-[var(--earth-sand)]/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[var(--earth-brown)] text-sm">
                      * الاسم الأخير
                    </Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      className="bg-white border-[var(--earth-sand)]/60"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email + Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[var(--earth-brown)] text-sm">
                      * البريد الإلكتروني
                    </Label>
                    <Input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      type="email"
                      className="bg-white border-[var(--earth-sand)]/60"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[var(--earth-brown)] text-sm">
                      * نوع الحساب
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setForm({ ...form, role: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-[var(--earth-sand)]/60 text-right flex-row-reverse">
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>

                      <SelectContent
                        align="end"
                        className="bg-white border border-[var(--earth-sand)]/60 shadow-lg rounded-xl z-[999]"
                      >
                        <SelectItem value="20">قارئ</SelectItem>
                        <SelectItem value="10"> مؤلف</SelectItem>
                        <SelectItem value="educator">coming soon</SelectItem>
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
                    <Label className="text-[var(--earth-brown)] text-sm">
                      * كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        className="bg-white border-[var(--earth-sand)]/60 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--earth-brown)]/70 hover:text-[var(--earth-brown)]"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[var(--earth-brown)] text-sm">
                      * تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                        onPaste={(e) => e.preventDefault()}
                        className="bg-white border-[var(--earth-sand)]/60 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--earth-brown)]/70 hover:text-[var(--earth-brown)]"
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

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading} // 🔥 disable button while loading
                  className={`w-full py-6 text-lg font-bold rounded-xl shadow-md transition-all ${
                    loading
                      ? "bg-[var(--earth-brown)]/50 cursor-not-allowed"
                      : "bg-[var(--earth-brown)] text-white hover:bg-[#4e342e]"
                  }`}
                >
                  {loading ? "جارٍ إنشاء الحساب..." : "تسجيل الحساب"}
                </Button>

                <div className="text-center mt-4 text-sm text-[var(--earth-brown)]/70">
                  لديك حساب بالفعل؟{" "}
                  <Link
                    to="/Screens/auth/login"
                    className="font-bold text-[var(--earth-brown)] hover:underline"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              </form>

              {verifyOpen && (
                <CodeVerify
                  onClose={() => setVerifyOpen(false)}
                  onSubmit={(code) => console.log("Submitted:", code)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT — OWL */}
      <div className="hidden md:flex flex-1 md:basis-1/2 items-center justify-center bg-gradient-to-b from-[var(--earth-brown)] via-[#3c271a] to-[#2b1b12] relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-24 -right-20 w-80 h-80 bg-[#f5e5c5]/20 blur-3xl rounded-full" />
          <div className="absolute bottom-[-80px] left-[-40px] w-72 h-72 bg-[#f2d3a3]/15 blur-3xl rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative text-center px-10 z-10"
        >
          <img
            src={owlSignup}
            alt="Signup Owl"
            className="w-[360px] h-auto drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)] mx-auto mb-8"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-[#fdf7ee] mb-4">
            أهلاً بك في مجتمعنا
          </h2>
          <p className="text-[#f5e9db]/80 text-lg max-w-md mx-auto leading-relaxed">
            آلاف الكتب والقصص بانتظارك – أنشئ حسابك وابدأ رحلتك الآن.
          </p>
        </motion.div>
      </div>
      {verifyOpen && (
        <div className="fixed inset-0 z-[9999]">
      <CodeVerify 
   email={form.email}
   onClose={() => setVerifyOpen(false)}
/>

        </div>
      )}
    </div>
  );
}
