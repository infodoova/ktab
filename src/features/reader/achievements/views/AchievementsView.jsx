import React from "react";
import { AppLayout } from "@/components/myui/layout";
import { AchievementsStats } from "../components/AchievementsStats";
import { AchievementCard } from "../components/AchievementCard";

/**
 * Pure presentation view for the Reader Achievements page.
 * Uses pure props and zero mock fallbacks.
 */
export function AchievementsView({
  pageName = "الإنجازات و الشارات",
  stats = [],
  achievements = [],
  loading = false,
}) {
  return (
    <AppLayout pageName={pageName}>
      <div className="max-w-[1400px] mx-auto py-6" dir="rtl">
        {/* Top Summary Stats */}
        <AchievementsStats stats={stats} />

        {/* Badges and Achievements Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] p-8 border border-black/[0.05] shadow-sm animate-pulse space-y-4"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-3xl mx-auto" />
                <div className="h-5 bg-slate-100 rounded-xl w-1/2 mx-auto" />
                <div className="h-4 bg-slate-100 rounded-xl w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 border border-black/[0.05] shadow-sm text-center">
            <p className="text-slate-400 font-bold text-sm">
              لا توجد شارات أو إنجازات مسجلة حتى الآن. استمر في القراءة لفتح شارات جديدة!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}


export default AchievementsView;
