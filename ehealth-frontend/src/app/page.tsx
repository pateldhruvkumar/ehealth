import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import {
  FileText,
  Lock,
  Share2,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <ShieldCheck className="h-6 w-6" />
            <span>E-Health Records</span>
          </div>
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

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center lg:py-32">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            Your Medical Records, <br className="hidden sm:block" />
            <span className="text-blue-600">Anywhere, Anytime.</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Securely store your X-rays, prescriptions, and lab reports. Share them
            instantly with doctors using temporary access links or QR codes.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={ROUTES.LOGIN}>
              <Button size="lg" className="h-12 px-8 text-base">
                <User className="mr-2 h-5 w-5" />
                I'm a Patient
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                I'm a Doctor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Why Choose E-Health Records?
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Built for patients who want control and doctors who need clarity.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-blue-600" />}
              title="Store Everything"
              description="Keep all your medical documents in one secure place. No more lost files."
            />
            <FeatureCard
              icon={<Lock className="h-8 w-8 text-blue-600" />}
              title="Bank-Level Security"
              description="Your data is encrypted and protected. Only you decide who sees what."
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8 text-blue-600" />}
              title="Easy Sharing"
              description="Share records via QR code or link. Perfect for emergencies or consultations."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-blue-600" />}
              title="Access Control"
              description="Set time limits on shared access. Revoke permissions instantly."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to take control of your health data?
          </h2>
          <p className="mb-8 text-blue-100">
            Join thousands of patients and doctors today.
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base font-semibold"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} E-Health Records. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-6 transition-shadow hover:shadow-md dark:bg-slate-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
