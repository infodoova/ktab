import React from "react";
import { Search } from "lucide-react";

const PageHeader = ({
  mainTitle = "Main Title",
  buttonTitle = "",
  onPress = () => {},
  onSearchClick, 
}) => {
  const showButton = buttonTitle && buttonTitle.trim() !== "";
  const showSearch = typeof onSearchClick === "function"; 

  return (
    <header
      className="
        hidden md:block 
        sticky top-0 z-[50]
        w-full h-16 
        border-b border-black/5
        bg-white/70 backdrop-blur-2xl
        rtl relative
      "
    >

      <div
        className="
          absolute left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2
          text-lg font-black text-black text-center
          pointer-events-none tracking-tight
        "
      >
        {mainTitle}
      </div>

      {/* BUTTON (LEFT SIDE) */}
      {showButton && (
        <div
          className="
            absolute left-6 top-1/2 
            -translate-y-1/2 
            flex items-center
          "
        >
          <button
            onClick={onPress}
            className="
              h-9 px-6 rounded-xl border-0
              bg-gradient-to-r from-[#5de3ba] to-[#76debf]
              text-white
              hover:opacity-90
              transition-all duration-300 font-black uppercase tracking-widest text-[10px]
              whitespace-nowrap shadow-[0_10px_20px_rgba(93,227,186,0.15)]
            "
          >
            {buttonTitle}
          </button>
        </div>
      )}
 
      {/* SEARCH BUTTON (ONLY IF PROVIDED) */}
      {showSearch && (
        <div
          className={`
            absolute ${showButton ? "left-20" : "left-6"} 
            top-1/2 -translate-y-1/2 
            flex items-center
          `}
        >
          <button
            onClick={onSearchClick}
            aria-label="بحث"
            className="
              p-2.5 rounded-full 
              text-black/30
              hover:text-[#5de3ba]
              hover:bg-[#5de3ba]/5 
              transition-all duration-300
            "
          >
            <Search size={22} strokeWidth={2.5} />
          </button>
        </div>
      )}

    </header>
  );
};

export default PageHeader;
