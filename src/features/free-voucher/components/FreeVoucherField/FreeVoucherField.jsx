import { Input, Select, Textarea } from "@/components/myui/forms";
import "./FreeVoucherField.css";

export default function FreeVoucherField({ field, value, error, onChange, disabled }) {
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
    id: `voucher-${field.name}`,
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
    "aria-describedby": error ? `voucher-error-${field.name}` : undefined,
  };

  return (
    <div className={`free-voucher-field ${field.type === "textarea" ? "free-voucher-field-wide" : ""}`}>
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
