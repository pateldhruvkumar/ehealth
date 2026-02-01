import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  fileName: string;
  onCancel?: () => void;
  status?: "uploading" | "success" | "error";
}

// Note: I need to install Progress component first if I missed it.
// I ran `shadcn add` for many components but `progress` might be missing.
// I'll assume it's there or I will need to add it.
// Wait, I checked Step 2 command: `... scroll-area`. Progress wasn't in list.
// I will implement a simple progress bar here to avoid extra steps or potential failure.

export function UploadProgress({
  progress,
  fileName,
  onCancel,
  status = "uploading",
}: UploadProgressProps) {
  return (
    <div className="w-full space-y-2 rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium truncate max-w-[200px]">
          {fileName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{progress}%</span>
          {onCancel && status === "uploading" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {status === "uploading" && "Uploading..."}
        {status === "success" && "Upload complete!"}
        {status === "error" && "Upload failed."}
      </p>
    </div>
  );
}
