import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const PRICING_PLANS = [
  {
    id: "hobby",
    name: "هاوٍ",
    priceMonthly: 4,
    priceYearly: 40,
    isFree: false,
    highlight: false,
    buttonText: "ابدأ الآن",
    route: "/login",
    features: [
      "وصول لمكتبة عربية مختارة",
      "وضع قراءة مريح وتظليل المقتطفات",
      "مزامنة التقدّم والمفضّلة سحابياً",
      "إحصاءات قراءة شخصية يومية",
    ],
  },
  {
    id: "listener",
    name: "مستمع",
    priceMonthly: 9,
    priceYearly: 90,
    isFree: false,
    highlight: true,
    buttonText: "ابدأ الآن",
    route: "/login",
    features: [
      "استماع صوتي ذكي غير محدود لجميع الكتب",
      "أصوات ذكاء اصطناعي فائقة الواقعية بتعبيرات طبيعية",
      "تحميل المقاطع للاستماع بدون إنترنت",
      "التبديل الفوري والسلس بين القراءة والاستماع",
      "مزامنة موقع الاستماع عبر جميع أجهزتك",
    ],
  },
  {
    id: "pro_reader",
    name: "قارئ محترف",
    priceMonthly: 19,
    priceYearly: 190,
    isFree: false,
    highlight: false,
    buttonText: "ابدأ الآن",
    route: "/login",
    features: [
      "وصول كامل وغير محدود لكافة الكتب والروايات",
      "الاستماع الصوتي الذكي غير المحدود",
      "دخول غير محدود لجميع القصص التفاعلية والمسارات",
      "إمكانية تأليف ونشر قصصك التفاعلية الخاصة",
      "تحليلات قراءة معمقة ومزامنة فائقة السرعة",
    ],
  },
];

/**
 * Dedicated hook for Pricing component logic.
 * Encapsulates billing state, plan formatting, and navigation.
 */
export function usePricing() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();

  const toggleBilling = useCallback((isYearly) => {
    setYearly((prev) => (typeof isYearly === "boolean" ? isYearly : !prev));
  }, []);

  const handleSelectPlan = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return {
    yearly,
    setYearly,
    toggleBilling,
    plans: PRICING_PLANS,
    handleSelectPlan,
  };
}

export default usePricing;
