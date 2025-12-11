import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";
import { LogOut } from "lucide-react";

function Settings({ pageName = "   الاعدادات " }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleButtonPress = () => console.log("Button pressed");
  const buttonTitleText = "زر";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--earth-cream)] rtl">

      {/* NAVBAR */}
      <Navbar
        mobileButtonTitle={buttonTitleText}
        onMobileButtonPress={handleButtonPress}
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col">

          <PageHeader
            mainTitle={pageName}
            buttonTitle={buttonTitleText}
            onPress={handleButtonPress}
          />

          {/* CONTENT */}
          <div className="p-10 flex flex-col items-center gap-10">

            {/* TITLE */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[var(--earth-brown)] mb-3">
                Hi this is {pageName}
              </h1>
              <p className="text-[var(--earth-brown)]/70 text-lg">
                مرحباً بك في صفحة {pageName}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="
                flex items-center gap-3 
                bg-[var(--earth-brown)] text-white
                px-8 py-3 rounded-xl
                shadow-md hover:shadow-lg 
                hover:bg-[var(--earth-brown-dark)]
                active:scale-95 transition-all
                text-lg font-semibold
              "
            >
              <LogOut size={20} />
              تسجيل الخروج
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Settings;
