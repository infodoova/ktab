import React from "react";
import { AppLayout } from "@/components/myui/layout";
import "./LibrarianDashboardView.css";

/**
 * Librarian Dashboard View (Blank Shell).
 * Wrapped in AppLayout for shared navigation sidebar and header.
 */
export default function LibrarianDashboardView() {
  return (
    <AppLayout pageName="لوحة التحكم" showSearch={false}>
      <div className="librarian-blank-view" dir="rtl">
        {/* Blank content ready for future development */}
      </div>
    </AppLayout>
  );
}
