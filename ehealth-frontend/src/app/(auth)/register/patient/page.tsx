import { SignUp } from "@clerk/nextjs";
import { ROUTES } from "@/lib/constants";

export default function RegisterPatientPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Patient Registration
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Create your patient account
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 w-full",
          },
        }}
        unsafeMetadata={{ role: "PATIENT" }}
        signInUrl={ROUTES.LOGIN}
        fallbackRedirectUrl={ROUTES.DASHBOARD}
      />
    </div>
  );
}
