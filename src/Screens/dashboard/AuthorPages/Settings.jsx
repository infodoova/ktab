import React, { useState } from "react";
import Navbar from "../../components/myui/Users/navbar";
import PageHeader from "../../components/myui/Users/sideHeader";

function AITools({ pageName = "   الاعدادات " }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleButtonPress = () => console.log("Button pressed");
  const buttonTitleText = "زر";

  return (
    <div className="min-h-screen bg-[var(--earth-cream)] rtl">
      
      {/* NAVBAR WITH COLLAPSE CONTROL */}
      <Navbar
        mobileButtonTitle={buttonTitleText}
        onMobileButtonPress={handleButtonPress}
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* DYNAMIC LAYOUT SPACING BASED ON COLLAPSED STATE */}
      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col">

          {/* ✅ FIX: Removed wrapper div. PageHeader is now a direct child. */}
          <PageHeader
            mainTitle={pageName}
            buttonTitle={buttonTitleText}
            onPress={handleButtonPress}
          />

          {/* Content */}
          <div className="flex flex-1 items-center justify-center p-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[var(--earth-brown)] mb-4">
                Hi this is {pageName}
              </h1>
              <p className="text-[var(--earth-brown)]/70 text-lg">
                مرحباً بك في صفحة {pageName}
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default AITools;