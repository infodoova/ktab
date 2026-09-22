import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";
import { validateStrongPassword } from "@/lib/passwordValidation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM_STATE = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
};

/**
 * Custom hook managing the Add Staff Member form and its validation rules.
 */
export function useStaffForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "اسم العائلة مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    const pwError = validateStrongPassword(formData.password, {
      required: true,
      requiredMessage: "كلمة المرور مطلوبة لإنشاء حساب الموظف",
    });
    if (pwError) {
      newErrors.password = pwError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!validate()) {
        AlertToast("يرجى التأكد من صحة البيانات المدخلة", "error");
        return;
      }

      setSubmitting(true);
      try {
        const payload = {
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim() || null,
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role || "35",
        };

        const res = await libraryAdminService.addStaff(payload);
        if (res && (res.success || res.status === "OK" || res.statusCode === 200 || res.statusCode === 201)) {
          AlertToast("تمت إضافة وتعيين الموظف في فريق المكتبة بنجاح", "success");
          navigate("/library-admin/staff");
        } else {
          AlertToast(res?.message || "تعذر إضافة الموظف، يرجى المحاولة لاحقاً", "error");
        }
      } catch (err) {
        console.error("Failed to add staff member:", err);
        AlertToast("حدث خطأ في الخادم أثناء إضافة الموظف", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [formData, navigate, validate]
  );

  return {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    navigate,
  };
}

export default useStaffForm;
