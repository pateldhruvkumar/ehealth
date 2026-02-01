import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header - Matching Home Page */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <ShieldCheck className="h-6 w-6" />
            <span>E-Health Records</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}

