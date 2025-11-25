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
        border-b 
        bg-[#f7f4ef]/80 backdrop-blur-md
        rtl relative
      "
    >

      {/* TITLE – always centered */}
      <div
        className="
          absolute left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2
          text-xl font-bold text-[var(--earth-brown)] text-center
          pointer-events-none
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
              h-9 px-4 rounded-md border 
              border-[var(--earth-olive)]
              text-[var(--earth-olive)]
              hover:bg-[var(--earth-olive)]/10
              transition font-semibold
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
