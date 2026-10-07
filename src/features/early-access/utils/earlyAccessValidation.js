import { PERSON_FIELDS, ORGANIZATION_FIELDS } from "../constants/earlyAccessFields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{6,31}$/;

export function prepareEarlyAccessRequest(values, role) {
  const errors = {};
  if (!["READER", "AUTHOR", "ADMIN_LIBRARIAN"].includes(role)) {
    return { errors: { roleAllowed: "رابط الوصول المبكر غير صالح." }, payload: null };
  }
  const fields = role === "ADMIN_LIBRARIAN" ? [...PERSON_FIELDS, ...ORGANIZATION_FIELDS] : PERSON_FIELDS;
  const payload = { role };
  if (role === "ADMIN_LIBRARIAN") payload.organization = {};

  for (const field of fields) {
    const value = String(values[field.name] ?? "").trim();
    if (field.required && !value) errors[field.name] = `${field.label} مطلوب.`;
    else if (value && field.maxLength && value.length > field.maxLength) errors[field.name] = `الحد الأقصى ${field.maxLength} حرفًا.`;
    else if (value && field.type === "email" && !EMAIL_PATTERN.test(value)) errors[field.name] = "أدخل بريدًا إلكترونيًا صحيحًا.";
    else if (value && field.type === "tel" && !PHONE_PATTERN.test(value)) errors[field.name] = "أدخل رقم هاتف صحيحًا مكوّنًا من أرقام فقط (من 6 إلى 31 رقمًا).";
    else if (value && field.type === "url") {
      try {
        const url = new URL(value);
        if (!/^https?:\/\/[^\s]+$/.test(value) || !url.hostname) throw new Error("Invalid URL");
      } catch {
        errors[field.name] = "أدخل رابطًا يبدأ بـ http:// أو https:// دون مسافات.";
      }
    } else if (field.name === "gender" && value && !["MALE", "FEMALE"].includes(value)) {
      errors.gender = "اختر قيمة صحيحة للجنس.";
    }

    if (!value) continue;
    const normalized = field.type === "email" ? value.toLowerCase() : value;
    if (field.name.startsWith("organization.")) payload.organization[field.name.slice(13)] = normalized;
    else payload[field.name] = normalized;
  }
  return { payload, errors };
}
