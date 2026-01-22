import React, { useState } from "react";

function Nodes({
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
              disabled={disabled || !!chosenNodeId}
              onClick={() => onNodeClick?.(node)}
              onMouseEnter={() => !chosenNodeId && setHovered(node.nodeId)}
              onMouseLeave={() => setHovered(null)}
              className={`
                group
                text-right
                px-3 py-3 md:px-5 md:py-5
                rounded-xl md:rounded-2xl
                border md:border-2
                transition-all
                duration-500
                relative
                overflow-hidden
                flex flex-col justify-center
                min-h-[80px] md:min-h-0
                h-full
                ${
                  isSelected
                    ? "bg-[var(--earth-olive)] border-[var(--earth-olive)] shadow-[0_0_30px_rgba(106,128,88,0.4)] scale-[1.02]"
                    : isHovered
                      ? "bg-[var(--earth-olive)] border-[var(--earth-olive)] shadow-2xl -translate-y-1 scale-[1.02]"
                      : isDarkMode
                        ? "bg-white/5 border-white/5 backdrop-blur-md"
                        : "bg-white/90 border-[var(--earth-sand)]/30 backdrop-blur-md shadow-sm"
                }
                ${isOthersDisabled ? "opacity-30 grayscale-[0.5]" : ""}
                ${
                  disabled || !!chosenNodeId
                    ? "cursor-default"
                    : "cursor-pointer"
                }
              `}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2">
                  <div className="bg-white/20 p-1 md:p-1.5 rounded-full backdrop-blur-md border border-white/30 animate-in zoom-in duration-500">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div
                className={`
                  text-xs md:text-base
                  font-black
                  transition-colors
                  ${
                    isDarkMode 
                      ? (isSelected || isHovered ? "text-white" : "text-white/90")
                      : "text-black"
                  }
                `}
              >
                {node.nodeText}
              </div>
              {node.nodeDescription && (
                <div
                  className={`
                    text-[9px] md:text-[11px]
                    font-bold
                    mt-1
                    transition-colors
                    ${
                      isDarkMode
                        ? (isSelected || isHovered ? "text-white/80" : "text-white/40")
                        : "text-black"
                    }
                  `}
                >
                  {node.nodeDescription}
                </div>
              )}
              
              {/* Decorative arrow that appears on hover */}
              <div className={`
                absolute left-4 top-1/2 -translate-y-1/2
                transition-all duration-300
                ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
              `}>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Nodes;
