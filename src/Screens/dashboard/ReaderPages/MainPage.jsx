import React, { useState } from "react";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";

// NEW COMPONENTS
import MainPageAnalyticsCP from "../../../components/myui/Users/ReaderPages/MainPage/MainPageAnalyticsCP";
import ContinueReadingCP from "../../../components/myui/Users/ReaderPages/MainPage/ContinueReadingCP";
import RecommendedBooksCP from "../../../components/myui/Users/ReaderPages/MainPage/RecommendedBooksCP";
import AssignedBooksCP from "../../../components/myui/Users/ReaderPages/MainPage/AssignedBooksCP";

function MainPage({ pageName = "الصفحة الرئيسية" }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white rtl">
      <Navbar
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col w-full min-w-0">
          <PageHeader
            mainTitle={pageName}
          />

          {/* DASHBOARD CONTENT - Added max-w-full and overflow-hidden */}
          <div className="w-full max-w-full overflow-hidden px-6 py-8 space-y-10">
            <MainPageAnalyticsCP />

            <ContinueReadingCP />

            <RecommendedBooksCP />

            <AssignedBooksCP />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;