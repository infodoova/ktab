/**
 * Centralized Validation Library for Ktab.
 * Exports all canonical regular expressions, field validators,
 * password rules, file security checks, and form validation utilities.
 */

// Regular Expression Constants
export {
  EMAIL_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  URL_REGEX,
  STRONG_PASSWORD_REGEX,
  VERIFICATION_CODE_REGEX,
  SAFE_IDENTIFIER_REGEX,
} from "./regex";

// String, Text, and Field Validators
export {
  normalizeText,
  validateRequired,
  validateTextLength,
  validateEmail,
  validateName,
  validateBookTitle,
  validateBookDescription,
  validateCustomAuthorName,
  validateSelect,
  validatePhone,
  validateUrl,
  validateExactMatch,
  validateVerificationCode,
} from "./stringValidators";

// Password Validators
export {
  STRONG_PASSWORD_MESSAGE,
  validateStrongPassword,
  validateLoginPassword,
  validatePasswordConfirmation,
} from "./passwordValidators";

// File, Image, and Document Security Validators
export {
  validateFile,
  validateImageDimensions,
  validateSecureBookDocument,
  validateCoverImage,
} from "./fileValidators";

// Declarative Form Runner
export { validateFields } from "./formValidators";
