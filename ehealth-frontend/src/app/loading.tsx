import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <LoadingSpinner size="lg" />
    </div>
  );
}
