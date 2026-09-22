/**
 * Centralized password validation utility for Ktab.
 * Enforces strong password criteria across all creation and update flows:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one numeric digit (0-9)
 * - At least one special character / symbol
 *
 * NOTE: Login flows should deliberately avoid exposing these granular criteria.
 */

export const STRONG_PASSWORD_MESSAGE =
  "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.";

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/**
 * Validates a password against the platform's security standard.
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

export default validateStrongPassword;
