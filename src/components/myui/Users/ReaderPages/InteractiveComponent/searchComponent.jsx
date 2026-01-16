import React from "react";

function SearchComponent({
  value = "",
  onChange = () => {},
  placeholder = "ابحث عن قصة...",
  disabled = false,
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      dir="rtl"
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-right shadow-sm outline-none transition focus:ring-2 focus:ring-[var(--earth-brown)]/30 focus:border-[var(--earth-brown)] disabled:opacity-60"
    />
  );
}

export default SearchComponent;
