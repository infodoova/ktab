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
const user = getUserData();
const navLinks = [

  { label: "  الصفحة الرئيسية   ", icon: SquareLibrary, href: "../../../Screens/dashboard/ReaderPages/MainPage" },
    { label: "المكتبة ", icon: BookOpen, href: "../../../Screens/dashboard/ReaderPages/library" },
  { label: "  القصص التفاعلية  ", icon: FolderOpen, href: "../../../Screens/dashboard/ReaderPages/InteractiveStories" },
 
  { label: "   الملف الشخصي   ", icon: Star, href: "../../../Screens/dashboard/ReaderPages/Profile" },
  { label: "   الاعدادات   ", icon: Settings, href: "../../../Screens/dashboard/ReaderPages/Settings" },
];


const SidebarContent = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full rtl bg-[#f7f4ef] border-l border-[var(--earth-sand)]/40">

      {!collapsed ? (
             <div className="h-16 flex items-center justify-center px-4 border-b">

          <img src={ktabLogo} className="h-30 w-auto object-contain" alt="Logo" />

          <button
            onClick={onToggle}
            className="h-9 w-9 rounded-full bg-[var(--earth-paper)] hover:bg-[var(--earth-sand)]/40 shadow flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-[var(--earth-brown)]" />
          </button>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center px-4 border-b">

          <button
            onClick={onToggle}
            className="h-9 w-9 rounded-full bg-[var(--earth-paper)] hover:bg-[var(--earth-sand)]/40 shadow flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5 text-[var(--earth-brown)]" />
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
                "group flex w-full items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200",
                "text-[var(--earth-brown)]/70 hover:text-[var(--earth-brown)]",
                "hover:bg-[var(--earth-paper)] hover:shadow-sm",
                collapsed && "justify-center px-2"
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


 <div dir="rtl"
        className={cn(
          "h-20 border-t border-[var(--earth-sand)]/40 flex px-4 items-center gap-3",
          collapsed && "flex-col justify-center gap-1"
        )}
      >
        <div className="h-11 w-11 rounded-full bg-[var(--earth-olive)]/30 border border-[var(--earth-brown)]/20 text-[var(--earth-brown)] flex items-center justify-center font-bold text-lg">
          {user.firstName ? user.firstName[0] : 'أ'}
        </div>

        {!collapsed && (
          <div className="flex flex-col text-[var(--earth-brown)] justify-start ">
            <span className="font-semibold text-sm">{user.firstName || 'User'} {user.lastName || ''} </span>
            <span className="text-xs opacity-70">قارئ</span>
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
      {/* ADDED fixed top-0 z-50 w-full */}
      <header className="md:hidden fixed top-0 z-50 w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 bg-[#f7f4ef] border-b rtl h-16">
        
        {/* LEFT COLUMN (START) - Now includes Search Icon */}
        <div className="flex justify-start items-center gap-2">
          
          {/* SEARCH BUTTON (Moved to Left) */}
          <button
            onClick={onSearchClick}
            aria-label="بحث"
            className="
              p-2 rounded-full h-10 w-10 
              text-[var(--earth-brown)] 
              hover:bg-[var(--earth-brown)]/10 
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
          <h1 className="text-lg font-bold text-[var(--earth-brown)]">
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
              className="w-64 p-0 rtl bg-[#f7f4ef] [&>button]:hidden"
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
          "hidden md:flex h-screen bg-[#f7f4ef] border-l border-[var(--earth-sand)]/40 flex-col rtl transition-all duration-300 fixed top-0",
          collapsed ? "w-20" : "w-64"
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