import { useState, useMemo, useCallback } from "react";

/**
 * Custom hook managing active slice hover, click toggling, and metric calculations for MostReadPieChart.
 */
export function useMostReadPieChart({ data = [] }) {
  const [activeSliceIndex, setActiveSliceIndex] = useState(null);

  const totalValue = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  }, [data]);

  const activeSlice = useMemo(() => {
    if (activeSliceIndex === null || !Array.isArray(data) || !data[activeSliceIndex]) {
      return null;
    }
    return data[activeSliceIndex];
  }, [data, activeSliceIndex]);

  const handleSliceHover = useCallback((index) => {
    setActiveSliceIndex(index);
  }, []);

  const handleSliceLeave = useCallback(() => {
    setActiveSliceIndex(null);
  }, []);

  const handleSliceToggle = useCallback((index) => {
    setActiveSliceIndex((prev) => (prev === index ? null : index));
  }, []);

  return {
    totalValue,
    activeSliceIndex,
    activeSlice,
    handleSliceHover,
    handleSliceLeave,
    handleSliceToggle,
  };
}

export default useMostReadPieChart;
