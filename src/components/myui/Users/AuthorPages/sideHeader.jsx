import React from "react";

const PageHeader = ({
  mainTitle = "Main Title",
  buttonTitle = "",
  onPress = () => {},
}) => {
  const showButton = buttonTitle && buttonTitle.trim() !== "";

  return (
    <header 
      className="
        hidden md:block 
        sticky top-0 z-50
        w-full h-16 
        border-b border-black/5
        bg-white/70 backdrop-blur-md
        rtl relative
      "
    >

      {/* TITLE – always centered */}
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

      {/* ONLY SHOW BUTTON IF PARAM EXISTS */}
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

    </header>
  );
};

export default PageHeader;
