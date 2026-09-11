import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/store/authStore";
import { loginApi } from "@/core/api/authApi";
import { AlertToast } from "@/components/myui/AlertToast";
import { sanitizeEmail } from "@/lib/sanitize";
import logger from "@/lib/logger";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Custom hook handling all login business logic, state, validation, and navigation.
 */
export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // Prevent scroll leakage on auth pages
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const validate = () => {
    const nextErrors = {};
    const cleanEmail = sanitizeEmail(email);

    if (!cleanEmail) {
      nextErrors.email = "الرجاء إدخال البريد الإلكتروني.";
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      nextErrors.email = "صيغة بريد إلكتروني غير صحيحة.";
    } else if (cleanEmail.length > 254) {
      nextErrors.email = "البريد الإلكتروني طويل جداً.";
    }

    if (!password) {
      nextErrors.password = "الرجاء إدخال كلمة المرور.";
    } else if (password.length > 128) {
      nextErrors.password = "كلمة المرور تتجاوز الحد المسموح به (128 حرفاً).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const cleanEmail = sanitizeEmail(email);
      const data = await loginApi({ email: cleanEmail, password });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "فشل تسجيل الدخول", data?.messageStatus || "ERROR");
        return;
      }

      AlertToast(data?.message || "تم تسجيل الدخول بنجاح", "SUCCESS");

      // Save token to Zustand store and localStorage
      setAuth(data.data);

      const currentUser = useAuthStore.getState().user;

      setTimeout(() => {
        if (currentUser?.role === "AUTHOR") {
          navigate("/author/control");
        } else if (currentUser?.role === "READER") {
          navigate("/reader/home");
        } else {
          navigate("/");
        }
      }, 900);
    } catch (error) {
      logger.error("Login submission error:", error);
      AlertToast("تعذر الاتصال بالخادم.", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    loading,
    resetOpen,
    setResetOpen,
    handleSubmit,
  };
}

export default useLogin;

