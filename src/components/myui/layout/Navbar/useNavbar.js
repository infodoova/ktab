import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNavItemsByRole } from "@/core/routes/navigation";
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

  // Freeze body scrolling & touch interactions when mobile nav drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
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

  const handleToggleCollapse = () => {
    setCollapsed?.(!collapsed);
    setUserMenuOpen(false);
  };

  const handleToggleUserMenu = (e) => {
    e?.stopPropagation?.();
    setUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate("/login");
  };

  // Nav links: use explicit override or role-based links
  const links = navLinks || getNavItemsByRole(role);

  const isLinkActive = (path) => {
    if (path === "/reader/home" || path === "/author/control") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const logo = isDark ? logoDarkImg : logoImg;

  const firstName = user?.firstName || user?.fullName || "";
  const roleLabel =
    user?.role === "AUTHOR"
      ? "مؤلف"
      : user?.role === "READER"
      ? "قارئ"
      : user?.role || "";
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
