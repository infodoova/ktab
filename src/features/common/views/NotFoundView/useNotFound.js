import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/store/authStore";

/**
 * Custom hook managing role-based redirection, history navigation,
 * and quick discovery paths for the 404 Not Found view.
 */
export function useNotFound() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Determine smart destination based on authenticated account role
  const userRole = (user?.role || "").toUpperCase();
  const isAuthor = userRole === "AUTHOR" || userRole === "10";
  const isReader = userRole === "READER" || userRole === "20";

  let homeUrl = "/";
  let homeLabel = "الصفحة الرئيسية";

  if (isAuthor) {
    homeUrl = "/author/dashboard";
    homeLabel = "لوحة التحكم";
  } else if (isReader) {
    homeUrl = "/reader/dashboard";
    homeLabel = "مكتبتي ولوحة القراءة";
  }

  const handleGoHome = () => {
    navigate(homeUrl);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(homeUrl);
    }
  };

  const quickLinks = [
    { label: "المكتبة العامة", path: "/reader/library" },
    { label: "القصص التفاعلية", path: "/reader/interactive-stories" },
    ...(isAuthor
      ? [{ label: "مؤلفاتي", path: "/author/my-books" }]
      : [{ label: "الرئيسية", path: "/" }]),
  ];

  return {
    homeUrl,
    homeLabel,
    handleGoHome,
    handleGoBack,
    quickLinks,
  };
}

export default useNotFound;
