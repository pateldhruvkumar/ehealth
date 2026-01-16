"use client";

import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import {
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Share2,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const items = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "My Documents",
    href: ROUTES.DOCUMENTS,
    icon: FileText,
  },
  {
    title: "Upload",
    href: ROUTES.UPLOAD_DOCUMENT,
    icon: Upload,
  },
  {
    title: "Share Records",
    href: ROUTES.SHARE,
    icon: Share2,
  },
  {
    title: "Access Log",
    href: ROUTES.ACCESS_LOG,
    icon: History,
  },
  {
    title: "Profile",
    href: ROUTES.PROFILE,
    icon: User,
  },
];

export function PatientSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <div className="hidden h-screen w-64 flex-col border-r bg-white dark:bg-slate-950 md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-bold text-blue-600">
        <ShieldCheck className="h-6 w-6" />
        <span>E-Health</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {items.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                <item.icon className="h-4 w-4" />
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
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
