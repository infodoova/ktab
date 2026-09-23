import { useState, useEffect, useCallback } from "react";
import { registerApi } from "@/core/api/authApi";
import { AlertToast } from "@/components/myui/AlertToast";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";
import {
  validateEmail,
  validateName,
  validateStrongPassword,
  validatePasswordConfirmation,
} from "@/utils/validation";
import logger from "@/lib/logger";

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

    const firstErr = validateName(cleanFirst, "الاسم الأول");
    if (firstErr) nextErrors.firstName = firstErr;

    if (cleanMiddle) {
      const midErr = validateName(cleanMiddle, "الاسم الأوسط");
      if (midErr) nextErrors.middleName = midErr;
    }

    const lastErr = validateName(cleanLast, "الاسم الأخير");
    if (lastErr) nextErrors.lastName = lastErr;

    const emailErr = validateEmail(cleanEmail);
    if (emailErr) nextErrors.email = emailErr;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  // Validate Step 2: Passwords
  const validateStep2 = useCallback(() => {
    const nextErrors = {};

    const pwErr = validateStrongPassword(form.password);
    if (pwErr) {
      nextErrors.password = pwErr;
    }

    const confirmErr = validatePasswordConfirmation(form.password, form.confirmPassword);
    if (confirmErr) {
      nextErrors.confirmPassword = confirmErr;
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
