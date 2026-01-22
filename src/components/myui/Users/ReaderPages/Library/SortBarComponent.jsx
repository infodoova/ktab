import { ChevronsUp, ChevronsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SortBar({ sortField = "title", ascending = true, onSortChange }) {
  const SORT_FIELDS = [
    { id: "title", label: "العنوان" },
    { id: "rating", label: "التقييم" },
    { id: "publishDate", label: "سنة النشر" },
  ];

  const handleSortChange = (field) => {
    onSortChange?.({ field, ascending });
  };

  const toggleOrder = () => {
    onSortChange?.({ field: sortField, ascending: !ascending });
  };

  return (
    <div className="w-full flex justify-between items-center py-5 px-6 border-b border-black/10 bg-white/80 backdrop-blur-md relative z-10">
      
      {/* Left Side: Sort Dropdown */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-text)]/40">
          فرز حسب:
        </span>

        <div className="relative">
          <select
            className="appearance-none bg-white border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-black uppercase tracking-tight text-[var(--primary-text)] shadow-sm transition-all cursor-pointer hover:border-black/20 focus:outline-none focus:ring-4 focus:ring-black/5 w-[150px]"
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
        variant="ghost"
        size="icon"
        onClick={toggleOrder}
        className="rounded-xl w-11 h-11 border border-black/10 hover:bg-black/5 text-[var(--primary-text)] transition-all shadow-sm active:scale-90"
      >
        {ascending ? (
          <ChevronsUp size={20} strokeWidth={2.5} />
        ) : (
          <ChevronsDown size={20} strokeWidth={2.5} />
        )}
      </Button>
    </div>
  );
}