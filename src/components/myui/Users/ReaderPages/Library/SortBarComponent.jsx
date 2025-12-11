import { ChevronsUp, ChevronsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SortBar({ sortField = "title", ascending = true, onSortChange }) {
  const SORT_FIELDS = [
    { id: "title", label: "العنوان" },
    { id: "rating", label: "التقييم" },
    { id: "date", label: "سنة النشر" },
  ];

  const handleSortChange = (field) => {
    onSortChange?.({ field, ascending });
  };

  const toggleOrder = () => {
    onSortChange?.({ field: sortField, ascending: !ascending });
  };

  return (
    <div className="w-full flex justify-between items-center py-4 px-4 sm:px-6 border-b border-neutral-100 bg-white/50">
      
      {/* Left Side: Sort Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-500">
          فرز حسب:
        </span>

        <div className="relative">
          <select
            className="appearance-none bg-white border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all cursor-pointer hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-100 focus:border-neutral-300 w-[140px]"
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {SORT_FIELDS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          
          {/* Custom Chevron Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1L5 5L9 1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side: Round Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleOrder}
        className="rounded-full w-10 h-10 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm"
      >
        {ascending ? (
          <ChevronsUp size={18} className="text-neutral-600" />
        ) : (
          <ChevronsDown size={18} className="text-neutral-600" />
        )}
      </Button>
    </div>
  );
}