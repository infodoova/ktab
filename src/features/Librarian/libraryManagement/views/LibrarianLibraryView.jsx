import React from "react";
import { AppLayout } from "@/components/myui/layout";
import "./LibrarianLibraryView.css";

/**
 * Librarian Library Management View (Blank Shell).
 * Wrapped in AppLayout for shared navigation sidebar and header.
 */
export default function LibrarianLibraryView() {
  return (
    <AppLayout pageName="إدارة المكتبة" showSearch={false}>
      <div className="librarian-blank-view" dir="rtl">
        {/* Blank content ready for future development */}
      </div>
    </AppLayout>
  );
}
