import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import discoverImg from "@/assets/images/interactive/discover_screen.webp";
import createImg from "@/assets/images/interactive/create_screen.webp";
import playImg from "@/assets/images/interactive/play_screen.webp";

/**
 * Editorial content configuration for the Apple Books-style Interactive Stories showcase.
 * Separated into a full-width hero persona and two companion sub-cards.
 */
export const HERO_STORY = {
  id: "experience",
  eyebrow: "تجربة القراءة الغامرة",
  title: "ضع نفسك في قلب الأحداث وقُد مسار القصة",
  description:
    "في القصص التفاعلية، أنت لست مجرد قارئ صامت. كل قرار تتخذه يرسم واقعاً جديداً ويفتح مسارات سردية غير متوقعة تقود إلى نهايات تصنعها باختياراتك الحرة.",
  image: playImg,
  actionLabel: "عش التجربة الآن",
  route: "/login",
};

export const SUB_STORIES = [
  {
    id: "create",
    eyebrow: "استوديو التأليف",
    title: "ألّف واصنع مسارات تفاعلية متشعبة",
    description:
      "حوّل أفكارك إلى عوالم سردية متعددة المسارات عبر محرر بصري ذكي. ابنِ الشخصيات، اربط المشاهد، ووجّه القراء نحو نهايات تصنعها بيدك.",
    image: createImg,
    actionLabel: "ابدأ التأليف",
    route: "/login",
  },
  {
    id: "discover",
    eyebrow: "مكتبة العوالم",
    title: "استكشف مكتبة متنامية من العوالم والأنماط",
    description:
      "تصفح آلاف الروايات والقصص التفاعلية عبر مختلف التصنيفات — من الفانتازيا والدراما إلى الغموض والخيال العلمي مع إصدارات متجددة باستمرار.",
    image: discoverImg,
    actionLabel: "استكشف المكتبة",
    route: "/login",
  },
];

/**
 * Custom hook managing interactive stories data and navigation routes.
 * Encapsulates all event handlers; zero business logic in markup.
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
    heroStory: HERO_STORY,
    subStories: SUB_STORIES,
    pillars: SUB_STORIES,
    handlePillarAction,
  };
}

export default useInteractiveStories;
