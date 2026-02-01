/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import authvideo from "../../assets/videos/auth.mp4"
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
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import CodeVerify from "@/components/myui/CodeVerify";
import { AlertToast } from "../../components/myui/AlertToast";

export default function SignupPage() {
  const [verifyOpen, setVerifyOpen] = useState(false);

  // Prevent scroll gap on signup page - Using useEffect for proper cleanup on navigation
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

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
    className="fixed inset-0 w-full h-full bg-black flex overflow-hidden font-sans"
  >
    {/* القسم الأيمن — نموذج التسجيل */}
    <div
      className="relative z-10 w-full md:w-1/2 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar border-l border-white/20"
      style={{ backgroundColor: "var(--bg-dark)" }}
    >
      {/* إضاءة خلفية دقيقة */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary-button)]/10 blur-[120px] rounded-full opacity-30" />
      </div>



      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-16">
        <div className="w-full max-w-2xl relative z-10">
          {/* الترويسة */}
          <header className="mb-10 pr-2">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-1.5 h-6 bg-[var(--primary-button)] shadow-[0_0_15px_var(--primary-button)]" />
              <span className="text-sm font-bold text-white">منصة كتاب</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              إنشاء <span className="text-white">حساب جديد</span>
            </h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* القسم 1: المعلومات الشخصية (Grid) */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {[
                  { key: "firstName", placeholder: "الاسم الأول" },
                  { key: "middleName", placeholder: "الاسم الأوسط" },
                  { key: "lastName", placeholder: "الاسم الأخير" },
                ].map((field) => (
                  <div
                    key={field.key}
                    className="sm:col-span-4 space-y-2 group"
                  >
                    <Label className="text-xs font-bold text-white/80 mr-1">{field.placeholder}</Label>
                    <Input
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) =>
                        setForm({ ...form, [field.key]: e.target.value })
                      }
                      // نفس ستايل صفحة الدخول: border-white/40
                      className="h-12 bg-black border-white/40 text-white rounded-lg focus-visible:ring-1 focus-visible:ring-[var(--primary-button)] focus-visible:border-[var(--primary-button)] transition-all text-right"
                    />
                    {errors[field.key] && (
                      <p className="text-red-400 text-[10px] mr-1">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* القسم 2: بيانات الحساب */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* البريد الإلكتروني */}
                <div className="sm:col-span-8 space-y-2 group">
                  <Label className="text-xs font-bold text-white/80 mr-1">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    dir="ltr"
                    className="h-12 bg-black border-white/40 text-white rounded-lg focus-visible:ring-1 focus-visible:ring-[var(--primary-button)] focus-visible:border-[var(--primary-button)] transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-[10px] mr-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                {/* نوع الحساب */}
                <div className="sm:col-span-4 space-y-2 group">
                  <Label className="text-xs font-bold text-white/80 mr-1">نوع الحساب</Label>
                  <Select
                    onValueChange={(value) => setForm({ ...form, role: value })}
                  >
                    <SelectTrigger className="h-12 bg-black border-white/40 text-white text-right flex-row-reverse rounded-lg focus:ring-[var(--primary-button)]">
                      <SelectValue placeholder="اختر نوع الحساب" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/20 text-white">
                      <SelectItem value="20" className="flex-row-reverse">
                        قارئ
                      </SelectItem>
                      <SelectItem value="10" className="flex-row-reverse">
                        مؤلف
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-red-400 text-[10px] mr-1">
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* القسم 3: الأمان */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "password",
                    label: "كلمة المرور",
                    show: showPassword,
                    setShow: setShowPassword,
                  },
                  {
                    key: "confirmPassword",
                    label: "تأكيد كلمة المرور",
                    show: showConfirm,
                    setShow: setShowConfirm,
                  },
                ].map((field) => (
                  <div key={field.key} className="space-y-2 group">
                    <Label className="text-xs font-bold text-white/80 mr-1">{field.label}</Label>
                    <div className="relative">
                      <Input
                        type={field.show ? "text" : "password"}
                        placeholder={field.label}
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        className="h-12 bg-black border-white/40 text-white rounded-lg focus-visible:ring-1 focus-visible:ring-[var(--primary-button)] focus-visible:border-[var(--primary-button)] transition-all pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => field.setShow(!field.show)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors[field.key] && (
                      <p className="text-red-400 text-[10px] mr-1">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* الأزرار والروابط */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-black font-black text-lg rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 relative overflow-hidden group shadow-[0_8px_32px_rgba(93,227,186,0.1)]"
                style={{ background: "var(--gradient)" }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                  {!loading && <ArrowRight className="w-5 h-5 rotate-180" />}
                </span>
              </Button>

              <div className="text-center mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/60">
                  لديك حساب بالفعل؟{" "}
                  <Link
                    to="/Screens/auth/login"
                    className="text-white hover:text-[var(--primary-button)] font-bold transition-colors"
                  >
                    سجل دخولك الآن
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* القسم الأيسر — الفيديو (مطابق لصفحة الدخول) */}
    <div className="hidden md:flex md:w-1/2 relative bg-black overflow-hidden">
      <video
        src={authvideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      {/* تدرج جانبي مطابق لصفحة الدخول */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80" />
    </div>

    {verifyOpen && (
      <div className="fixed inset-0 z-[9999]">
        <CodeVerify email={form.email} onClose={() => setVerifyOpen(false)} />
      </div>
    )}
  </div>
);
}
