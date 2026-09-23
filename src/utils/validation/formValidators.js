/**
 * Higher-order form validation runner.
 * Evaluates an object of form values against specified field validators,
 * aggregating all errors into a single error dictionary.
 *
 * @param {Object} values - Key-value pair of form field values
 * @param {Object.<string, Function|Function[]>} schema - Object mapping field keys to validator function(s)
 * @returns {{ isValid: boolean, errors: Record<string, string>, firstError: string|null }}
 */
export function validateFields(values, schema) {
  const errors = {};

  for (const [field, validator] of Object.entries(schema)) {
    const val = values[field];

    if (Array.isArray(validator)) {
      for (const fn of validator) {
        if (typeof fn === "function") {
          const err = fn(val, values);
          if (err) {
            errors[field] = err;
            break; // Stop at first error for this field
          }
        }
      }
    } else if (typeof validator === "function") {
      const err = validator(val, values);
      if (err) {
        errors[field] = err;
      }
    }
  }

  const errorKeys = Object.keys(errors);
  const isValid = errorKeys.length === 0;
  const firstError = isValid ? null : errors[errorKeys[0]];

  return { isValid, errors, firstError };
}
