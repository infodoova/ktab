import { PERSON_FIELDS, VOUCHER_PLAN } from "../constants/freeVoucherFields";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{6,31}$/;

export function prepareFreeVoucherRequest(values, role) {
  const errors = {};
  if (!["READER", "AUTHOR"].includes(role)) {
    return { errors: { roleAllowed: "يرجى اختيار صفة الانضمام (قارئ أو مؤلف)." }, payload: null };
  }

  const payload = { role, plan: VOUCHER_PLAN };

  for (const field of PERSON_FIELDS) {
    const value = String(values[field.name] ?? "").trim();
    if (field.required && !value) {
      errors[field.name] = `${field.label} مطلوب.`;
    } else if (value && field.maxLength && value.length > field.maxLength) {
      errors[field.name] = `الحد الأقصى ${field.maxLength} حرفًا.`;
    } else if (value && field.type === "email" && !EMAIL_PATTERN.test(value)) {
      errors[field.name] = "أدخل بريدًا إلكترونيًا صحيحًا.";
    } else if (value && field.type === "tel" && !PHONE_PATTERN.test(value)) {
      errors[field.name] = "أدخل رقم هاتف صحيحًا مكوّنًا من أرقام فقط (من 6 إلى 31 رقمًا).";
    } else if (field.name === "gender" && value && !["MALE", "FEMALE"].includes(value)) {
      errors.gender = "اختر قيمة صحيحة للجنس.";
    }

    if (!value) continue;
    payload[field.name] = field.type === "email" ? value.toLowerCase() : value;
  }

  return { payload, errors };
}
