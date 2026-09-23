import {
  validateBookTitle,
  validateCustomAuthorName,
  validateBookDescription,
  validateSelect,
} from "@/utils/validation";

/**
 * Validates librarian book creation/update form state.
 *
 * @param {Object} formData - Form input values
 * @param {Object} existingData - Existing book files metadata (when editing)
 * @returns {Object} Dictionary of field errors
 */
export function validateLibrarianBookForm(formData, existingData = {}) {
  const errors = {};

  const titleErr = validateBookTitle(formData?.title);
  if (titleErr) errors.title = titleErr;

  const authorErr = validateCustomAuthorName(formData?.customAuthorName);
  if (authorErr) errors.customAuthorName = authorErr;

  const descErr = validateBookDescription(formData?.description);
  if (descErr) errors.description = descErr;

  const catErr = validateSelect(formData?.category, "التصنيف الأساسي للكتاب");
  if (catErr) errors.category = catErr;

  const langErr = validateSelect(formData?.language, "لغة الكتاب");
  if (langErr) errors.language = langErr;

  const ageErr = validateSelect(formData?.ageGroup, "الفئة العمرية المستهدفة");
  if (ageErr) errors.ageGroup = ageErr;

  const hasCover = formData?.coverFile || existingData?.coverUrl;
  if (!hasCover) {
    errors.cover = "غلاف الكتاب إلزامي";
  }

  const hasPdf = formData?.pdfFile || existingData?.pdfName;
  if (!hasPdf) {
    errors.pdf = "ملف الكتاب بصيغة PDF إلزامي";
  }

  return errors;
}
