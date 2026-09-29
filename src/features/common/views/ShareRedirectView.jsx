import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { isAllowedRedirectUrl, sanitizeId } from "@/lib/sanitize";
import { AlertToast } from "@/components/myui/AlertToast";
import logger from "@/lib/logger";

export function ShareRedirectView() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encrypted = params.get("r");
    const bookId = params.get("b");
    const page = params.get("p");

    // 1. Direct Book Short Link Resolution
    if (bookId) {
      const cleanBookId = sanitizeId(bookId);
      if (cleanBookId) {
        if (page) {
          const cleanPage = sanitizeId(page);
          navigate(`/reader/display/${cleanBookId}?page=${cleanPage}`, { replace: true });
        } else {
          navigate(`/reader/BookDetails/${cleanBookId}`, { replace: true });
        }
        return;
      }
    }

    // 2. Base64 / Encrypted Path Resolution
    if (!encrypted) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const decoded = decodeURIComponent(atob(encrypted));

      if (isAllowedRedirectUrl(decoded)) {
        if (decoded.startsWith("/")) {
          navigate(decoded, { replace: true });
        } else {
          window.location.replace(decoded);
        }
      } else {
        logger.warn("Blocked potentially malicious redirect attempt:", decoded);
        AlertToast("رابط المشاركة غير صالح أو غير آمن", "ERROR");
        navigate("/", { replace: true });
      }
    } catch (err) {
      logger.error("Invalid encrypted share link format:", err);
      AlertToast("رابط المشاركة غير صالح", "ERROR");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white font-black text-sm gap-4 font-tajawal" dir="rtl">
      <Loader2 className="w-8 h-8 animate-spin text-[#5de3ba]" />
      <span>جاري التحقق وإعادة التوجيه...</span>
    </div>
  );
}

export default ShareRedirectView;

