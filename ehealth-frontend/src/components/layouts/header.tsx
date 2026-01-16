"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-auth";

interface HeaderProps {
  mobileNav?: React.ReactNode;
}

export function Header({ mobileNav }: HeaderProps) {
  const { data: user } = useCurrentUser();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-slate-950">
      <div className="flex items-center gap-4">
        {mobileNav}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Welcome back, {user?.firstName || "User"}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Bell className="h-5 w-5" />
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
