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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <PatientSidebar />
      <div className="flex flex-1 flex-col">
        <Header 
          mobileNav={
            <MobileNav 
              items={[
                { title: "Dashboard", href: ROUTES.DASHBOARD, iconName: "LayoutDashboard" },
                { title: "My Documents", href: ROUTES.DOCUMENTS, iconName: "FileText" },
                { title: "Upload", href: ROUTES.UPLOAD_DOCUMENT, iconName: "Upload" },
                { title: "Share Records", href: ROUTES.SHARE, iconName: "Share2" },
                { title: "Access Log", href: ROUTES.ACCESS_LOG, iconName: "History" },
                { title: "Profile", href: ROUTES.PROFILE, iconName: "User" },
              ]} 
              type="patient" 
            />
          } 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

