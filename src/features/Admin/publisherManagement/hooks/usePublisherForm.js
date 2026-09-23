import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { publisherService } from "../services/publisherService";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  validateName,
  validateEmail,
  validateStrongPassword,
} from "@/utils/validation";

/**
 * Custom hook encapsulating publisher provisioning (create) and update form logic.
 */
export function usePublisherForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const publisherToEdit = location.state?.publisher || null;
  const isEditing = Boolean(publisherToEdit);

  const [formData, setFormData] = useState({
    firstName: publisherToEdit?.firstName || "",
    middleName: publisherToEdit?.middleName || "",
    lastName: publisherToEdit?.lastName || "",
    email: publisherToEdit?.email || "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const firstErr = validateName(formData.firstName, "الاسم الأول");
    if (firstErr) newErrors.firstName = firstErr;

    const lastErr = validateName(formData.lastName, "اسم العائلة");
    if (lastErr) newErrors.lastName = lastErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    if (!isEditing) {
      const pwError = validateStrongPassword(formData.password, {
        required: true,
        requiredMessage: "كلمة المرور مطلوبة لإنشاء الحساب",
      });
      if (pwError) {
        newErrors.password = pwError;
      }
    } else if (formData.password && formData.password.trim()) {
      const pwError = validateStrongPassword(formData.password, { required: false });
      if (pwError) {
        newErrors.password = pwError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        const userId = publisherToEdit.id;
        const res = await publisherService.updatePublisher(userId, payload);
        if (res && (res.success || res.status === "OK" || res.data)) {
          AlertToast("تم تحديث بيانات حساب الناشر بنجاح", "success");
          navigate("/admin/publishers");
        } else {
          AlertToast(res?.message || "فشل تحديث بيانات حساب الناشر", "error");
        }
      } else {
        const res = await publisherService.assignPublisher(payload);
        if (res && (res.success || res.status === "OK" || res.data)) {
          AlertToast("تم تسجيل وتعيين حساب الناشر بنجاح", "success");
          navigate("/admin/publishers");
        } else {
          AlertToast(res?.message || "فشل إنشاء حساب الناشر", "error");
        }
      }
    } catch (err) {
      console.error("Form submit error:", err);
      AlertToast("حدث خطأ أثناء حفظ البيانات، يرجى المحاولة لاحقاً", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isEditing,
    publisherToEdit,
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    navigate,
  };
}

export default usePublisherForm;
