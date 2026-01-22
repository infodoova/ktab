import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";
import { LogOut } from "lucide-react";

function Settings({ pageName = "الاعدادات" }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleButtonPress = () => console.log("Button pressed");
  const buttonTitleText = "زر";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white rtl">
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
              <h1 className="text-4xl font-black text-black tracking-tight mb-3 uppercase">
                {pageName}
              </h1>
              <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">
                مرحباً بك في صفحة الإعدادات الخاصة بك
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="
                btn-premium
                flex items-center gap-4 
                text-white
                px-10 py-5 rounded-[2rem]
                active:scale-95 transition-all
                text-[10px] font-black uppercase tracking-[0.2em]
              "
            >
              <LogOut size={18} strokeWidth={3} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
