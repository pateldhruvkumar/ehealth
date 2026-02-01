"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-auth";
import {
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Share2,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ICONS = {
  LayoutDashboard,
  FileText,
  Upload,
  Share2,
  History,
  User,
};

interface NavItem {
  title: string;
  href: string;
  iconName: keyof typeof ICONS;
}

interface MobileNavProps {
  items: NavItem[];
  type: "patient" | "doctor";
}

export function MobileNav({ items, type }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6 font-bold text-lg">
            <ShieldCheck className={cn("mr-2 h-6 w-6", type === "doctor" ? "text-green-600" : "text-blue-600")} />
            <span className={type === "doctor" ? "text-green-600" : "text-blue-600"}>
              {type === "doctor" ? "E-Health Doc" : "E-Health"}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="grid gap-1 px-2">
              {items.map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = ICONS[item.iconName];
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                      isActive
                        ? type === "doctor"
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-500 hover:text-red-600 dark:text-slate-400"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
