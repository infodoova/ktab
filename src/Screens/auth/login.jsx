/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ResetPassword from "../../components/myui/ResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AlertToast } from "../../components/myui/AlertToast"; 
import owlLogin from "../../assets/character/owl4.png";
import { saveToken } from "../../../store/authToken";
export default function LoginPage() {
  const navigate = useNavigate();
const [resetOpen, setResetOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email, password });

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    variant: "error",
    title: "",
    description: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  const showToast = (variant, title, description) => {
    setToast({ open: true, variant, title, description });
  };

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
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE =", data);

    if (!data.success) {
      showToast(
        "error",
        "خطأ في تسجيل الدخول",
        data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة."
      );
      return;
    }

    if (!data.data) {
      showToast("error", "خطأ", "لم يتم استلام رمز الدخول من الخادم.");
      return;
    }

    saveToken(data.data);

    showToast("success", "تم تسجيل الدخول", "مرحباً بعودتك!");

    setTimeout(() => {
      navigate("/Screens/dashboard/AuthorPages/controlBoard");
    }, 900);

  } catch (error) {
    console.error(error);
    showToast("error", "خطأ", "تعذر الاتصال بالخادم.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast({ ...toast, open: false })}
      />

      <div dir="rtl" className="h-screen w-full flex bg-[var(--earth-cream)] overflow-hidden">
        {/* LEFT SIDE — OWL */}
        <div className="hidden md:flex flex-1 md:basis-1/2 items-center justify-center bg-gradient-to-b from-[var(--earth-brown)] via-[#3c271a] to-[#2b1b12] relative overflow-hidden py-16">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-24 -right-20 w-80 h-80 bg-[#f5e5c5]/20 blur-3xl rounded-full" />
            <div className="absolute bottom-[-80px] left-[-40px] w-72 h-72 bg-[#f2d3a3]/15 blur-3xl rounded-full" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="px-6 max-w-md text-center scale-[0.92] md:scale-100"
          >
            <img
              src={owlLogin}
              alt="owl"
              className="w-[300px] md:w-[360px] h-auto drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)] mx-auto"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-[#fdf7ee] mt-8">
              مرحباً بك في كتّاب
            </h2>
            <p className="text-[#f5e9db]/80 text-lg mt-4 leading-relaxed mx-auto max-w-sm">
              منصتك للقراءة العربية الحديثة — اقرأ، استمع، وتفاعل مع محتوى مصمم ليناسبك
              في كل مرحلة من رحلتك.
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="flex-1 md:basis-1/2 flex items-center justify-center px-8 sm:px-10 md:px-16 bg-[var(--earth-cream)]">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--earth-brown)] leading-tight">
                أهلاً بعودتك
              </h1>
              <p className="text-[var(--earth-brown)]/70 text-base sm:text-lg md:text-xl mt-3 leading-relaxed">
                سجّل دخولك لتتابع الكتب، القصص التفاعلية، والتقدم الذي أحرزته في كتّاب.
              </p>
            </div>

            <Card className="shadow-md border border-[var(--earth-sand)]/40 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[var(--earth-brown)] text-2xl font-semibold">
                  تسجيل الدخول
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-[var(--earth-brown)] font-medium">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-[var(--earth-sand)]/40 focus-visible:ring-[var(--earth-brown)]/40"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label className="text-[var(--earth-brown)] font-medium">كلمة المرور</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-[var(--earth-sand)]/40 focus-visible:ring-[var(--earth-brown)]/40"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-3 text-lg font-bold rounded-xl ${
                    loading
                      ? "bg-[var(--earth-brown)]/50 cursor-not-allowed"
                      : "bg-[var(--earth-brown)] text-white hover:bg-[#5a3f2d]"
                  }`}
                >
                  {loading ? "جاري الدخول..." : "دخول"}
                </Button>

                <div className="text-center mt-3">
                  <p className="text-sm text-[var(--earth-brown)]/70">
                    ليس لديك حساب؟{" "}
                    <Link to="/Screens/auth/signup" className="text-[var(--earth-brown)] font-semibold hover:underline">
                      إنشاء حساب جديد
                    </Link>
                  </p>
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm text-[var(--earth-brown)]/70">
                    هل نسيت كلمة المرور؟{" "}
                 <span
  onClick={() => setResetOpen(true)}
  className="text-[var(--earth-brown)] font-semibold hover:underline cursor-pointer"
>
  إعادة تعيين كلمة المرور
</span>

                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {resetOpen && (
  <ResetPassword onClose={() => setResetOpen(false)} />
)}
      </div>
    </>
  );
}
