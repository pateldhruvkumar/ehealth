import { SignIn } from "@clerk/nextjs";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign in to your account
        </p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 w-full",
          },
        }}
        signUpUrl={ROUTES.REGISTER}
      />
    </div>
  );
}
