import { useState, useCallback } from "react";

export const ORIGINAL_FAQS = [
  {
    id: "q5",
    question: "هل يمكنني استخدام التطبيق على أكثر من جهاز؟",
    answer:
      "نعم، يمكنك تسجيل الدخول والوصول لكل كتبك وتقدّمك من أي جهاز: الهاتف، التابلت، أو الكمبيوتر.",
  },

  {
    id: "q7",
    question: "هل المحتوى داخل التطبيق مُراجع وآمن؟",
    answer:
      "نعم، كل المحتوى يخضع للمراجعة والتدقيق لضمان الجودة والملاءمة لكل الفئات العمرية.",
  },
  {
    id: "q8",
    question: "هل يمكن للمدارس والمؤسسات استخدام كتاب؟",
    answer:
      "نعم، نوفر باقات خاصة للمدارس والمؤسسات التعليمية مع لوحات متابعة جماعية وإدارة صفوف وطلاب.",
  },
  {
    id: "q10",
    question: "كيف يمكنني نشر كتابي على كتاب؟",
    answer:
      "يمكنك إرسال كتابك عبر حساب المؤلف داخل التطبيق، ليتم مراجعته ونشره ضمن أقسام المنصة.",
  },
  {
    id: "q11",
    question: "هل التطبيق مناسب للمستخدمين الكبار أيضاً؟",
    answer:
      "طبعًا—التطبيق مخصص لكل الأعمار ويحتوي على كتب للكبار، روايات، وتطوير ذات ومجالات مختلفة.",
  },
  {
    id: "q12",
    question: "هل يوجد دعم فني عند وجود مشكلة؟",
    answer:
      "نعم، يمكنك التواصل مع فريق الدعم عبر التطبيق، وسيتم الرد خلال وقت قصير.",
  },
];

/**
 * Hook for FAQ section managing accordion state and the original FAQ items.
 */
export function useFAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleItem = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return {
    openId,
    toggleItem,
    faqs: ORIGINAL_FAQS,
  };
}

export default useFAQ;
