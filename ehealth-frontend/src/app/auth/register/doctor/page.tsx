import Link from "next/link";
import { OnboardingDoctorForm } from "@/components/forms/onboarding-doctor-form";
import { ROUTES } from "@/lib/constants";

export default function RegisterDoctorPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Doctor Registration</h1>
        <p className="text-sm text-muted-foreground">
          Create your doctor account
        </p>
      </div>
      <OnboardingDoctorForm />
      <div className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
