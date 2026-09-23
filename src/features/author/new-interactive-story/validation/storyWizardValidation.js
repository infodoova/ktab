import {
  validateTextLength,
  validateSelect,
} from "@/utils/validation";
import {
  STORY_MAX_LENGTHS,
  CONSTITUTION_FIELDS,
} from "../constants/newStoryConstants";

/**
 * Validates a single step of the interactive story creation wizard.
 *
 * @param {number} step - Current wizard step (1, 2, or 3)
 * @param {Object} formData - Current form state
 * @returns {Object} Dictionary of field errors (empty if valid)
 */
export function validateStoryStep(step, formData) {
  const stepErrors = {};

  if (step === 1) {
    const titleErr = validateTextLength(formData.title, "عنوان القصة", {
      min: 1,
      max: STORY_MAX_LENGTHS.TITLE,
      required: true,
    });
    if (titleErr) {
      stepErrors.title = titleErr;
    }

    if (!formData.cover) {
      stepErrors.cover = "يرجى اختيار صورة غلاف للقصة.";
    }
  } else if (step === 2) {
    CONSTITUTION_FIELDS.forEach((field) => {
      const val = formData.constitution?.[field.key]?.trim() || "";
      const fieldMax = field.maxLength || STORY_MAX_LENGTHS.CONSTITUTION_FIELD;

      if (field.required && !val) {
        stepErrors[`constitution_${field.key}`] = `يرجى إدخال ${field.label}.`;
      } else if (val.length > fieldMax) {
        stepErrors[`constitution_${field.key}`] = `يجب ألا يتجاوز الحقل ${fieldMax} حرف.`;
      }
    });
  } else if (step === 3) {
    const lensErr = validateSelect(formData.lens, "منظور القصة");
    if (lensErr) stepErrors.lens = lensErr;

    const styleErr = validateSelect(formData.visualStyle, "النمط البصري");
    if (styleErr) stepErrors.visualStyle = styleErr;

    const notesErr = validateTextLength(
      formData.visualStyleNotes,
      "ملاحظات الرؤية البصرية للقصة",
      { min: 1, max: STORY_MAX_LENGTHS.VISUAL_STYLE_NOTES, required: true }
    );
    if (notesErr) stepErrors.visualStyleNotes = notesErr;
  }

  return stepErrors;
}

/**
 * Validates the entire story configuration prior to final submission.
 *
 * @param {Object} formData - Complete form state
 * @returns {Object} Dictionary of field errors (empty if completely valid)
 */
export function validateFullStory(formData) {
  const errors = {};

  // Step 1 checks
  const titleErr = validateTextLength(formData.title, "عنوان القصة", {
    min: 1,
    max: STORY_MAX_LENGTHS.TITLE,
    required: true,
  });
  if (titleErr) {
    errors.title = titleErr;
  }

  if (!formData.cover) {
    errors.cover = "يرجى اختيار صورة غلاف للقصة.";
  }

  // Step 2 checks
  CONSTITUTION_FIELDS.forEach((field) => {
    const val = formData.constitution?.[field.key]?.trim() || "";
    const fieldMax = field.maxLength || STORY_MAX_LENGTHS.CONSTITUTION_FIELD;

    if (field.required && !val) {
      errors[`constitution_${field.key}`] = `يرجى إدخال ${field.label}.`;
    } else if (val.length > fieldMax) {
      errors[`constitution_${field.key}`] = `يجب ألا يتجاوز الحقل ${fieldMax} حرف.`;
    }
  });

  // Step 3 checks
  const lensErr = validateSelect(formData.lens, "منظور القصة");
  if (lensErr) errors.lens = lensErr;

  const styleErr = validateSelect(formData.visualStyle, "النمط البصري");
  if (styleErr) errors.visualStyle = styleErr;

  const notesErr = validateTextLength(
    formData.visualStyleNotes,
    "ملاحظات الرؤية البصرية للقصة",
    { min: 1, max: STORY_MAX_LENGTHS.VISUAL_STYLE_NOTES, required: true }
  );
  if (notesErr) errors.visualStyleNotes = notesErr;

  return errors;
}
