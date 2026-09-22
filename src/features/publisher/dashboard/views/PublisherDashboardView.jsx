import React from "react";
import { AppLayout } from "@/components/myui/layout";
import "./PublisherDashboardView.css";

/**
 * Publisher Dashboard View (Blank Shell).
 * Wrapped in AppLayout for shared navigation sidebar and header.
 */
export default function PublisherDashboardView() {
  return (
    <AppLayout pageName="لوحة التحكم" showSearch={false}>
      <div className="publisher-blank-view" dir="rtl">
        {/* Blank content ready for future development */}
      </div>
    </AppLayout>
  );
}
