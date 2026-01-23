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
                h-10 px-8 rounded-2xl border-0
                bg-gradient-to-r from-[#5de3ba] to-[#76debf]
                text-black font-black uppercase tracking-widest text-[11px]
                hover:shadow-[0_15px_30px_rgba(93,227,186,0.3)]
                hover:scale-105
                transition-all duration-500
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
