import { useState, useEffect, useCallback } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";
import { validateStrongPassword } from "@/lib/passwordValidation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = {
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
  },
};

/**
 * Hook managing the library administrator's organization profile, statistics, and inline editing.
 */
export function useOrganizationProfile() {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const populateForm = useCallback((org) => {
    if (!org) return;
    setFormData({
      name: org.name || "",
      description: org.description || "",
      city: org.city || "",
      country: org.country || "",
      address: org.address || "",
      website: org.website || "",
      email: org.email || "",
      phone: org.phone || "",
      status: org.status === "0" ? "INACTIVE" : "ACTIVE",
      admin: {
        email: org.admin?.email || "",
        firstName: org.admin?.firstName || "",
        middleName: org.admin?.middleName || "",
        lastName: org.admin?.lastName || "",
        password: "",
      },
    });
    setErrors({});
  }, []);

  const fetchOrganization = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryAdminService.getOrganization();
      if (res && (res.success || res.status === "OK" || res.data)) {
        const orgData = res.data || res;
        setOrganization(orgData);
        populateForm(orgData);
      }
    } catch (err) {
      console.error("Failed to load organization profile:", err);
      AlertToast("تعذر تحميل بيانات المكتبة من الخادم", "error");
    } finally {
      setLoading(false);
    }
  }, [populateForm]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleAdminChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      admin: {
        ...prev.admin,
        [field]: value,
      },
    }));
    setErrors((prev) => ({ ...prev, [`admin_${field}`]: null }));
  }, []);

  const handleCancel = useCallback(() => {
    populateForm(organization);
    setIsEditing(false);
  }, [organization, populateForm]);

  const validate = useCallback(() => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "اسم المكتبة مطلوب";
    if (!formData.city.trim()) errs.city = "المدينة مطلوبة";
    if (!formData.country.trim()) errs.country = "الدولة مطلوبة";

    if (formData.email && !EMAIL_REGEX.test(formData.email.trim())) {
      errs.email = "صيغة البريد الإلكتروني للمكتبة غير صحيحة";
    }

    if (formData.admin?.email && !EMAIL_REGEX.test(formData.admin.email.trim())) {
      errs.admin_email = "صيغة البريد الإلكتروني للمسؤول غير صحيحة";
    }

    // Validate admin password if provided
    if (formData.admin?.password && formData.admin.password.trim()) {
      const pwError = validateStrongPassword(formData.admin.password, { required: false });
      if (pwError) {
        errs.admin_password = pwError;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const handleSave = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!validate()) {
        AlertToast("يرجى التأكد من صحة البيانات المدخلة", "error");
        return;
      }

      setSaving(true);
      try {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          address: formData.address.trim(),
          website: formData.website.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          status: formData.status === "ACTIVE" ? "1" : "0",
        };

        if (
          formData.admin?.firstName ||
          formData.admin?.lastName ||
          formData.admin?.email ||
          formData.admin?.password
        ) {
          payload.admin = {
            firstName: formData.admin.firstName?.trim() || "",
            middleName: formData.admin.middleName?.trim() || null,
            lastName: formData.admin.lastName?.trim() || "",
            email: formData.admin.email?.trim()?.toLowerCase() || "",
          };

          if (formData.admin.password?.trim()) {
            payload.admin.password = formData.admin.password;
          }
        }

        const res = await libraryAdminService.updateOrganization(payload);
        if (res && (res.success || res.status === "OK" || res.data || res.statusCode === 200)) {
          const updated = res.data || { ...organization, ...payload };
          setOrganization(updated);
          populateForm(updated);
          setIsEditing(false);
          AlertToast("تم تحديث بيانات المكتبة بنجاح", "success");
        } else {
          AlertToast(res?.message || "تعذر حفظ التغييرات", "error");
        }
      } catch (err) {
        console.error("Failed to update organization:", err);
        AlertToast("حدث خطأ أثناء حفظ بيانات المكتبة", "error");
      } finally {
        setSaving(false);
      }
    },
    [formData, organization, populateForm, validate]
  );

  const isSearchMatch = useCallback(() => {
    if (!searchQuery || !searchQuery.trim() || !organization) return true;
    const q = searchQuery.trim().toLowerCase();
    const haystacks = [
      organization.name,
      organization.description,
      organization.city,
      organization.country,
      organization.address,
      organization.email,
      organization.phone,
      organization.slug,
      organization.admin?.fullName,
      organization.admin?.firstName,
      organization.admin?.lastName,
      organization.admin?.email,
    ];
    return haystacks.some((val) => val && String(val).toLowerCase().includes(q));
  }, [searchQuery, organization]);

  return {
    organization,
    loading,
    isEditing,
    setIsEditing,
    formData,
    errors,
    saving,
    searchQuery,
    setSearchQuery,
    isSearchMatch: isSearchMatch(),
    handleChange,
    handleAdminChange,
    handleCancel,
    handleSave,
    refresh: fetchOrganization,
  };
}

export default useOrganizationProfile;
