import { useState, useCallback } from "react";
import { libraryService } from "../services/libraryService";
import { AlertToast } from "@/components/myui/AlertToast";
import { validateLibraryForm } from "../validation/libraryFormValidation";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  city: "",
  country: "",
  address: "",
  website: "",
  email: "",
  phone: "",
  status: "ACTIVE",
  admin: {
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    role: "LIBRARY_ADMIN",
  },
};

const normalizeBackendStatus = (status) => {
  if (status === "1" || status === 1 || String(status).toUpperCase() === "ACTIVE") return "ACTIVE";
  if (status === "0" || status === 0 || String(status).toUpperCase() === "INACTIVE") return "INACTIVE";
  if (String(status).toUpperCase() === "SUSPENDED") return "SUSPENDED";
  return "ACTIVE";
};

/**
 * Custom hook to handle library creation and updating forms with validation.
 */
export function useLibraryForm({ initialData = null, onSuccess } = {}) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        city: initialData.city || "",
        country: initialData.country || "",
        address: initialData.address || "",
        website: initialData.website || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        status: normalizeBackendStatus(initialData.status),
        admin: {
          email: initialData.admin?.email || "",
          firstName: initialData.admin?.firstName || "",
          middleName: initialData.admin?.middleName || "",
          lastName: initialData.admin?.lastName || "",
          password: "",
          role: "LIBRARY_ADMIN",
        },
      };
    }
    return INITIAL_FORM_STATE;
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  const handleAdminFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        [field]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, [`admin_${field}`]: null }));
  }, []);

  const validate = useCallback(() => {
    const errs = validateLibraryForm(formData, initialData);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData, initialData]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!validate()) {
        AlertToast("يرجى ملء جميع الحقول الإلزامية بشكل صحيح", "error");
        return false;
      }

      setSubmitting(true);
      try {
        let res;
        if (initialData?.id) {
          // Update existing
          const updatePayload = {
            name: formData.name,
            description: formData.description,
            city: formData.city,
            country: formData.country,
            address: formData.address,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            status: formData.status === "ACTIVE" ? "1" : "0",
          };
          // Include admin updates if provided
          if (formData.admin?.email || formData.admin?.firstName) {
            updatePayload.admin = {
              email: formData.admin.email,
              firstName: formData.admin.firstName,
              middleName: formData.admin.middleName || null,
              lastName: formData.admin.lastName,
            };
            if (formData.admin.password) {
              updatePayload.admin.password = formData.admin.password;
            }
          }

          res = await libraryService.updateLibrary(initialData.id, updatePayload);
        } else {
          // Create new
          const createPayload = {
            name: formData.name,
            description: formData.description,
            city: formData.city,
            country: formData.country,
            address: formData.address,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            admin: {
              email: formData.admin.email,
              firstName: formData.admin.firstName,
              middleName: formData.admin.middleName || null,
              lastName: formData.admin.lastName,
              password: formData.admin.password,
              role: "LIBRARY_ADMIN",
            },
          };
          res = await libraryService.createLibrary(createPayload);
        }

        if (res && (res.success || res.status === "OK" || res.statusCode === 200 || res.data)) {
          AlertToast(
            initialData ? "تم تحديث بيانات المكتبة بنجاح" : "تم إنشاء المكتبة وتعيين المسؤول بنجاح",
            "success"
          );
          onSuccess?.(res.data);
          return true;
        } else {
          AlertToast(res?.message || "فشلت العملية، يرجى المحاولة لاحقاً", "error");
          return false;
        }
      } catch (err) {
        console.error("Library form submit error:", err);
        AlertToast("حدث خطأ غير متوقع أثناء إرسال البيانات", "error");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [formData, initialData, validate, onSuccess]
  );

  return {
    formData,
    errors,
    submitting,
    handleFieldChange,
    handleAdminFieldChange,
    handleSubmit,
  };
}

export default useLibraryForm;
