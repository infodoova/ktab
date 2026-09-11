import { useState, useEffect, useCallback } from "react";
import { registerApi } from "@/core/api/authApi";
import { AlertToast } from "@/components/myui/AlertToast";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";
import logger from "@/lib/logger";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,128}$/;
const NAME_REGEX = /^[\p{L}\s'-]{1,50}$/u;

const INITIAL_FORM_STATE = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  role: "READER", // default to READER for smooth 1-click UX
  password: "",
  confirmPassword: "",
};

/**
 * Custom hook handling 2-step signup form state, step progression, validation, and submission.
 */
export function useSignup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  // Prevent scroll leakage on auth pages
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  const setFormField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const setRole = useCallback((role) => {
    setFormField("role", role);
  }, [setFormField]);

  // Validate Step 1: Role, Names, and Email
  const validateStep1 = useCallback(() => {
    const nextErrors = {};
    const cleanFirst = sanitizeText(form.firstName);
    const cleanLast = sanitizeText(form.lastName);
    const cleanMiddle = sanitizeText(form.middleName);
    const cleanEmail = sanitizeEmail(form.email);

    if (!form.role || !["AUTHOR", "READER"].includes(form.role)) {
      nextErrors.role = "يرجى اختيار نوع الحساب (قارئ أو مؤلف)";
    }

    if (!cleanFirst) {
      nextErrors.firstName = "الاسم الأول مطلوب";
    } else if (!NAME_REGEX.test(cleanFirst)) {
      nextErrors.firstName = "الاسم الأول يجب أن يحتوي على أحرف فقط (أقصى حد 50 حرفاً)";
    }

    if (cleanMiddle && !NAME_REGEX.test(cleanMiddle)) {
      nextErrors.middleName = "الاسم الأوسط غير صحيح";
    }

    if (!cleanLast) {
      nextErrors.lastName = "الاسم الأخير مطلوب";
    } else if (!NAME_REGEX.test(cleanLast)) {
      nextErrors.lastName = "الاسم الأخير يجب أن يحتوي على أحرف فقط (أقصى حد 50 حرفاً)";
    }

    if (!cleanEmail) {
      nextErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
      nextErrors.email = "صيغة بريد إلكتروني غير صحيحة";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  // Validate Step 2: Passwords
  const validateStep2 = useCallback(() => {
    const nextErrors = {};

    if (!form.password) {
      nextErrors.password = "كلمة المرور مطلوبة";
    } else if (form.password.length < 8) {
      nextErrors.password = "كلمة المرور يجب أن لا تقل عن 8 أحرف.";
    } else if (form.password.length > 128) {
      nextErrors.password = "كلمة المرور طويلة جداً (أقصى حد 128 حرفاً).";
    } else if (!PASSWORD_REGEX.test(form.password)) {
      nextErrors.password = "يجب أن تشمل رقماً وحرفاً كبيراً وصغيراً ورمزاً خاصاً.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  // Advance to Step 2
  const nextStep = useCallback(() => {
    if (validateStep1()) {
      setStep(2);
    }
  }, [validateStep1]);

  // Go back to Step 1
  const prevStep = useCallback(() => {
    setErrors({});
    setStep(1);
  }, []);

  // Form Submission
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validate both steps
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      const data = await registerApi({
        firstName: sanitizeText(form.firstName),
        middleName: sanitizeText(form.middleName),
        lastName: sanitizeText(form.lastName),
        email: sanitizeEmail(form.email),
        password: form.password,
        role: form.role,
      });

      if (data.messageStatus !== "SUCCESS") {
        AlertToast(data?.message || "فشل إنشاء الحساب", data?.messageStatus || "ERROR");
        return;
      }

      AlertToast(data?.message || "تم إنشاء الحساب بنجاح", "SUCCESS");
      setVerifyOpen(true);
    } catch (err) {
      logger.error("Registration error:", err);
      AlertToast("تعذر الاتصال بالخادم", "ERROR");
    } finally {
      setLoading(false);
    }
  }, [form, validateStep1, validateStep2]);

  return {
    step,
    nextStep,
    prevStep,
    form,
    setFormField,
    setRole,
    errors,
    loading,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    verifyOpen,
    setVerifyOpen,
    handleSubmit,
  };
}

export default useSignup;
