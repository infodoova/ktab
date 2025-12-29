import React, { useState } from "react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import RatingModelComponent from "../../../components/myui/Users/AuthorPages/ratings/ratingmodelComponent";
import UserRatings from "../../../components/myui/Users/AuthorPages/ratings/userRatings";

function Ratings({ pageName = "   التقييمات " }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleButtonPress = () => console.log("Button pressed");
  const buttonTitleText = "زر";

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

          <div className="flex-1 p-6 md:p-10 space-y-12 ">
            <RatingModelComponent />
            <UserRatings bookId="123" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Ratings;
