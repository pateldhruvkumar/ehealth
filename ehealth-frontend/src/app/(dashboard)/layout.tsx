import { Header } from "@/components/layouts/header";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { PatientSidebar } from "@/components/layouts/patient-sidebar";
import { ROUTES } from "@/lib/constants";
import {
  FileText,
  History,
  LayoutDashboard,
  Share2,
  Upload,
  User,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { title: "My Documents", href: ROUTES.DOCUMENTS, icon: FileText },
  { title: "Upload", href: ROUTES.UPLOAD_DOCUMENT, icon: Upload },
  { title: "Share Records", href: ROUTES.SHARE, icon: Share2 },
  { title: "Access Log", href: ROUTES.ACCESS_LOG, icon: History },
  { title: "Profile", href: ROUTES.PROFILE, icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <PatientSidebar />
      <div className="flex flex-1 flex-col">
        <Header mobileNav={<MobileNav items={navItems} type="patient" />} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
