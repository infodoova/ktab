import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import appUiImg from "@/assets/images/appui/appui.png";

/**
 * Hook for the "Read Anywhere" section.
 * Single big image, simple text.
 */
export function useReadAnywhere() {
  const navigate = useNavigate();

  const handleOpenApp = useCallback(() => {
    navigate("/reader/interactive-stories");
  }, [navigate]);

  return {
    headline: "اقرأ في أي مكان وفي أي وقت",
    description:"",
    image: appUiImg,
    imageAlt: "منصة كتاب — اقرأ في أي مكان وفي أي وقت",
    handleOpenApp,
  };
}

export default useReadAnywhere;
