import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX, URL_REGEX } from "./regex";

/**
 * Normalizes a string for lenient comparison by trimming whitespace,
 * collapsing internal consecutive spaces into a single space, and lowercasing.
 *
 * @param {string} str - Raw string
 * @returns {string} Normalized string
 */
export function normalizeText(str) {
  return (str || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Validates that a required value is non-empty.
 *
 * @param {any} value - Value to check
 * @param {string} [fieldLabel="هذا الحقل"] - Name of the field for error messaging
 * @returns {string|null} Error message or null if valid
 */
export function validateRequired(value, fieldLabel = "هذا الحقل") {
  if (value === null || value === undefined) {
    return `${fieldLabel} مطلوب`;
  }
  if (typeof value === "string" && !value.trim()) {
    return `${fieldLabel} مطلوب`;
  }
  if (Array.isArray(value) && value.length === 0) {
    return `يرجى اختيار عنصر واحد على الأقل في ${fieldLabel}`;
  }
  return null;
}

/**
 * Validates text length constraints.
 *
 * @param {string} value
 * @param {string} fieldLabel
 * @param {Object} options
 * @param {number} [options.min=0]
 * @param {number} [options.max=Infinity]
 * @param {boolean} [options.required=true]
 * @returns {string|null}
 */
export function validateTextLength(
  value,
  fieldLabel = "هذا الحقل",
  { min = 0, max = Infinity, required = true } = {}
) {
  const clean = (value || "").trim();

  if (!clean) {
    return required ? `${fieldLabel} مطلوب` : null;
  }

  if (clean.length < min) {
    return `${fieldLabel} قصير جداً (الحد الأدنى ${min} أحرف)`;
  }

  if (clean.length > max) {
    return `${fieldLabel} طويل جداً (الحد الأقصى ${max} حرفاً)`;
  }

  return null;
}

/**
 * Validates an email address.
 *
 * @param {string} email - Email to check
 * @param {Object} [options]
 * @param {boolean} [options.required=true] - Whether empty value triggers an error
 * @param {string} [options.requiredMessage="البريد الإلكتروني مطلوب"]
 * @param {string} [options.invalidMessage="صيغة البريد الإلكتروني غير صحيحة"]
 * @returns {string|null}
 */
export function validateEmail(
  email,
  {
    required = true,
    requiredMessage = "البريد الإلكتروني مطلوب",
    invalidMessage = "صيغة البريد الإلكتروني غير صحيحة",
  } = {}
) {
  const clean = (email || "").trim();

  if (!clean) {
    return required ? requiredMessage : null;
  }

  if (clean.length > 254) {
    return "البريد الإلكتروني طويل جداً (الحد الأقصى 254 حرفاً)";
  }

  if (!EMAIL_REGEX.test(clean)) {
    return invalidMessage;
  }

  return null;
}

/**
 * Validates a personal name (first name, last name, author name).
 *
 * @param {string} name
 * @param {string} [fieldLabel="الاسم"]
 * @param {Object} [options]
 * @param {boolean} [options.required=true]
 * @param {number} [options.min=1]
 * @param {number} [options.max=50]
 * @returns {string|null}
 */
export function validateName(
  name,
  fieldLabel = "الاسم",
  { required = true, min = 1, max = 50 } = {}
) {
  const clean = (name || "").trim();

  if (!clean) {
    return required ? `${fieldLabel} مطلوب` : null;
  }

  if (clean.length < min) {
    return `${fieldLabel} يجب أن يتكون من ${min} أحرف على الأقل`;
  }

  if (clean.length > max) {
    return `${fieldLabel} يتجاوز الحد الأقصى (${max} حرفاً)`;
  }

  if (!NAME_REGEX.test(clean)) {
    return `${fieldLabel} يجب أن يحتوي على أحرف ومسافات فقط بدون رموز خاصة أو أرقام`;
  }

  return null;
}

/**
 * Validates a book title.
 *
 * @param {string} title
 * @param {Object} [options]
 * @param {boolean} [options.required=true]
 * @param {number} [options.min=2]
 * @param {number} [options.max=200]
 * @returns {string|null}
 */
export function validateBookTitle(
  title,
  { required = true, min = 2, max = 200 } = {}
) {
  const clean = (title || "").trim();

  if (!clean) {
    return required ? "يرجى إدخال عنوان الكتاب" : null;
  }

  if (clean.length < min) {
    return `عنوان الكتاب يجب أن يتكون من ${min} أحرف على الأقل`;
  }

  if (clean.length > max) {
    return `عنوان الكتاب يتجاوز الحد المسموح به (${max} حرفاً)`;
  }

  return null;
}

/**
 * Validates a book description or summary.
 *
 * @param {string} description
 * @param {Object} [options]
 * @param {boolean} [options.required=true]
 * @param {number} [options.min=5]
 * @param {number} [options.max=5000]
 * @returns {string|null}
 */
export function validateBookDescription(
  description,
  { required = true, min = 5, max = 5000 } = {}
) {
  const clean = (description || "").trim();

  if (!clean) {
    return required ? "يرجى كتابة نبذة أو وصف للكتاب" : null;
  }

  if (clean.length < min) {
    return `نبذة الكتاب يجب ألا تقل عن ${min} أحرف`;
  }

  if (clean.length > max) {
    return `نبذة الكتاب تتجاوز الحد الأقصى (${max} حرفاً)`;
  }

  return null;
}

/**
 * Validates custom author name for organizations and publishing.
 *
 * @param {string} authorName
 * @param {Object} [options]
 * @returns {string|null}
 */
export function validateCustomAuthorName(
  authorName,
  { required = true, min = 2, max = 80 } = {}
) {
  const clean = (authorName || "").trim();

  if (!clean) {
    return required ? "يرجى إدخال اسم المؤلف" : null;
  }

  if (clean.length < min) {
    return `اسم المؤلف يجب ألا يقل عن ${min} أحرف`;
  }

  if (clean.length > max) {
    return `اسم المؤلف يتجاوز الحد الأقصى (${max} حرفاً)`;
  }

  return null;
}

/**
 * Validates dropdown / select field selection.
 *
 * @param {any} value
 * @param {string} [fieldLabel="هذا الخيار"]
 * @param {Object} [options]
 * @returns {string|null}
 */
export function validateSelect(
  value,
  fieldLabel = "هذا الخيار",
  { required = true } = {}
) {
  const strVal = value !== null && value !== undefined ? String(value).trim() : "";

  if (!strVal || strVal === "0" || strVal === "null" || strVal === "undefined") {
    return required ? `يرجى اختيار ${fieldLabel}` : null;
  }

  return null;
}

/**
 * Validates phone numbers.
 *
 * @param {string} phone
 * @param {Object} [options]
 * @returns {string|null}
 */
export function validatePhone(phone, { required = false } = {}) {
  const clean = (phone || "").trim();

  if (!clean) {
    return required ? "رقم الهاتف مطلوب" : null;
  }

  if (!PHONE_REGEX.test(clean)) {
    return "صيغة رقم الهاتف غير صحيحة";
  }

  return null;
}

/**
 * Validates web URLs.
 *
 * @param {string} url
 * @param {Object} [options]
 * @returns {string|null}
 */
export function validateUrl(url, { required = false } = {}) {
  const clean = (url || "").trim();

  if (!clean) {
    return required ? "رابط الموقع مطلوب" : null;
  }

  if (!URL_REGEX.test(clean)) {
    return "رابط الموقع غير صحيح (يجب أن يبدأ بـ https:// أو http://)";
  }

  return null;
}

/**
 * Validates verification code (OTP).
 *
 * @param {string} code
 * @param {number} [length=6]
 * @returns {string|null}
 */
export function validateVerificationCode(code, length = 6) {
  const clean = String(code || "").trim();

  if (!clean) {
    return "يرجى إدخال رمز التحقق";
  }

  if (clean.length < length) {
    return `يرجى إدخال الرمز المكون من ${length} أرقام بالكامل`;
  }

  return null;
}

/**
 * Validates that user input matches an expected target text exactly (case/space-insensitive).
 * Useful for high-impact delete and approval confirmation modals.
 *
 * @param {string} input - User input string
 * @param {string} expected - Expected text target
 * @param {string} [fieldLabel="الاسم"] - Label for error messaging
 * @returns {{ isMatch: boolean, error: string|null }}
 */
export function validateExactMatch(input, expected, fieldLabel = "الاسم") {
  const normInput = normalizeText(input);
  const normExpected = normalizeText(expected);

  if (!normInput) {
    return {
      isMatch: false,
      error: `يرجى كتابة ${fieldLabel} للتأكيد`,
    };
  }

  const isMatch = normInput === normExpected;
  return {
    isMatch,
    error: isMatch ? null : `${fieldLabel} المدخل غير متطابق`,
  };
}
