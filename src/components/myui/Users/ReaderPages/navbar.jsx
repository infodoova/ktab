import React, { useState } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FolderOpen,
  Star,
  Settings,
  SquareLibrary,
  Search,
  ArchiveIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../../../../store/authToken";
import ktabLogo from "../../../../assets/logo/logo.png";
import ktabLogo2 from "../../../../assets/logo/logo2.png";
const navLinks = [
  {
    label: "  الصفحة الرئيسية   ",
    icon: SquareLibrary,
    href: "../../../Screens/dashboard/ReaderPages/MainPage",
  },
  {
    label: "المكتبة ",
    icon: BookOpen,
    href: "../../../Screens/dashboard/ReaderPages/library",
  },
  {
    label: "  القصص التفاعلية  ",
    icon: FolderOpen,
    href: "../../../Screens/dashboard/ReaderPages/InteractiveStories",
  },
  {
    label: " الانجازات و الشارات   ",
    icon: ArchiveIcon,
    href: "../../../Screens/dashboard/ReaderPages/Achievements",
  },
  // {
  //   label: "  الملف الشخصي  ",
  //   icon: Star,
  //   href: "../../../Screens/dashboard/ReaderPages/Profile",
  // },
  {
    label: "   الاعدادات   ",
    icon: Settings,
    href: "../../../Screens/dashboard/ReaderPages/Settings",
  },
];

const SidebarContent = ({ collapsed, onToggle, isDark = false }) => {
  const navigate = useNavigate();
  const user = getUserData() || {};

  return (
    <div className={cn(
      "flex flex-col h-full rtl border-l transition-colors duration-300",
      isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"
    )}>
      {!collapsed ? (
        <div className={cn(
          "h-16 flex items-center justify-between px-8 border-b backdrop-blur-xl transition-colors",
          isDark ? "border-white/5 bg-black/40" : "border-black/5 bg-white/50"
        )}>
          <img
            src={isDark ? ktabLogo2 : ktabLogo}
            className={cn(
              "w-auto object-contain origin-right transition-all",
              isDark ? "h-10 scale-100" : "h-16 scale-150"
            )}
            alt=" Ktab Logo"
          />

          <button
            onClick={onToggle}
            className={cn(
              "h-9 w-9 rounded-2xl border transition-all flex items-center justify-center shadow-sm",
              isDark 
                ? "bg-white/5 border-white/10 text-white/50 hover:bg-[#5de3ba]/20 hover:text-[#5de3ba]" 
                : "bg-white border-black/5 text-black/50 hover:bg-[#5de3ba]/10 hover:text-[#5de3ba]"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className={cn(
          "h-16 flex items-center justify-center px-4 border-b backdrop-blur-xl transition-colors",
          isDark ? "border-white/5 bg-black/40" : "border-black/5 bg-white/50"
        )}>
          <button
            onClick={onToggle}
            className={cn(
              "h-9 w-9 rounded-2xl border transition-all flex items-center justify-center shadow-sm",
              isDark 
                ? "bg-white/5 border-white/10 text-white/50 hover:bg-[#5de3ba]/20 hover:text-[#5de3ba]" 
                : "bg-white border-black/5 text-black/50 hover:bg-[#5de3ba]/10 hover:text-[#5de3ba]"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}


      <ScrollArea className="flex-1 px-3 py-3">
        {navLinks.map((link, i) => {
          const Icon = link.icon;

          const item = (
            <button
              key={i}
              onClick={() => navigate(link.href)}
              className={cn(
                "group flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-black tracking-tight transition-all duration-300",
                isDark 
                  ? "text-white/40 hover:text-white hover:bg-white/5" 
                  : "text-black/70 hover:text-black hover:bg-black/5",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span>{link.label}</span>}
            </button>
          );

          return collapsed ? (
            <Tooltip key={i}>
              <TooltipTrigger asChild>{item}</TooltipTrigger>
              <TooltipContent side="left">{link.label}</TooltipContent>
            </Tooltip>
          ) : (
            item
          );
        })}
      </ScrollArea>

      <div
        dir="rtl"
        className={cn(
          "py-6 border-t flex px-6 items-center gap-4 backdrop-blur-xl transition-colors",
          isDark ? "border-white/5 bg-black/40" : "border-black/5 bg-white/50",
          collapsed && "flex-col justify-center gap-2 px-2",
        )}
      >
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
          isDark 
            ? "bg-white/10 text-white border border-white/10 shadow-[0_5px_15px_rgba(255,255,255,0.05)]"
            : "bg-gradient-to-br from-[#5de3ba] to-[#b6e8e1] text-black shadow-[0_5px_15px_rgba(93,227,186,0.1)]"
        )}>
          {user.firstName ? user.firstName[0] : "أ"}
        </div>

        {!collapsed && (
          <div className={cn(
            "flex flex-col justify-start min-w-0 transition-colors",
            isDark ? "text-white" : "text-black"
          )}>
            <span className="font-bold text-sm truncate">
              {user.firstName || "User"} {user.lastName || ""}{" "}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5de3ba]">
              قارئ
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = ({
  mobileButtonTitle,
  onMobileButtonPress,
  pageName,
  collapsed,
  setCollapsed,
  onSearchClick,
  isDark = false,
  showSearch = true,
}) => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  // Sync body background color with page theme to hide any animation scroll gaps
  React.useEffect(() => {
    const bgColor = isDark ? "#0a0a0a" : "#ffffff";
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.backgroundColor = bgColor;
  }, [isDark]);

  return (
    <>
      {/* MOBILE HEADER */}
      <header className={cn(
        "md:hidden fixed top-0 z-50 w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 backdrop-blur-2xl border-b rtl h-16 transition-colors",
        isDark ? "bg-black/80 border-white/5" : "bg-white/80 border-black/5"
      )}>
        {/* LEFT COLUMN (START) - Now includes Search Icon */}
        <div className="flex justify-start items-center gap-2">
          {/* SEARCH BUTTON (Moved to Left) */}
          {showSearch && (
            <button
              onClick={onSearchClick}
              aria-label="بحث"
              className={cn(
                "p-2 rounded-full h-10 w-10 transition-colors",
                isDark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-black hover:bg-[#5de3ba]/10"
              )}
            >
              <Search size={20} strokeWidth={2} />
            </button>
          )}

          {mobileButtonTitle && (
            <Button
              variant="outline"
              onClick={onMobileButtonPress}
              className={cn(
                "h-9 px-4",
                isDark ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-background/80"
              )}
            >
              {mobileButtonTitle}
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <h1 className={cn(
            "text-lg font-black tracking-tight",
            isDark ? "text-white" : "text-black"
          )}>
            {pageName}
          </h1>
        </div>

        {/* RIGHT COLUMN (END) - Menu only */}
        <div className="flex justify-end items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  "h-10 w-10 transition-colors",
                  isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/20" : "bg-white border-black/5"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className={cn(
                "w-64 p-0 rtl border-l [&>button]:hidden text-right transition-colors",
                isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5"
              )}
            >
              <div className="sr-only">
                <SheetTitle>القائمة الجانبية</SheetTitle>
                <SheetDescription>روابط التنقل في التطبيق</SheetDescription>
              </div>
              <SidebarContent
                collapsed={false}
                onToggle={() => setSheetOpen(false)}
                isDark={isDark}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="md:hidden h-16 w-full" />

      {/* DESKTOP SIDEBAR */}
      <aside
        style={{ right: 0, left: "auto" }}
        className={cn(
          "hidden md:flex h-screen border-l flex-col rtl transition-all duration-300 fixed top-0 z-[100]",
          isDark ? "bg-[#0a0a0a] border-white/5" : "bg-white border-black/5",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          isDark={isDark}
        />
      </aside>
    </>
  );
};

export default Navbar;
