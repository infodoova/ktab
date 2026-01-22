import React, { useState } from "react";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";

import AchievementsHeaderCP from "../../../components/myui/Users/ReaderPages/Achievements/AchievementsHeaderCP";
import AchievementsCardsCP from "../../../components/myui/Users/ReaderPages/Achievements/AchievementsCardsCP";

import {
  achievementsStats,
  achievementsList,
} from "../../../components/myui/Users/ReaderPages/Achievements/data";

function Achievements({ pageName = "الإنجازات و الشارات" }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleButtonPress = () => console.log("Button pressed");
  const buttonTitleText = "زر";

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

      {/* LAYOUT */}
      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex-1 flex flex-col">
          {/* HEADER */}
          <PageHeader
            mainTitle={pageName}
            buttonTitle={buttonTitleText}
            onPress={handleButtonPress}
          />

          {/* CONTENT */}
          <div className="flex-1 p-8">
            {/* STATS */}
            <AchievementsHeaderCP stats={achievementsStats} />

            {/* ACHIEVEMENTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {achievementsList.map((achievement) => (
                <AchievementsCardsCP
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Achievements;
