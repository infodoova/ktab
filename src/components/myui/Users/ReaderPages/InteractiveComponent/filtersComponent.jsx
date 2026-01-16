import React from "react";

function FiltersComponent({
  value = "ALL",
  onChange = () => {},
  genres = [],
  disabled = false,
  label = "التصنيف",
}) {
  return (
    <div dir="rtl" className="w-full">
      <label className="sr-only">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-right shadow-sm outline-none transition focus:ring-2 focus:ring-[var(--earth-brown)]/30 focus:border-[var(--earth-brown)] disabled:opacity-60"
      >
        <option value="ALL">كل التصنيفات</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FiltersComponent;
