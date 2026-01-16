"use client";

import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/constants";
import { useState } from "react";

// Duplicate items definition for now or move to constants if reused widely.
// Patient Items
const patientItems = [
  { title: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { title: "My Documents", href: ROUTES.DOCUMENTS, icon: FileText },
  { title: "Upload", href: ROUTES.UPLOAD_DOCUMENT, icon: Upload },
  { title: "Share Records", href: ROUTES.SHARE, icon: Share2 },
  { title: "Access Log", href: ROUTES.ACCESS_LOG, icon: History },
  { title: "Profile", href: ROUTES.PROFILE, icon: User },
];

interface MobileSidebarProps {
  type: "patient" | "doctor";
}

export function MobileSidebar({ type }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  // We could fetch role to determine items, but passed as prop for simplicity in layout usage
  // Actually, standard sidebar separates patient/doctor.
  // I'll just use the patient items here for now as the doctor layout uses a different sidebar component.
  // To make this fully generic, I'd need to refactor.
  // I will make it specific to the current context or reuse the list from the respective sidebar file if exported.
  // Since I didn't export them, I'll redefine or just focus on patient for this component as it's used in Header which is shared?
  // Wait, Header is shared. So Header needs to know which menu to show.
  // Or simpler: The Layouts (PatientLayout, DoctorLayout) should pass the mobile menu content to Header?
  // Or Header contains the mobile trigger which opens a Sheet containing the correct Sidebar.
  
  // Let's create a standalone MobileSidebar component that takes items as props.
  // But wait, the Header is currently shared and doesn't take props.
  // Refactor: I'll update Header to accept children or just put the mobile trigger in the Layouts instead of Header.
  // Putting it in Header is standard.
  
  // Quick fix: Update Header to optionally render mobile menu if I pass it, or just handle it in the layout.
  // Better: Create `src/components/layouts/mobile-nav.tsx` and use it in `src/app/(dashboard)/layout.tsx` and `src/app/(doctor)/layout.tsx`.
  return null;
}
