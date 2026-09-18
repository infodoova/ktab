import { useCallback } from "react";

export const SORT_FIELDS = [
  { id: "title", label: "العنوان" },
  { id: "rating", label: "التقييم" },
  { id: "publishDate", label: "سنة النشر" },
];

/**
 * Hook managing sort field and direction state for the library toolbar.
 *
 * @param {Object} params
 * @param {string} [params.sortField="title"]
 * @param {boolean} [params.ascending=true]
 * @param {Function} [params.onSortChange]
 */
export function useLibrarySortBar({
  sortField = "title",
  ascending = true,
  onSortChange,
} = {}) {
  const handleFieldChange = useCallback(
    (field) => {
      onSortChange?.({ field, ascending });
    },
    [ascending, onSortChange]
  );

  const handleToggleOrder = useCallback(() => {
    onSortChange?.({ field: sortField, ascending: !ascending });
  }, [ascending, onSortChange, sortField]);

  return {
    sortFields: SORT_FIELDS,
    handleFieldChange,
    handleToggleOrder,
  };
}

export default useLibrarySortBar;
