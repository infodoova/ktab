import React, { useState } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FolderOpen,
  MousePointerClick,
  Bot,
  Star,
  BookCopyIcon,
  Settings,
  SquareLibrary,
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
    label: " لوحة التحكم",
    icon: BookOpen,
    href: "../../../Screens/dashboard/AuthorPages/controlBoard",
  },
  {
    label: " كتبي ",
    icon: SquareLibrary,
    href: "../../../Screens/dashboard/AuthorPages/myBooks",
  },
  {
    label: " قصصي التغاعلية   ",
    icon: BookCopyIcon,
    href: "../../../Screens/dashboard/AuthorPages/mystories",
  },

  {
    label: "رفع كتاب جديد",
    icon: FolderOpen,
    href: "../../../Screens/dashboard/AuthorPages/newBookPublish",
  },
  {
    label: " قصة تفاعلية جديدة ",
    icon: MousePointerClick,
    href: "../../../Screens/dashboard/AuthorPages/NewInteractiveStory",
  },
  {
    label: "   ادوات الذكاء الاصطناعي ",
    icon: Bot,
    href: "../../../Screens/dashboard/AuthorPages/aiTools",
  },
  // {
  //   label: "  التقييمات  ",
  //   icon: Star,
  //   href: "../../../Screens/dashboard/AuthorPages/ratings",
  // },
  {
    label: "   الاعدادات   ",
    icon: Settings,
    href: "../../../Screens/dashboard/AuthorPages/Settings",
  },
];

const SidebarContent = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  const userData = getUserData() || {};

  return (
    <div className="flex flex-col h-full rtl bg-white border-l border-black/5">
      {!collapsed ? (
        <div className="h-16 flex items-center justify-between px-8 border-b border-black/5 bg-white/50 backdrop-blur-xl">
          <img
            src={ktabLogo}
            className="h-16 w-auto object-contain scale-150 origin-right"
            alt="Logo"
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
          {userData.firstName ? userData.firstName[0] : "أ"}
        </div>

        {!collapsed && (
          <div className="flex flex-col text-black justify-start min-w-0 ">
            <span className="font-bold text-sm truncate">
              {userData.firstName || "User"} {userData.lastName || ""}{" "}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5de3ba]">مؤلف</span>
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
}) => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  // Sync body background color to white for author pages
  React.useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    document.documentElement.style.backgroundColor = "#ffffff";
  }, []);

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 z-[100] w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 bg-white/80 backdrop-blur-2xl border-b border-black/5 rtl h-16">
        <div className="flex justify-start">
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

        <div className="flex justify-end">
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
