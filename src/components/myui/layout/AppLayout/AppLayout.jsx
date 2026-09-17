import React from "react";
import { Navbar } from "../Navbar";
import { SideHeader } from "../SideHeader";
import { ErrorBoundary } from "@/components/common";
import { useAppLayout } from "./useAppLayout";
import "./AppLayout.css";

/**
 * Global App Layout Shell
 * Eleven Reader + Apple clean editorial foundation.
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
  isDark = false,
  navLinks,
  className = "",
}) {
  const { collapsed, setCollapsed } = useAppLayout({ isDark });

  const themeClass = isDark ? "ktab-layout--dark" : "ktab-layout--light";
  const collapseClass = collapsed
    ? "ktab-layout__main--collapsed"
    : "ktab-layout__main--expanded";

  return (
    <div dir="rtl" className={`ktab-layout ${themeClass}`}>
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
        headerActions={headerActions}
      />

      {/* Main Page Area */}
      <div className={`ktab-layout__main ${collapseClass}`}>
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
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        >
          {headerActions}
        </SideHeader>

        {/* Content View with clean clearance for mobile & desktop headers */}
        <main className={`ktab-layout__content ${className}`}>
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
