import React from "react";
import { AppLayout } from "@/components/myui/layout";
import "./AdminDashboardView.css";

/**
 * Admin Dashboard View (Blank Shell).
 * Wrapped in AppLayout for shared navigation sidebar and header.
 */
export default function AdminDashboardView() {
  return (
    <AppLayout pageName="لوحة التحكم" showSearch={false}>
      <div className="admin-blank-view" dir="rtl">
        {/* Blank content ready for future development */}
      </div>
    </AppLayout>
  );
}
