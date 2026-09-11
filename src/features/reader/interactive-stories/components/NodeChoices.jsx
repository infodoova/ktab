import React, { useState } from "react";

/**
 * Pure presentation component for interactive decisions / choices (A, B, C, D).
 */
export function NodeChoices({
  nodes = [],
  onNodeClick,
  disabled = false,
  isDarkMode = true,
  chosenNodeId = null,
}) {
  const [hovered, setHovered] = useState(null);

  if (!nodes.length) return null;

  return (
    <div className="h-full flex flex-col text-right mt-4 md:mt-6" dir="rtl">
      <div
        className={`mb-2 text-[11px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
          isDarkMode ? "text-white/40" : "text-black"
        }`}
      >
        {chosenNodeId ? "مسارك الذي اخترته:" : "اختر مسارك:"}
      </div>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3 md:gap-4 min-h-0 overflow-y-auto lg:overflow-visible p-1 md:p-2">
        {nodes.map((node) => {
          const isHovered = hovered === node.nodeId;
          const isSelected = chosenNodeId === node.nodeId;
          const isOthersDisabled = chosenNodeId && !isSelected;

          return (
            <button
              key={node.nodeId}
              disabled={disabled || Boolean(chosenNodeId)}
              onClick={() => onNodeClick?.(node)}
              onMouseEnter={() => !chosenNodeId && setHovered(node.nodeId)}
              onMouseLeave={() => setHovered(null)}
              className={`group text-right px-3 py-3 md:px-5 md:py-5 rounded-xl md:rounded-2xl border md:border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-center min-h-[80px] md:min-h-0 h-full ${
                isSelected
                  ? "bg-[#5de3ba] border-[#5de3ba] text-black shadow-[0_0_30px_rgba(93,227,186,0.4)] scale-[1.02]"
                  : isHovered
                  ? "bg-[#5de3ba]/20 border-[#5de3ba] shadow-2xl -translate-y-1 scale-[1.02]"
                  : isDarkMode
                  ? "bg-white/5 border-white/5 backdrop-blur-md"
                  : "bg-white/90 border-black/5 backdrop-blur-md shadow-sm"
              } ${isOthersDisabled ? "opacity-30 grayscale-[0.5]" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded-md bg-black/20 text-[#5de3ba]">
                  {node.nodeId}
                </span>
                <span className="font-bold text-xs md:text-sm line-clamp-2">
                  {node.nodeText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NodeChoices;
