import React, { useState } from "react";

const NODE_VARIANTS = [
  {
    primary: "var(--earth-olive)",
    secondary: "var(--earth-sand)",
    accent: "var(--earth-cream)",
    border: "border-[var(--earth-olive)]",
    text: "text-[var(--earth-olive-dark)]",
    bgGradient: "from-[var(--earth-olive)]/10 to-[var(--earth-olive)]/5",
  },
  {
    primary: "#BC6C25", // Terracotta/Ochre
    secondary: "#DDA15E",
    accent: "#FEFAE0",
    border: "border-[#BC6C25]",
    text: "text-[#5D4037]",
    bgGradient: "from-[#BC6C25]/10 to-[#BC6C25]/5",
  },
  {
    primary: "#283618", // Deep Forest
    secondary: "#606C38",
    accent: "#F4EFE9",
    border: "border-[#283618]",
    text: "text-[#283618]",
    bgGradient: "from-[#283618]/10 to-[#283618]/5",
  },
  {
    primary: "#5D4037", // Deep Earth Brown
    secondary: "#D7CCC8",
    accent: "#FEFCF8",
    border: "border-[#5D4037]",
    text: "text-[#3E2723]",
    bgGradient: "from-[#5D4037]/10 to-[#5D4037]/5",
  },
];

function Nodes({ nodes = [], onNodeClick, disabled = false }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!nodes.length) return null;

  const handleNodeClick = (node) => {
    if (!disabled) onNodeClick?.(node);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-3 flex-1" dir="rtl">
        {nodes.map((node, index) => {
          const isHovered = hoveredNode === node.nodeId;
          const variant = NODE_VARIANTS[index % NODE_VARIANTS.length];

          return (
            <button
              key={node.nodeId}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.nodeId)}
              onMouseLeave={() => setHoveredNode(null)}
              disabled={disabled}
              className={`
                relative group overflow-hidden
                rounded-tr-3xl rounded-bl-3xl rounded-tl-lg rounded-br-lg
                transition-all duration-500 ease-out
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1 hover:shadow-lg"}
              `}
              style={{
                boxShadow: isHovered ? `0 10px 20px -5px ${variant.primary}33` : "none",
              }}
            >
              {/* Animated Background Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-[shimmer_2s_infinite] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Outer frame: thick, premium border */}
              <div
                className={`
                  absolute inset-0 rounded-tr-3xl rounded-bl-3xl rounded-tl-lg rounded-br-lg
                  border-2 md:border-[3px] transition-colors duration-300
                  ${variant.border}
                  ${isHovered ? "opacity-100" : "opacity-40"}
                  pointer-events-none
                `}
              />

              {/* Decorative corner accent */}
              <div 
                className="absolute top-0 right-0 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity"
                style={{
                  background: `radial-gradient(circle at top right, ${variant.primary}, transparent 70%)`
                }}
              />

              {/* Inner frame: subtle inset border for depth */}
              <div
                className={`
                  absolute inset-[3px] md:inset-[4px]
                  rounded-tr-2xl rounded-bl-2xl rounded-tl-md rounded-br-md
                  border transition-all duration-300
                  ${isHovered ? "border-white/40" : "border-white/20"}
                  pointer-events-none
                `}
              />

              {/* Content surface */}
              <div
                className={`
                  relative h-full w-full
                  glass
                  p-3 md:p-4
                  flex items-center justify-center text-center
                  transition-all duration-300
                  ${isHovered ? "bg-white/60" : "bg-white/40"}
                `}
              >
                {/* Gradient Fill */}
                <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${variant.bgGradient} pointer-events-none`} />
                
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: `radial-gradient(${variant.primary} 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />

                {/* Text */}
                <div className="relative z-10 px-1">
                  <p className={`
                    text-[11px] md:text-[14px]
                    font-bold leading-snug
                    transition-all duration-300
                    ${variant.text}
                    ${isHovered ? "scale-105" : "scale-100"}
                  `}>
                    {node.nodeText}
                    {node.nodeDescription && (
                      <span className="block text-[9px] md:text-[11px] font-normal opacity-70 mt-0.5">
                        {node.nodeDescription}
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Bottom Left Corner Dot */}
                <div 
                  className={`absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHovered ? "scale-150" : "scale-100"}`}
                  style={{ backgroundColor: variant.primary }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Nodes;
