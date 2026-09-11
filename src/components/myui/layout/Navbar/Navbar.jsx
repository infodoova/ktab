import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, User as UserIcon, Search } from "lucide-react";
import { getNavItemsByRole } from "@/core/routes/navigation";
import { useAuthStore } from "@/core/store/authStore";

// Brand Logo Imports
import logoImg from "@/assets/logo/logo.png";
import logoDarkImg from "@/assets/logo/logo2.png";
import "./Navbar.css";

/**
 * Global App Navbar Component
 */
export function Navbar({
  collapsed = false,
  setCollapsed,
  isDark = true,
  showSearch = true,
  onSearchClick,
  searchQuery,
  onSearchChange,
  navLinks,
  pageName,
}) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user) || {};
  const role = user?.role || "AUTHOR";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internalMobileSearchOpen, setInternalMobileSearchOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const mobileSearchInputRef = useRef(null);

  const query = searchQuery !== undefined ? searchQuery : internalSearchQuery;
  const mobileSearchOpen = internalMobileSearchOpen || Boolean(query);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  const handleMobileSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      setInternalMobileSearchOpen(true);
    }
  };

  const handleCloseMobileSearch = (e) => {
    e?.stopPropagation?.();
    setInternalMobileSearchOpen(false);
    setInternalSearchQuery("");
    onSearchChange?.("");
  };

  const handleQueryChange = (val) => {
    setInternalSearchQuery(val);
    onSearchChange?.(val);
  };

  // Compute active navigation items based on passed links or user role
  const links = navLinks || getNavItemsByRole(role);

  const isLinkActive = (path) => {
    if (path === "/reader/home" || path === "/author/control") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const logo = isDark ? logoDarkImg : logoImg;
  const themeMobileClass = isDark ? "ktab-navbar-mobile--dark" : "ktab-navbar-mobile--light";
  const themeDesktopClass = isDark ? "ktab-navbar-desktop--dark" : "ktab-navbar-desktop--light";
  const collapseDesktopClass = collapsed ? "ktab-navbar-desktop--collapsed" : "ktab-navbar-desktop--expanded";

  return (
    <>
      {/* ============================================================ */}
      {/* 📱 MOBILE HEADER BAR                                         */}
      {/* ============================================================ */}
      <header dir="rtl" className={`ktab-navbar-mobile ${themeMobileClass}`}>
        {mobileSearchOpen ? (
          <div className="ktab-navbar-mobile__search-wrapper">
            <div className="ktab-navbar-mobile__search-input-box">
              <Search size={17} style={{ color: "#94a3b8", flexShrink: 0 }} />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                className="ktab-navbar-mobile__search-input"
              />
            </div>
            <button
              type="button"
              onClick={handleCloseMobileSearch}
              className="ktab-navbar-mobile__icon-btn"
              aria-label="إغلاق البحث"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="ktab-navbar-mobile__left">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="ktab-navbar-mobile__icon-btn"
                aria-label="فتح القائمة"
              >
                <Menu size={19} />
              </button>
              <span className="ktab-navbar-mobile__title">{pageName || "كِتَاب"}</span>
            </div>

            <div className="ktab-navbar-mobile__right">
              {showSearch && (
                <button
                  type="button"
                  onClick={handleMobileSearchClick}
                  className="ktab-navbar-mobile__icon-btn"
                  aria-label="البحث"
                >
                  <Search size={17} />
                </button>
              )}
              <img src={logo} alt="Ktab Logo" className="ktab-navbar-mobile__logo" />
            </div>
          </>
        )}
      </header>

      {/* ============================================================ */}
      {/* 📱 MOBILE DRAWER OVERLAY                                     */}
      {/* ============================================================ */}
      {mobileOpen && (
        <div className="ktab-drawer-overlay" onClick={() => setMobileOpen(false)}>
          <aside
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="ktab-drawer-aside"
          >
            <div>
              {/* Header inside drawer */}
              <div className="ktab-drawer-header">
                <img src={logo} alt="Ktab Logo" style={{ height: "2.5rem", width: "auto", objectFit: "contain" }} />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="ktab-drawer-close-btn"
                  aria-label="إغلاق القائمة"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="ktab-drawer-nav">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = isLinkActive(link.path);

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`ktab-nav-link-mobile ${
                        active ? "ktab-nav-link-mobile--active" : "ktab-nav-link-mobile--inactive"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Profile Summary */}
            <div className="ktab-drawer-footer">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="ktab-avatar-badge">
                  <UserIcon size={16} />
                </div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, margin: 0, color: "var(--brand-white)" }}>
                    {user?.fullName || "المؤلف"}
                  </p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500, margin: 0 }}>
                    {user?.email || "حساب المؤلف"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ============================================================ */}
      {/* 💻 DESKTOP SIDEBAR                                           */}
      {/* ============================================================ */}
      <aside
        dir="rtl"
        className={`ktab-navbar-desktop ${collapseDesktopClass} ${themeDesktopClass}`}
      >
        <div>
          {/* Logo Brand Area */}
          <div className="ktab-navbar-desktop__brand-row">
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
              <img
                src={logo}
                alt="Ktab Logo"
                style={{
                  transition: "all 0.3s ease",
                  objectFit: "contain",
                  height: collapsed ? "2rem" : "2.5rem",
                  width: collapsed ? "2rem" : "auto",
                  maxWidth: "130px",
                }}
              />
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="ktab-navbar-desktop__collapse-toggle"
              aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
              title={collapsed ? "توسيع" : "طي"}
            >
              <ChevronRight
                size={16}
                style={{
                  transition: "transform 0.3s ease",
                  transform: collapsed ? "rotate(180deg)" : "none",
                  color: collapsed ? "var(--brand-teal)" : "inherit",
                }}
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="ktab-navbar-desktop__nav">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={collapsed ? link.label : undefined}
                  className={`ktab-nav-link-desktop ${
                    active ? "ktab-nav-link-desktop--active" : "ktab-nav-link-desktop--inactive"
                  } ${collapsed ? "ktab-nav-link-desktop--collapsed" : ""}`}
                >
                  <Icon
                    size={19}
                    style={{
                      flexShrink: 0,
                      strokeWidth: active ? 2.5 : 2,
                    }}
                  />
                  {!collapsed && (
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {link.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="ktab-navbar-desktop__profile-area">
          {!collapsed ? (
            <div className="ktab-navbar-desktop__profile-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                <div className="ktab-avatar-badge">
                  <UserIcon size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.fullName || "المؤلف"}
                  </p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.email || "حساب المؤلف"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", padding: "0.25rem 0" }}>
              <div className="ktab-avatar-badge" title={user?.fullName || "المؤلف"}>
                <UserIcon size={16} />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
