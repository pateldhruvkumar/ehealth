"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function DoctorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DoctorError]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-center text-slate-600 dark:text-slate-400">
        An unexpected error occurred. You can try to recover, or return to the dashboard.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-4 max-w-lg overflow-auto rounded-md bg-slate-100 p-4 text-xs dark:bg-slate-800">
          {error.message}
        </pre>
      )}
      <div className="mt-8 flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Link href={ROUTES.DOCTOR_DASHBOARD}>
          <Button variant="outline">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
