"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Bell, User } from "lucide-react";

interface HeaderProps {
  mobileNav?: React.ReactNode;
}

export function Header({ mobileNav }: HeaderProps) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-slate-950">
      <div className="flex items-center gap-4">
        {mobileNav}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Welcome back, {user?.patient?.firstName || user?.doctor?.firstName || "User"}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.patient?.profileImage || user?.doctor?.profileImage} alt={user?.patient?.firstName || user?.doctor?.firstName} />
                <AvatarFallback>
                  {(user?.patient?.firstName || user?.doctor?.firstName)?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.patient?.firstName || user?.doctor?.firstName}{" "}
                  {user?.patient?.lastName || user?.doctor?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
