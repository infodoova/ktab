import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import discoverImg from "@/assets/images/discover_screen.jpg";
import createImg from "@/assets/images/create_screen.jpg";
import playImg from "@/assets/images/play_screen.jpg";

/**
 * 3 Core Pillars for Interactive Stories:
 * Each pillar = Title + Description + Action + App Screenshot.
 */
export const INTERACTIVE_PILLARS = [
  {
    id: "discover",
    title: "استكشف",
    description:
      "تصفح آلاف القصص التفاعلية والروايات عبر مختلف التصنيفات — من الفانتازيا والدراما إلى الغموض والخيال العلمي. كل قصة تمثل عالماً فريداً ينبض بالتفاصيل والشخصيات بانتظار استكشافك.",
    image: discoverImg,
    actionLabel: "استكشف الآن",
    route: "/login",
  },
  {
    id: "create",
    title: "ألّف واصنع",
    description:
      "حوّل أفكارك وخيالك إلى قصص تفاعلية متكاملة. ابنِ شخصياتك وصمم المشاهد والمسارات المتشعبة بكل سهولة عبر أدوات الذكاء الاصطناعي وشارك إبداعك مع مجتمع القراء.",
    image: createImg,
    actionLabel: "ابدأ التأليف",
    route: "/login",
  },
  {
    id: "experience",
    title: "عش التجربة",
    description:
      "ضع نفسك في قلب الأحداث واختبر تجربة قراءة تفاعلية حيث تقود قراراتك كل فصل ومسار. كل خيار تتخذه يرسم واقعاً جديداً ويوجه القصة نحو نهاية تصنعها بيدك.",
    image: playImg,
    actionLabel: "عش القصة",
    route: "/login",
  },
];

/**
 * Hook providing data and action handling for InteractiveStories showcase.
 * Zero business logic inside JSX.
 */
export function useInteractiveStories() {
  const navigate = useNavigate();

  const handlePillarAction = useCallback(
    (route) => {
      navigate(route || "/login");
    },
    [navigate]
  );

  return {
    pillars: INTERACTIVE_PILLARS,
    handlePillarAction,
  };
}

export default useInteractiveStories;
