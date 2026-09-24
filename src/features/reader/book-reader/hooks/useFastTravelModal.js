import { useState, useMemo } from "react";

/**
 * Custom hook managing 50-page chunked pagination logic for FastTravelModal.
 * Handles automatic chunk selection based on the active page, synchronization,
 * and node selection events without cascading effect renders.
 */
export function useFastTravelModal({
  isOpen,
  onClose,
  currentPage = 1,
  totalPages = 1,
  onGoToPage,
}) {
  const CHUNK_SIZE = 50;
  const pageChunk = Math.floor((Math.max(1, currentPage) - 1) / CHUNK_SIZE);
  const [selectedChunkOverride, setSelectedChunkOverride] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Reset manual chunk override whenever the modal opens or closes
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setSelectedChunkOverride(null);
  }

  const selectedChunk = selectedChunkOverride !== null ? selectedChunkOverride : pageChunk;

  // Compute 50-page chunk intervals
  const chunks = useMemo(() => {
    const list = [];
    const count = Math.max(1, Math.ceil(totalPages / CHUNK_SIZE));
    for (let i = 0; i < count; i++) {
      const start = i * CHUNK_SIZE + 1;
      const end = Math.min((i + 1) * CHUNK_SIZE, totalPages);
      list.push({ index: i, start, end, label: `${start} - ${end}` });
    }
    return list;
  }, [totalPages]);

  // Compute individual page nodes within the currently selected chunk
  const activePages = useMemo(() => {
    const currentRange = chunks[selectedChunk] || chunks[0];
    if (!currentRange) return [];
    const pages = [];
    for (let p = currentRange.start; p <= currentRange.end; p++) {
      pages.push(p);
    }
    return pages;
  }, [chunks, selectedChunk]);

  const handleSelectChunk = (chunkIndex) => {
    setSelectedChunkOverride(chunkIndex);
  };

  const handleNodeClick = (pageNumber) => {
    onGoToPage?.(pageNumber);
    onClose?.();
  };

  return {
    chunks,
    activePages,
    selectedChunk,
    currentPage,
    handleSelectChunk,
    handleNodeClick,
  };
}

export default useFastTravelModal;
