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
  Settings,
  SquareLibrary
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

import ktabLogo from "../../../../assets/logo/logo.png";

const navLinks = [
  { label: " لوحة التحكم", icon: BookOpen, href: "../../../Screens/dashboard/AuthorPages/controlBoard" },
  { label: " كتبي ", icon: SquareLibrary, href: "../../../Screens/dashboard/AuthorPages/myBooks" },
  { label: "رفع كتاب جديد", icon: FolderOpen, href: "../../../Screens/dashboard/AuthorPages/newBookPublish" },
  { label: " قصة تفاعلية جديدة ", icon: MousePointerClick, href: "../../../Screens/dashboard/AuthorPages/NewInteractiveStory" },
  { label: "   ادوات الزكاء الاصطناعي ", icon: Bot, href: "../../../Screens/dashboard/AuthorPages/aiTools" },
  { label: "   التقييمات   ", icon: Star, href: "../../../Screens/dashboard/AuthorPages/ratings" },
  { label: "   الاعدادات   ", icon: Settings, href: "../../../Screens/dashboard/AuthorPages/Settings" },
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


      <div
        className={cn(
          "h-20 border-t border-[var(--earth-sand)]/40 flex px-4 items-center gap-3",
          collapsed && "flex-col justify-center gap-1"
        )}
      >
        <div className="h-11 w-11 rounded-full bg-[var(--earth-olive)]/30 border border-[var(--earth-brown)]/20 text-[var(--earth-brown)] flex items-center justify-center font-bold text-lg">
          أ
        </div>

        {!collapsed && (
          <div className="flex flex-col text-[var(--earth-brown)] ">
            <span className="font-semibold text-sm">أحمد علي</span>
            <span className="text-xs opacity-70">مؤلف</span>
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

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 bg-[#f7f4ef] border-b rtl h-16">
        <div className="flex justify-start">
          {mobileButtonTitle ? (
            <Button
              variant="outline"
              onClick={onMobileButtonPress}
              className="h-9 px-4 bg-background/80"
            >
              {mobileButtonTitle}
            </Button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        <div className="flex justify-center">
          <h1 className="text-lg font-bold text-[var(--earth-brown)]">
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
