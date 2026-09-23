import { STRONG_PASSWORD_REGEX } from "./regex";

export const STRONG_PASSWORD_MESSAGE =
  "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.";

/**
 * Validates a password against the platform's security standard for account creation and updates.
 *
 * @param {string} password - The raw password string
 * @param {Object} [options]
 * @param {boolean} [options.required=true] - Whether an empty string is treated as an error
 * @param {string} [options.requiredMessage="كلمة المرور مطلوبة"] - Custom error message for empty password
 * @returns {string|null} Error string if validation fails, or null if valid
 */
export function validateStrongPassword(
  password,
  { required = true, requiredMessage = "كلمة المرور مطلوبة" } = {}
) {
  if (!password || !password.trim()) {
    return required ? requiredMessage : null;
  }

  if (!STRONG_PASSWORD_REGEX.test(password)) {
    return STRONG_PASSWORD_MESSAGE;
  }

  return null;
}

/**
 * Validates password input during login flows.
 * Deliberately avoids exposing complex security criteria on login to prevent enumeration.
 *
 * @param {string} password
 * @param {Object} [options]
 * @param {boolean} [options.required=true]
 * @param {number} [options.maxLength=128]
 * @returns {string|null}
 */
export function validateLoginPassword(
  password,
  { required = true, maxLength = 128 } = {}
) {
  if (!password) {
    return required ? "الرجاء إدخال كلمة المرور." : null;
  }

  if (password.length > maxLength) {
    return `كلمة المرور تتجاوز الحد المسموح به (${maxLength} حرفاً).`;
  }

  return null;
}

/**
 * Validates that two password entries match.
 *
 * @param {string} password
 * @param {string} confirmPassword
 * @param {string} [mismatchMessage="كلمتا المرور غير متطابقتين"]
 * @returns {string|null}
 */
export function validatePasswordConfirmation(
  password,
  confirmPassword,
  mismatchMessage = "كلمتا المرور غير متطابقتين"
) {
  if (!confirmPassword) {
    return "يرجى تأكيد كلمة المرور";
  }

  if (password !== confirmPassword) {
    return mismatchMessage;
  }

  return null;
}
