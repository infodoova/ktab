import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNavItemsByRole } from "@/core/routes/navigation";
import { getRoleLabel } from "@/core/constants/roles";
import { useAuthStore } from "@/core/store/authStore";
import logoImg from "@/assets/logo/logo.png";
import logoDarkImg from "@/assets/logo/logo2.png";
import brandIconImg from "@/assets/logo/BrandIcon.png";

/**
 * Custom hook encapsulating all navigation, drawer, user menu, and search state for Navbar.
 */
export function useNavbar({
  collapsed = false,
  setCollapsed,
  isDark = false,
  onSearchClick,
  searchQuery,
  onSearchChange,
  navLinks,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) || {};
  const logout = useAuthStore((state) => state.logout);
  const role = user?.role || "AUTHOR";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [internalMobileSearchOpen, setInternalMobileSearchOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const mobileSearchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  const query = searchQuery !== undefined ? searchQuery : internalSearchQuery;
  const mobileSearchOpen = internalMobileSearchOpen || Boolean(query);

  useEffect(() => {
    if (mobileSearchOpen) {
      const timer = setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [mobileSearchOpen]);

  // Close mobile drawer & user menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // CSS hides the drawer at this breakpoint, so rotation must release its scroll lock too.
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeDesktopDrawer = () => {
      if (desktopQuery.matches) setMobileOpen(false);
    };
    closeDesktopDrawer();
    desktopQuery.addEventListener("change", closeDesktopDrawer);
    return () => desktopQuery.removeEventListener("change", closeDesktopDrawer);
  }, [mobileOpen]);

  // Lock the page while allowing native touch scrolling inside the drawer.
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Click outside listener for user menu popover
  useEffect(() => {
    function handleClickOutside(event) {
      // Ignore clicks inside user popover or the menu trigger buttons
      if (
        event.target.closest(".ktab-user-menu-popover") ||
        event.target.closest(".ktab-nav-profile__options-btn") ||
        event.target.closest(".ktab-nav-profile--collapsed")
      ) {
        return;
      }
      setUserMenuOpen(false);
    }

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleMobileSearchClick = () => {
    setInternalMobileSearchOpen(true);
    onSearchClick?.();
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

  const handleToggleCollapse = () => {
    setCollapsed?.(!collapsed);
    setUserMenuOpen(false);
  };

  const handleToggleUserMenu = (e) => {
    e?.stopPropagation?.();
    setUserMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  // Nav links: use explicit override or role-based links
  const links = navLinks || getNavItemsByRole(role);

  const isLinkActive = (path) => {
    if (
      path === "/reader/home" ||
      path === "/author/control" ||
      path === "/admin/dashboard" ||
      path === "/library-admin/dashboard" ||
      path === "/librarian/dashboard"
    ) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (path) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !(prev[path] ?? true),
    }));
  };

  const isMenuOpen = (link) => {
    if (!link.subItems) return false;
    if (expandedMenus[link.path] !== undefined) {
      return expandedMenus[link.path];
    }
    return link.subItems.some(
      (s) => location.pathname === s.path || location.pathname.startsWith(s.path)
    );
  };

  const isSubItemActive = (subPath) => {
    if (subPath === "/reader/library") {
      return location.pathname === "/reader/library";
    }
    return location.pathname === subPath || location.pathname.startsWith(subPath);
  };

  const logo = isDark ? logoDarkImg : logoImg;

  const firstName =
    user?.name ||
    user?.fullName ||
    user?.displayName ||
    (user?.firstName ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` : "") ||
    "";
  const roleLabel = getRoleLabel(user?.role);
  const sub = user?.sub || user?.email || "";
  const initial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const isUserLoaded = Boolean(user && (firstName || sub));

  return {
    user,
    role,
    firstName,
    roleLabel,
    sub,
    initial,
    isUserLoaded,
    links,
    isLinkActive,
    isSubItemActive,
    toggleMenu,
    isMenuOpen,
    logo,
    brandIcon: brandIconImg,
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
  };
}

export default useNavbar;
