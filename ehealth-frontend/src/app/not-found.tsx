import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <FileQuestion className="h-12 w-12 text-slate-500" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Page Not Found
      </h1>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/" className="mt-8">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
