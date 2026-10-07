import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import b1 from "@/assets/images/roles/b1.png";
import b2 from "@/assets/images/roles/b2.png";

/**
 * Authentic platform personas data styled exactly after ElevenLabs Bento Showcase.
 * Full-bleed cinematic imagery with concise editorial text and interactive feature capabilities.
 */
const ROLES_DATA = [
  {
    id: "reader",
    roleKey: "reader",
    title: "القارئ",
    headline: "استمتع بآلاف الكتب والروايات بأصوات بشرية آسرة وعالية النقاء.",
    image: b1,
    features: [
      "الاستماع لكتب صوتية فائقة النقاء بأصوات بشرية نابضة",
      "مزامنة فورية وسلسة بين القراءة النصية والاستماع",
      "مكتبة شخصية ذكية مع حفظ تلقائي لمواضع التقدم",
    ],
  },
  {
    id: "author",
    roleKey: "author",
    title: "المؤلف",
    headline: "حوّل خيالك إلى عوالم تفاعلية بالذكاء الاصطناعي وانشرها للآلاف.",
    image: b2,
    features: [
      "تحويل المخطوطات والمسودات إلى إنتاج صوتي متقن بالذكاء الاصطناعي",
      "نشر فوري وتوزيع مباشر لقاعدة قراء واسعة ومتنامية",
      "لوحة تحليلات متقدمة لمتابعة معدلات الاستماع والمبيعات",
    ],
  },

];

/**
 * Framer-motion variants for the Modern Architectural Bento Grid.
 * Buttery-smooth spring entrance and coordinated stagger transitions.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 18,
      mass: 0.85,
    },
  },
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Coordinated height and opacity animation variants for dynamic capabilities list on hover.
 */
const featureListVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 10,
    transition: {
      height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.22, ease: "easeOut" },
      staggerChildren: 0.04,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.14 },
    },
  },
};

const featureItemVariants = {
  hidden: {
    opacity: 0,
    x: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 6,
    transition: {
      duration: 0.12,
    },
  },
};

/**
 * Custom hook for the ElevenLabs-inspired Bento Grid.
 * Encapsulates all role data, dynamic hover state, motion configurations, and CTA navigation.
 * Zero business logic in JSX.
 */
export function useRoles() {
  const navigate = useNavigate();
  const [hoveredRoleId, setHoveredRoleId] = useState(null);

  const reader = ROLES_DATA.find((r) => r.id === "reader");
  const author = ROLES_DATA.find((r) => r.id === "author");

  const handleCardMouseEnter = useCallback((id) => {
    setHoveredRoleId(id);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setHoveredRoleId(null);
  }, []);

  const handleStartNow = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return {
    roles: ROLES_DATA,
    reader,
    author,
    hoveredRoleId,
    handleCardMouseEnter,
    handleCardMouseLeave,
    containerVariants,
    cardVariants,
    headerVariants,
    featureListVariants,
    featureItemVariants,
    handleStartNow,
  };
}

export default useRoles;
