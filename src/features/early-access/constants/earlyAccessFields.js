export const EARLY_ACCESS_ROLES = {
  "admin-librarian": {
    role: "ADMIN_LIBRARIAN",
    label: "للمكتبات",
    optionLabel: "مدير مكتبة",
    title: "انضم بمكتبتك إلى كُتّاب",
    subtitle: "سجّل بيانات مؤسستك المكتبية، وكن من أوائل الشركاء في إتاحة المعرفة عبر كُتّاب.",
  },
};

export const PERSON_FIELDS = [
  { name: "fullName", label: "الاسم الكامل", type: "text", required: true, maxLength: 200, autoComplete: "name" },
  { name: "email", label: "البريد الإلكتروني", type: "email", required: true, maxLength: 255, autoComplete: "email", dir: "ltr" },
  { name: "phoneNumber", label: "رقم الهاتف", type: "tel", maxLength: 31, autoComplete: "tel", dir: "ltr", placeholder: "070123456" },
  { name: "gender", label: "الجنس", type: "select", options: [{ value: "", label: "اختياري" }, { value: "MALE", label: "ذكر" }, { value: "FEMALE", label: "أنثى" }] },
];

export const ORGANIZATION_FIELDS = [
  { name: "organization.name", label: "اسم المؤسسة المكتبية", type: "text", required: true, maxLength: 255, autoComplete: "organization" },
  { name: "organization.description", label: "نبذة عن المكتبة", type: "textarea", maxLength: 5000 },
  { name: "organization.city", label: "المدينة", type: "text", maxLength: 100, autoComplete: "address-level2" },
  { name: "organization.country", label: "البلد", type: "text", maxLength: 100, autoComplete: "country-name" },
  { name: "organization.address", label: "العنوان", type: "text", maxLength: 255, autoComplete: "street-address" },
  { name: "organization.website", label: "الموقع الإلكتروني", type: "url", maxLength: 255, dir: "ltr", placeholder: "https://example.org" },
  { name: "organization.email", label: "البريد الإلكتروني للمكتبة", type: "email", maxLength: 255, dir: "ltr" },
  { name: "organization.phone", label: "رقم هاتف المكتبة", type: "tel", maxLength: 31, dir: "ltr", placeholder: "01234567" },
];
