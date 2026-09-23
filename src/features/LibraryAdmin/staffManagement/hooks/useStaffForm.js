import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  validateName,
  validateEmail,
  validateStrongPassword,
} from "@/utils/validation";

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

    const firstErr = validateName(formData.firstName, "الاسم الأول");
    if (firstErr) newErrors.firstName = firstErr;

    const lastErr = validateName(formData.lastName, "اسم العائلة");
    if (lastErr) newErrors.lastName = lastErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

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
