/**
 * Legacy adapter for password validation.
 * Re-exports from centralized validation library at @/utils/validation.
 */
export {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
  validateStrongPassword,
  validateStrongPassword as default,
} from "@/utils/validation";
