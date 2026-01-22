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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../../../../store/authToken";
import ktabLogo from "../../../../assets/logo/logo.png";
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
  {
    label: "   الملف الشخصي   ",
    icon: Star,
    href: "../../../Screens/dashboard/ReaderPages/Profile",
  },
  {
    label: "   الاعدادات   ",
    icon: Settings,
    href: "../../../Screens/dashboard/ReaderPages/Settings",
  },
];

const SidebarContent = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const user = getUserData() || {};

  return (
    <div className="flex flex-col h-full rtl bg-white border-l border-black/5">
      {!collapsed ? (
        <div className="h-16 flex items-center justify-between px-8 border-b border-black/5 bg-white/50 backdrop-blur-xl">
          <img
            src={ktabLogo}
            className="h-16 w-auto object-contain scale-150 origin-right"
            alt=" Ktab Logo"
          />

          <button
            onClick={onToggle}
            className="h-9 w-9 rounded-2xl bg-white border border-black/5 hover:bg-[#5de3ba]/10 hover:text-[#5de3ba] transition-all flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="h-5 w-5 text-black/50" />
          </button>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center px-4 border-b border-black/5 bg-white/50 backdrop-blur-xl">
          <button
            onClick={onToggle}
            className="h-9 w-9 rounded-2xl bg-white border border-black/5 hover:bg-[#5de3ba]/10 hover:text-[#5de3ba] transition-all flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="h-5 w-5 text-black/50" />
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
                "text-black/70 hover:text-black hover:bg-black/5",
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
          "py-6 border-t border-black/5 flex px-6 items-center gap-4 bg-white/50 backdrop-blur-xl",
          collapsed && "flex-col justify-center gap-2 px-2",
        )}
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5de3ba] to-[#b6e8e1] text-black flex items-center justify-center font-black text-sm shadow-[0_5px_15px_rgba(93,227,186,0.1)]">
          {user.firstName ? user.firstName[0] : "أ"}
        </div>

        {!collapsed && (
          <div className="flex flex-col text-black justify-start min-w-0">
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
  onSearchClick, // Prop used to open the modal
}) => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 z-50 w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 bg-white/80 backdrop-blur-2xl border-b border-black/5 rtl h-16">
        {/* LEFT COLUMN (START) - Now includes Search Icon */}
        <div className="flex justify-start items-center gap-2">
          {/* SEARCH BUTTON (Moved to Left) */}
          <button
            onClick={onSearchClick}
            aria-label="بحث"
            className="
              p-2 rounded-full h-10 w-10 
              text-black 
              hover:bg-[#5de3ba]/10 
              transition-colors
            "
          >
            <Search size={20} strokeWidth={2} />
          </button>

          {mobileButtonTitle && (
            <Button
              variant="outline"
              onClick={onMobileButtonPress}
              className="h-9 px-4 bg-background/80"
            >
              {mobileButtonTitle}
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <h1 className="text-lg font-black text-black tracking-tight">
            {pageName}
          </h1>
        </div>

        {/* RIGHT COLUMN (END) - Menu only */}
        <div className="flex justify-end items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-64 p-0 rtl bg-white border-l border-black/5 [&>button]:hidden"
            >
              <SidebarContent
                collapsed={false}
                onToggle={() => setSheetOpen(false)}
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
          "hidden md:flex h-screen bg-white border-l border-black/5 flex-col rtl transition-all duration-300 fixed top-0 z-[100]",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </aside>
    </>
  );
};

export default Navbar;
