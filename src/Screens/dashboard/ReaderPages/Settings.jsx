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
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-tajawal rtl" dir="rtl">
      {/* NAVBAR */}
      <div dir="ltr">
        <Navbar
          mobileButtonTitle={buttonTitleText}
          onMobileButtonPress={handleButtonPress}
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* LAYOUT */}
      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300 ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1 flex flex-col">
          {/* HEADER */}
          <PageHeader
            mainTitle={pageName}
          />

          {/* CONTENT - Centered */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 border border-black/[0.03] shadow-[0_30px_60px_rgba(0,0,0,0.05)] text-center">
              {/* ICON/LOGO AREA */}
              <div className="w-24 h-24 bg-[#5de3ba]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <LogOut size={40} className="text-[#5de3ba]" strokeWidth={2.5} />
              </div>

              {/* TEXT */}
              <h2 className="text-3xl font-black text-slate-900 mb-4 font-tajawal">
                {pageName}
              </h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
              </p>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex items-center justify-center gap-4 
                  bg-[#0a0a0a] text-white
                  px-8 py-6 rounded-3xl
                  hover:bg-[#1a1a1a] active:scale-[0.98] transition-all duration-300
                  text-sm font-black uppercase tracking-widest
                  shadow-xl shadow-black/10
                "
              >
                <LogOut size={18} strokeWidth={3} />
                <span>تسجيل الخروج الآن</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
