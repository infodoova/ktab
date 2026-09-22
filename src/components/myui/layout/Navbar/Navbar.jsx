import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  MoreVertical,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { useNavbar } from "./useNavbar";
import "./Navbar.css";

/**
 * Editorial Apple / Eleven Reader Inspired Global Navbar & Sidebar.
 * Pure editorial typography, no profile pictures ("pp"), no badges,
 * and zero unsolicited clutter.
 */
export function Navbar({
  collapsed = false,
  setCollapsed,
  isDark = false,
  showSearch = true,
  onSearchClick,
  searchQuery,
  onSearchChange,
  navLinks,
  pageName,
  headerActions,
  onFilterClick,
  activeFiltersCount = 0,
}) {
  const {
    firstName,
    roleLabel,
    sub,
    isUserLoaded,
    links,
    isLinkActive,
    logo,
    brandIcon,
    mobileOpen,
    setMobileOpen,
    mobileSearchOpen,
    mobileSearchInputRef,
    query,
    userMenuOpen,
    userMenuRef,
    handleMobileSearchClick,
    handleCloseMobileSearch,
    handleQueryChange,
    handleToggleCollapse,
    handleToggleUserMenu,
    handleLogout,
  } = useNavbar({
    collapsed,
    setCollapsed,
    isDark,
    onSearchClick,
    searchQuery,
    onSearchChange,
    navLinks,
  });

  const themeMobileClass = isDark ? "ktab-nav-mobile--dark" : "ktab-nav-mobile--light";
  const themeDesktopClass = isDark ? "ktab-nav-desktop--dark" : "ktab-nav-desktop--light";
  const collapseDesktopClass = collapsed ? "ktab-nav-desktop--collapsed" : "ktab-nav-desktop--expanded";

  return (
    <>
      {/* ============================================================ */}
      {/* 📱 MOBILE HEADER BAR                                         */}
      {/* ============================================================ */}
      <header className={`ktab-nav-mobile ${themeMobileClass}`} dir="rtl">
        {mobileSearchOpen ? (
          <div className="ktab-nav-mobile__search-wrapper">
            <div className="ktab-nav-mobile__search-box">
              <Search size={16} className="ktab-nav-mobile__search-icon" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                className="ktab-nav-mobile__search-input"
              />
            </div>
            {onFilterClick && (
              <button
                type="button"
                onClick={onFilterClick}
                className="ktab-nav-mobile__icon-btn ktab-nav-mobile__filter-btn"
                aria-label="تصفية النتائج"
                title="تصفية متقدمة"
              >
                <SlidersHorizontal size={17} strokeWidth={2} />
                {activeFiltersCount > 0 && (
                  <span className="ktab-nav-mobile__filter-badge">{activeFiltersCount}</span>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseMobileSearch}
              className="ktab-nav-mobile__icon-btn"
              aria-label="إغلاق البحث"
            >
              <X size={17} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="ktab-nav-mobile__inner">
            {/* Right: Page Name (No logo on mobile) */}
            <div className="ktab-nav-mobile__title-area">
              <span className="ktab-nav-mobile__title">{pageName || "كِتَاب"}</span>
            </div>

            {/* Left: Actions + on max left the Hamburger Menu */}
            <div className="ktab-nav-mobile__actions">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(true)}
                className="ktab-nav-mobile__icon-btn"
                aria-label="فتح القائمة"
              >
                <Menu size={19} strokeWidth={2} />
              </motion.button>
              {showSearch && (
                <button
                  type="button"
                  onClick={handleMobileSearchClick}
                  className="ktab-nav-mobile__icon-btn"
                  aria-label="البحث"
                  style={{ position: "relative" }}
                >
                  <Search size={18} strokeWidth={2} />
                  {activeFiltersCount > 0 && (
                    <span className="ktab-topbar__search-dot" />
                  )}
                </button>
              )}
              {headerActions && (
                <div className="ktab-nav-mobile__custom-actions">{headerActions}</div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 📱 MOBILE DRAWER OVERLAY (Buttery Smooth Framer Motion)       */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="ktab-nav-drawer-overlay" dir="rtl">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="ktab-nav-drawer-backdrop"
              onClick={() => setMobileOpen(false)}
            />

            {/* Aside Drawer docked on RIGHT: slides in from right-to-left, closes left-to-right */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 350,
                mass: 0.8,
              }}
              className={`ktab-nav-drawer-aside ${isDark ? "ktab-nav-drawer--dark" : "ktab-nav-drawer--light"}`}
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header inside drawer */}
                <div className="ktab-nav-drawer-header">
                  <Link to="/" onClick={() => setMobileOpen(false)}>
                    <img src={logo} alt="Ktab Logo" className="ktab-nav-drawer-logo" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="ktab-nav-drawer-close-btn"
                    aria-label="إغلاق القائمة"
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </div>

                {/* Navigation Links: Icons on the right side */}
                <nav className="ktab-nav-drawer-nav">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = isLinkActive(link.path);

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`ktab-nav-item ${active ? "ktab-nav-item--active" : "ktab-nav-item--inactive"}`}
                      >
                        <span className="ktab-nav-item__icon-wrapper">
                          <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                        </span>
                        <span className="ktab-nav-item__label">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User Profile Summary with Options Popover (No PP / No Badges) */}
              <div className="ktab-nav-drawer-footer">
                <div className="ktab-nav-profile__wrapper" ref={userMenuRef}>
                  {!isUserLoaded ? (
                    <div className="ktab-nav-profile ktab-nav-profile--loading" aria-busy="true" aria-label="جاري التحميل...">
                      <div className="ktab-nav-profile__info">
                        <div className="ktab-nav-skeleton ktab-nav-skeleton--name" />
                        <div className="ktab-nav-skeleton ktab-nav-skeleton--email" />
                      </div>
                    </div>
                  ) : (
                    <>
                      {userMenuOpen && (
                        <div
                          className="ktab-user-menu-popover"
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                        >
                          <div className="ktab-user-menu-header">
                            <div className="ktab-user-menu-header__details">
                              <div className="ktab-user-menu-header__top-row">
                                <span className="ktab-user-menu-header__name">{firstName}</span>
                                {roleLabel && (
                                  <span className="ktab-user-menu-role-badge">{roleLabel}</span>
                                )}
                              </div>
                              <span className="ktab-user-menu-header__email">{sub}</span>
                            </div>
                          </div>
                          <div className="ktab-user-menu-divider" />
                          <button
                            type="button"
                            onClick={handleLogout}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="ktab-user-menu-item ktab-user-menu-item--danger"
                          >
                            <LogOut size={15} strokeWidth={2} />
                            <span>تسجيل الخروج</span>
                          </button>
                        </div>
                      )}

                      <div className="ktab-nav-profile">
                        <div className="ktab-nav-profile__info">
                          <span className="ktab-nav-profile__name">{firstName}</span>
                          <p className="ktab-nav-profile__email">{sub}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleToggleUserMenu}
                          className="ktab-nav-profile__options-btn"
                          aria-label="خيارات الحساب"
                          title="خيارات الحساب"
                        >
                          <MoreVertical size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 💻 DESKTOP SIDEBAR                                           */}
      {/* ============================================================ */}
      <aside className={`ktab-nav-desktop ${collapseDesktopClass} ${themeDesktopClass}`} dir="rtl">
        <div className="ktab-nav-desktop__top">
          {/* Top Brand Header (Height matches SideHeader 4rem for perfect alignment) */}
          <div className="ktab-nav-desktop__brand-row">
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="ktab-nav-desktop__logo-btn"
              aria-label={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
              title={collapsed ? "توسيع القائمة" : "طي القائمة"}
            >
              {collapsed ? (
                <img
                  src={brandIcon}
                  alt="Ktab Icon"
                  className="ktab-nav-desktop__brand-icon"
                />
              ) : (
                <img
                  src={logo}
                  alt="Ktab Logo"
                  className="ktab-nav-desktop__logo"
                />
              )}
            </button>
          </div>

          {/* Navigation Links: Icons on the right side */}
          <nav className="ktab-nav-desktop__nav">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={collapsed ? link.label : undefined}
                  className={`ktab-nav-item ${active ? "ktab-nav-item--active" : "ktab-nav-item--inactive"} ${
                    collapsed ? "ktab-nav-item--collapsed" : ""
                  }`}
                >
                  <span className="ktab-nav-item__icon-wrapper">
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  </span>
                  {!collapsed && (
                    <span className="ktab-nav-item__label">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer with Options Component (No PP / No Badges) */}
        <div className="ktab-nav-desktop__footer">
          <div className="ktab-nav-profile__wrapper" ref={userMenuRef}>
            {!isUserLoaded ? (
              <div
                className={`ktab-nav-profile ktab-nav-profile--loading ${
                  collapsed ? "ktab-nav-profile--collapsed" : ""
                }`}
                aria-busy="true"
                aria-label="جاري التحميل..."
              >
                {!collapsed ? (
                  <div className="ktab-nav-profile__info">
                    <div className="ktab-nav-skeleton ktab-nav-skeleton--name" />
                    <div className="ktab-nav-skeleton ktab-nav-skeleton--email" />
                  </div>
                ) : (
                  <div className="ktab-nav-skeleton ktab-nav-skeleton--collapsed-btn" />
                )}
              </div>
            ) : (
              <>
                {userMenuOpen && (
                  <div
                    className={`ktab-user-menu-popover ${
                      collapsed ? "ktab-user-menu-popover--collapsed" : ""
                    }`}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <div className="ktab-user-menu-header">
                      <div className="ktab-user-menu-header__details">
                        <div className="ktab-user-menu-header__top-row">
                          <span className="ktab-user-menu-header__name">{firstName}</span>
                          {roleLabel && (
                            <span className="ktab-user-menu-role-badge">{roleLabel}</span>
                          )}
                        </div>
                        <span className="ktab-user-menu-header__email">{sub}</span>
                      </div>
                    </div>
                    <div className="ktab-user-menu-divider" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="ktab-user-menu-item ktab-user-menu-item--danger"
                    >
                      <LogOut size={15} strokeWidth={2} />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}

                {!collapsed ? (
                  <div className="ktab-nav-profile">
                    <div className="ktab-nav-profile__info">
                      <span className="ktab-nav-profile__name">{firstName}</span>
                      <p className="ktab-nav-profile__email">{sub}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleUserMenu}
                      className="ktab-nav-profile__options-btn"
                      aria-label="خيارات الحساب"
                      title="خيارات الحساب"
                    >
                      <MoreVertical size={16} strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleUserMenu}
                    className="ktab-nav-profile ktab-nav-profile--collapsed"
                    title={`${firstName} - خيارات الحساب`}
                    aria-label="خيارات الحساب"
                  >
                    <MoreVertical size={17} strokeWidth={2} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
