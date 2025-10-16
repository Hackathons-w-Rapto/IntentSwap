"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Home, Settings, Menu, Trash2 } from "lucide-react";
import { GoSidebarCollapse } from "react-icons/go";
import ConnectWalletButton from "./ConnectWalletButton";
import { usePathname } from "next/navigation";

// Placeholder for chat list
function ChatList({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  // Replace with your chat logic
  const chats = [
    { id: "1", title: "Alice" },
    { id: "2", title: "Bob" },
  ];
  return (
    <div className="flex flex-col gap-1">
      {chats.map((chat) => {
        const isActive = pathname === `/chat/${chat.id}`;
        return (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors group bg-gradient-to-r ${
              isActive
                ? "from-[#1E3DFF] via-[#7A1EFF] to-[#FF1E99] text-white"
                : "hover:from-[#1E3DFF] hover:via-[#7A1EFF] hover:to-[#FF1E99] hover:bg-gradient-to-r"
            }`}
          >
            <MessageSquare
              className={`h-4 w-4 group-hover:text-foreground ${
                isActive ? "text-white" : "text-muted-foreground"
              }`}
            />
            {!isCollapsed && (
              <span
                className={`truncate text-sm ${
                  isActive ? "text-white font-semibold" : ""
                }`}
              >
                {chat.title}
              </span>
            )}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-5 w-5 text-muted-foreground hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default function ChatSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex fixed top-4 left-4 z-40 bg-white"
          aria-label="Expand sidebar"
          onClick={() => setCollapsed(false)}
        >
          <GoSidebarCollapse className="w-6 h-6" />
        </Button>
      )}
      {/* Mobile Sheet Sidebar */}
      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Link href="/" className="font-bold text-lg text-white">
                    IntentSwap
                  </Link>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close sidebar"
                    >
                      <GoSidebarCollapse className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                </div>
              </div>
              <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/chat"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </nav>
              <Separator />
              <div className="px-6 py-4 border-t border-border/40 flex items-center gap-3">
                <ConnectWalletButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-black text-white border-r border-border/40 shadow-lg transition-all duration-300 ${
          collapsed ? "w-0 min-w-0 overflow-hidden" : "w-64"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Link href="/" className="font-bold text-lg">
                IntentSwap
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Collapse sidebar"
                onClick={() => setCollapsed(true)}
              >
                <GoSidebarCollapse className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
        {/* Chat Section */}
        {!collapsed && (
          <>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div
                className={`px-4 pt-4 pb-2 text-xs font-medium  uppercase tracking-wider`}
              >
                Chats
              </div>
              <div className="px-2 flex-1 overflow-y-auto">
                <ChatList isCollapsed={collapsed} />
              </div>
            </div>
            <Separator />
            <div className="px-4 py-4 border-t border-border/40 flex items-center gap-3">
              <ConnectWalletButton />
            </div>
          </>
        )}
      </aside>
    </>
  );
}
