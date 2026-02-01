import { DoctorSidebar } from "@/components/layouts/doctor-sidebar";
import { Header } from "@/components/layouts/header";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { ROUTES } from "@/lib/constants";
import {
  ClipboardList,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: ROUTES.DOCTOR_DASHBOARD, icon: LayoutDashboard },
  { title: "My Patients", href: ROUTES.DOCTOR_PATIENTS, icon: Users },
  { title: "Consultations", href: ROUTES.DOCTOR_CONSULTATIONS, icon: ClipboardList },
  { title: "Profile", href: ROUTES.DOCTOR_PROFILE, icon: User },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <DoctorSidebar />
      <div className="flex flex-1 flex-col">
        <Header mobileNav={<MobileNav items={navItems} type="doctor" />} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
