/**
 * Selectables Public Destination Links Configuration.
 * 4 curated destinations with Apple-style colorful app gradients:
 * 1. Early Access (الوصول المبكر للمكتبات)
 * 2. Free Voucher (قسيمة شهر مجاني)
 * 3. Instagram Official Link (حساب إنستغرام)
 * 4. Main App Domain (منصة كتاب الرئيسية ktab.app)
 */

export const SELECTABLES_LINKS = [
  {
    id: "early-access",
    title: "الوصول المبكر للمكتبات",
    subtitle: "سجّل بيانات مكتبتك لتكون من أوائل الشركاء في إتاحة ونشر المعرفة",
    badge: "شراكة المكتبات",
    href: "/early-access",
    isExternal: false,
    iconType: "compass",
    theme: "ocean",
  },
  // {
  //   id: "free-voucher",
  //   title: "عروض وقسائم الإطلاق",
  //   subtitle: "شهر مجاني للقرّاء وخصم 50% على أول 10 كتب للمؤلفين فور انطلاق المنصة رسمياً",
  //   badge: "هدية الإطلاق",
  //   href: "/free-voucher",
  //   isExternal: false,
  //   iconType: "ticket",
  //   theme: "sunset",
  // },
  {
    id: "instagram",
    title: "إنستغرام كتاب",
    subtitle: "كواليس التأسيس، آخر التحديثات، والتواصل مع المجتمع",
    badge: "متابعة وتواصل",
    href: "https://www.instagram.com/ktab.app?stkn=MWw5YnVrbmF2d2F5aA==",
    isExternal: true,
    iconType: "instagram",
    theme: "instagram",
  },
  {
    id: "main-app",
    title: "منصة كتاب الرئيسية",
    subtitle: "ktab.app البوابة الرسمية لتجربة القراءة الرقمية والتفاعلية",
    badge: "تطبيق الويب",
    href: "https://ktab.app",
    isExternal: true,
    iconType: "globe",
    theme: "emerald",
  },
];
