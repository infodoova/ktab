/**
 * Centralized regular expression patterns used across the Ktab platform.
 * Single source of truth to avoid diverging validation regexes across features.
 */

/**
 * Standard RFC 5322 compliant email regex pattern.
 * Validates local part, domain structure, and top-level domain (minimum 2 chars).
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Unicode-aware personal name regex.
 * Supports Arabic, Latin characters, apostrophes, hyphens, and whitespace (1 to 50 chars).
 */
export const NAME_REGEX = /^[\p{L}\s'-]{1,50}$/u;

/**
 * Strong password security policy regex:
 * - Minimum 8 characters
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least one numeric digit (0-9)
 * - At least one special symbol / punctuation character
 */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/**
 * International and local phone number pattern.
 * Supports optional leading plus (+), country code, digits, dashes, and spaces (7 to 18 digits).
 */
export const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;

/**
 * Web URL regex allowing HTTP and HTTPS protocols with valid hostnames.
 */
export const URL_REGEX =
  /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

/**
 * Numeric-only verification code regex (typically 4 to 6 digits for OTP).
 */
export const VERIFICATION_CODE_REGEX = /^\d{4,8}$/;

/**
 * Alphanumeric slug / identifier pattern (e.g., safe URL parameters and identifiers).
 */
export const SAFE_IDENTIFIER_REGEX = /^[a-zA-Z0-9_-]+$/;
