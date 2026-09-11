import React, { useState, useEffect } from "react";
import { Navbar } from "../Navbar";
import { SideHeader } from "../SideHeader";
import { ErrorBoundary } from "@/components/common";
import "./AppLayout.css";

/**
 * Global App Layout Shell
 */
export function AppLayout({
  children,
  pageName = "كِتَاب",
  showSearch = true,
  onSearchClick,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  headerActions,
  isDark = true,
  navLinks,
  className = "",
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const bgColor = isDark ? "#090d16" : "#ffffff";
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.backgroundColor = bgColor;
  }, [isDark]);

  const themeClass = isDark ? "ktab-app-layout--dark" : "ktab-app-layout--light";
  const collapseClass = collapsed
    ? "ktab-app-layout__main-area--collapsed"
    : "ktab-app-layout__main-area--expanded";

  return (
    <div dir="rtl" className={`ktab-app-layout ${themeClass}`}>
      {/* Global Navbar Sidebar */}
      <Navbar
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isDark={isDark}
        showSearch={showSearch}
        onSearchClick={onSearchClick}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        navLinks={navLinks}
      />

      {/* Main Page Area */}
      <div className={`ktab-app-layout__main-area ${collapseClass}`}>
        {/* Desktop Fixed Top Header */}
        <SideHeader
          mainTitle={pageName}
          showSearch={showSearch}
          onSearchClick={onSearchClick}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          isDark={isDark}
          collapsed={collapsed}
        >
          {headerActions}
        </SideHeader>

        {/* Content View with proper clearance for mobile & desktop headers */}
        <main className={`ktab-app-layout__content ${className}`}>
          <ErrorBoundary
            variant="card"
            title={`تعذر تحميل محتوى ${pageName}`}
            message="حدث خطأ غير متوقع أثناء عرض هذه الصفحة. يمكنك محاولة إعادة المحاولة أو الانتقال لقسم آخر."
          >
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
