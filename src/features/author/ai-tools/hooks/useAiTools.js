import { useState } from "react";
import { generateBookEnding } from "../services/aiToolsService";
import { AlertToast } from "@/components/myui/AlertToast";
import { validateFile, sanitizeText } from "@/lib/sanitize";
import logger from "@/lib/logger";

/**
 * Hook managing AI book ending and analysis generation.
 */
export function useAiTools() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleGenerate = async (values) => {
    const { wordCount, audience, file } = values || {};

    if (!file) {
      AlertToast("يرجى اختيار ملف PDF للتحليل.", "ERROR");
      return;
    }

    const fileValidation = validateFile(file, {
      allowedTypes: ["application/pdf"],
      maxSizeBytes: 50 * 1024 * 1024, // 50MB
    });

    if (!fileValidation.valid) {
      AlertToast(fileValidation.error || "ملف PDF غير صالح", "ERROR");
      return;
    }

    const cleanWordCount = Math.max(50, Math.min(2000, parseInt(wordCount, 10) || 300));
    const cleanAudience = sanitizeText(audience);

    setLoading(true);
    setSummary("");

    try {
      const res = await generateBookEnding({
        file,
        wordCount: cleanWordCount,
        audience: cleanAudience,
      });

      if (res?.messageStatus !== "SUCCESS" && !res?.data?.endingText) {
        AlertToast(res?.message || "فشل توليد الخاتمة بواسطة الذكاء الاصطناعي", "ERROR");
        return;
      }

      const endingText = res?.data?.endingText || res?.data || "";
      setSummary(endingText);
      AlertToast(res?.message || "تم توليد الخاتمة بنجاح!", "SUCCESS");
    } catch (err) {
      logger.error("AI Generation error:", err);
      AlertToast("حدث خطأ أثناء الاتصال بنموذج الذكاء الاصطناعي", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    summary,
    handleGenerate,
  };
}

export default useAiTools;

