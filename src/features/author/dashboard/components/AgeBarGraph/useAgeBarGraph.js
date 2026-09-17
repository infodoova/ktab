import { useMemo } from "react";

/**
 * Hook preparing demographic age bracket data and display state.
 */
export function useAgeBarGraph({ data = [], loading = false }) {
  const hasData = useMemo(() => {
    return !loading && Array.isArray(data) && data.length > 0;
  }, [data, loading]);

  return {
    hasData,
  };
}

export default useAgeBarGraph;
