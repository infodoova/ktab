export const FREE_VOUCHER_ROLES = {
  reader: {
    role: "READER",
    label: "للقرّاء",
    optionLabel: "قارئ",
    title: "احصل على قسيمة شهر مجاني كقارئ",
    subtitle: "سجّل الآن كقارئ واستمتع بشهر اشتراك كامل مجانًا فور إطلاق منصة كتاب.",
    badge: "قسيمة شهر كامل مجاناً 🎁",
    highlights: [
      "وصول غير محدود لآلاف الكتب الرقمية والمسموعة",
      "تجربة قراءة واستماع ذكية بتقنيات الذكاء الاصطناعي",
      "بدون الحاجة لبطاقة دفع أو أي التزام مالي للشهر الأول",
    ],
  },
  author: {
    role: "AUTHOR",
    label: "للمؤلفين",
    optionLabel: "مؤلف",
    title: "احصل على خصم 50% على أول 10 كتب كمؤلف",
    subtitle: "سجّل الآن كمؤلف وانشر أعمالك الأدبية مع خصم 50% على أول 10 كتب فور إطلاق منصة كتاب.",
    badge: "خصم 50% على أول 10 كتب ✍️",
    highlights: [
      "خصم 50% على نشر وإنتاج أول 10 كتب لك على المنصة",
      "أدوات ذكية لتوليد الأغلفة والتحويل الصوتي التلقائي",
      "لوحة تحليلات فورية لمتابعة المبيعات وقراءات فصولك",
    ],
  },
};

export const PERSON_FIELDS = [
  { name: "fullName", label: "الاسم الكامل", type: "text", required: true, maxLength: 200, autoComplete: "name", placeholder: "أدخل اسمك الكامل" },
  { name: "email", label: "البريد الإلكتروني", type: "email", required: true, maxLength: 255, autoComplete: "email", dir: "ltr", placeholder: "name@example.com" },
  { name: "phoneNumber", label: "رقم الهاتف", type: "tel", maxLength: 31, autoComplete: "tel", dir: "ltr", placeholder: "070123456" },
  { name: "gender", label: "الجنس", type: "select", options: [{ value: "", label: "اختياري" }, { value: "MALE", label: "ذكر" }, { value: "FEMALE", label: "أنثى" }] },
];

export const VOUCHER_PLAN = "free-month";
export const VOUCHER_PLANS = {
  READER: "free-month",
  AUTHOR: "discount-50",
};
