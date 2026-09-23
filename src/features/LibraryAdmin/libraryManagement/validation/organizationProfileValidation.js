import {
  validateRequired,
  validateEmail,
  validateStrongPassword,
} from "@/utils/validation";

/**
 * Validates the Organization/Library Profile edit form.
 *
 * @param {Object} formData - Form input values
 * @returns {Object} Dictionary of field errors
 */
export function validateOrganizationProfile(formData) {
  const errs = {};

  const nameErr = validateRequired(formData?.name, "اسم المكتبة");
  if (nameErr) errs.name = nameErr;

  const cityErr = validateRequired(formData?.city, "المدينة");
  if (cityErr) errs.city = cityErr;

  const countryErr = validateRequired(formData?.country, "الدولة");
  if (countryErr) errs.country = countryErr;

  if (formData?.email) {
    const emailErr = validateEmail(formData.email, {
      required: false,
      invalidMessage: "صيغة البريد الإلكتروني للمكتبة غير صحيحة",
    });
    if (emailErr) errs.email = emailErr;
  }

  if (formData?.admin?.email) {
    const adminEmailErr = validateEmail(formData.admin.email, {
      required: false,
      invalidMessage: "صيغة البريد الإلكتروني للمسؤول غير صحيحة",
    });
    if (adminEmailErr) errs.admin_email = adminEmailErr;
  }

  if (formData?.admin?.password && formData.admin.password.trim()) {
    const pwError = validateStrongPassword(formData.admin.password, { required: false });
    if (pwError) {
      errs.admin_password = pwError;
    }
  }

  return errs;
}
