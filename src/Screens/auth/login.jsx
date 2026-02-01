/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ResetPassword from "../../components/myui/ResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertToast } from "../../components/myui/AlertToast";
import { saveToken, getUserData } from "../../../store/authToken";
import { ArrowRight } from "lucide-react";
import authvideo from "../../assets/videos/auth.mp4";
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
    <div
      dir="rtl"
      className="fixed inset-0 w-full h-full bg-black flex overflow-hidden font-sans"
    >
      {/* القسم الأيمن — لوحة التحكم (بدون تأثير الزجاج) */}
      <div
        className="relative z-10 w-full md:w-1/2 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar border-l border-white/20"
        style={{ backgroundColor: "var(--bg-dark)" }} // استخدام اللون الداكن المخصص #0a0a0a
      >
        {/* إضاءة خلفية دقيقة جداً */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary-button)]/10 blur-[120px] rounded-full opacity-30" />
        </div>

        {/* زر الرجوع */}
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="absolute top-8 right-8 z-20 flex items-center justify-center text-white/40 hover:text-white transition-all group w-10 h-10 rounded-full border border-white/5 hover:border-white/10 hover:bg-white/5"
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.button>



        <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24 py-20">
          <div className="w-full max-w-[400px] relative z-10">
            <header className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-1.5 h-6 bg-[var(--primary-button)] shadow-[0_0_15px_var(--primary-button)]" />
                <span className="text-sm font-bold text-white">منصة كتاب</span>
              </motion.div>


              <h1 className="text-4xl font-black text-white leading-tight">
                أهلاً بك <span className="text-white">من جديد</span>
              </h1>
            </header>

            <div className="space-y-6">
              {/* الحقول - خلفية سوداء صلبة ونصوص بيضاء */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-white mr-1  opacity-80 group-focus-within:text-[var(--primary-button)] transition-colors">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=" mt-2 h-14 bg-black border-white/40 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--primary-button)] focus-visible:border-[var(--primary-button)] transition-all placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-white opacity-80 group-focus-within:text-[var(--primary-button)] transition-colors">
                    كلمة المرور
                  </label>
                  <button
                    onClick={() => setResetOpen(true)}
                    className="text-xs text-white/60 hover:text-[var(--primary-button)] transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-black border-white/40 text-white rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--primary-button)] focus-visible:border-[var(--primary-button)] transition-all placeholder:text-white/30"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-14 text-black font-black text-lg rounded-xl mt-6 transition-all active:scale-[0.98] disabled:opacity-50 relative overflow-hidden group shadow-[0_8px_32px_rgba(93,227,186,0.1)]"
                style={{ background: "var(--gradient)" }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "جاري الدخول..." : "دخول"}
                  {!loading && <ArrowRight className="w-5 h-5 rotate-180" />}
                </span>
              </Button>
            </div>

            <footer className="mt-12 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-white/60">
                ليس لديك حساب؟{" "}
                <Link
                  to="/Screens/auth/signup"
                  className="text-white hover:text-[var(--primary-button)] font-bold transition-colors"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* القسم الأيسر — الفيديو النقي */}
      <div className="hidden md:flex md:w-1/2 relative bg-black overflow-hidden">
        <video
          src={authvideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* تدرج جانبي بسيط لدمج الفيديو مع لوحة التحكم السوداء */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
      </div>

      {resetOpen && <ResetPassword onClose={() => setResetOpen(false)} />}
    </div>
  );
}
