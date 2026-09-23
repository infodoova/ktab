import {
  validateBookTitle,
  validateBookDescription,
  validateSelect,
  validateCoverImage,
  validateSecureBookDocument,
} from "@/utils/validation";
import { sanitizeText } from "@/lib/sanitize";

/**
 * Validates book data before saving as an in-progress draft.
 *
 * @param {Object} formData - Form input values
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDraftData(formData) {
  const cleanTitle = sanitizeText(formData?.title);
  const titleErr = validateBookTitle(cleanTitle, {
    requiredMessage: "يرجى إدخال عنوان للكتاب لحفظ المسودة.",
  });

  if (titleErr) {
    return { valid: false, error: titleErr };
  }

  return { valid: true };
}

/**
 * Validates book data before final publication submission.
 *
 * @param {Object} formData - Form input values
 * @param {Object} existingData - Existing book files metadata (when editing)
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function validatePublishData(formData, existingData = {}) {
  const { title, description, category, ageGroup, coverFile, pdfFile, language } = formData || {};

  const cleanTitle = sanitizeText(title);
  const cleanDesc = sanitizeText(description);

  const titleErr = validateBookTitle(cleanTitle);
  if (titleErr) return { valid: false, error: titleErr };

  const descErr = validateBookDescription(cleanDesc);
  if (descErr) return { valid: false, error: descErr };

  const catErr = validateSelect(category, "التصنيف");
  if (catErr) return { valid: false, error: catErr };

  const ageErr = validateSelect(ageGroup, "الفئة العمرية");
  if (ageErr) return { valid: false, error: ageErr };

  const langErr = validateSelect(language, "لغة الكتاب");
  if (langErr) return { valid: false, error: langErr };

  const hasCover = coverFile || existingData.coverUrl;
  const hasPdf = pdfFile || existingData.pdfName;

  if (!hasCover) {
    return { valid: false, error: "يرجى رفع صورة غلاف للكتاب." };
  }
  if (!hasPdf) {
    return { valid: false, error: "يرجى رفع ملف الكتاب (PDF)." };
  }

  if (coverFile) {
    const coverValidation = await validateCoverImage(coverFile);
    if (!coverValidation.valid) {
      return { valid: false, error: coverValidation.error || "ملف الغلاف غير صالح" };
    }
  }

  if (pdfFile) {
    const docValidation = await validateSecureBookDocument(pdfFile, {
      maxSizeBytes: 100 * 1024 * 1024, // 100 MB
    });
    if (!docValidation.valid) {
      return { valid: false, error: docValidation.error || "ملف الكتاب غير صالح أمنياً" };
    }
  }

  return { valid: true };
}
