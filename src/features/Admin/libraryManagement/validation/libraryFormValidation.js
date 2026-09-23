import {
  validateRequired,
  validateEmail,
  validateName,
  validateStrongPassword,
} from "@/utils/validation";

/**
 * Validates the Library creation and update form.
 *
 * @param {Object} formData - Form input values
 * @param {Object|null} initialData - Existing library data when editing (null for new creation)
 * @returns {Object} Dictionary of field errors
 */
export function validateLibraryForm(formData, initialData = null) {
  const errs = {};

  const nameErr = validateRequired(formData?.name, "اسم المكتبة");
  if (nameErr) errs.name = nameErr;

  const cityErr = validateRequired(formData?.city, "المدينة");
  if (cityErr) errs.city = cityErr;

  const countryErr = validateRequired(formData?.country, "الدولة");
  if (countryErr) errs.country = countryErr;

  // When creating a new library, admin account credentials are required
  if (!initialData) {
    const emailErr = validateEmail(formData?.admin?.email, {
      requiredMessage: "البريد الإلكتروني للمسؤول مطلوب",
    });
    if (emailErr) errs.admin_email = emailErr;

    const firstErr = validateName(formData?.admin?.firstName, "الاسم الأول للمسؤول");
    if (firstErr) errs.admin_firstName = firstErr;

    const lastErr = validateName(formData?.admin?.lastName, "اسم العائلة للمسؤول");
    if (lastErr) errs.admin_lastName = lastErr;

    const pwErr = validateStrongPassword(formData?.admin?.password, {
      required: true,
      requiredMessage: "كلمة المرور مطلوبة لمسؤول المكتبة",
    });
    if (pwErr) {
      errs.admin_password = pwErr;
    }
  } else if (formData?.admin?.password && formData.admin.password.trim()) {
    // When editing, password is optional unless specified to change
    const pwErr = validateStrongPassword(formData.admin.password, { required: false });
    if (pwErr) {
      errs.admin_password = pwErr;
    }
  }

  return errs;
}
