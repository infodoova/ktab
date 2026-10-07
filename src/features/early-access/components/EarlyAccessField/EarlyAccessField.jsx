import { Input, Select, Textarea } from "@/components/myui/forms";
import "./EarlyAccessField.css";

export default function EarlyAccessField({ field, value, error, onChange, disabled }) {
  const isPhone = field.type === "tel" || field.name.toLowerCase().includes("phone");

  const handleKeyDown = (e) => {
    if (!isPhone) return;
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "Enter" ||
      ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    if (isPhone) {
      const sanitized = e.target.value.replace(/\D/g, "");
      onChange({
        ...e,
        target: {
          ...e.target,
          name: field.name,
          value: sanitized,
        },
      });
    } else {
      onChange(e);
    }
  };

  const inputProps = {
    id: `early-access-${field.name}`,
    name: field.name,
    value: value || "",
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    inputMode: isPhone ? "numeric" : undefined,
    pattern: isPhone ? "[0-9]*" : undefined,
    required: field.required,
    maxLength: field.maxLength,
    autoComplete: field.autoComplete,
    placeholder: field.placeholder,
    dir: isPhone ? "ltr" : field.dir,
    disabled,
    label: field.label,
    error,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `early-access-error-${field.name}` : undefined,
  };
  return (
    <div className={`early-access-field ${field.type === "textarea" ? "early-access-field-wide" : ""}`}>
      {field.type === "select" ? (
        <Select {...inputProps} options={field.options} label={`${field.label} (اختياري)`} />
      ) : field.type === "textarea" ? (
        <Textarea {...inputProps} rows={4} />
      ) : (
        <Input {...inputProps} type={isPhone ? "tel" : field.type} showCount={false} />
      )}
    </div>
  );
}
