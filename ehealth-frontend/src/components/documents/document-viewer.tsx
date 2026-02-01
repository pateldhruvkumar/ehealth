import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface DocumentViewerProps {
  url: string | null;
  mimeType: string;
  onDownload: () => void;
}

export function DocumentViewer({
  url,
  mimeType,
  onDownload,
}: DocumentViewerProps) {
  if (!url) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border bg-slate-100 dark:bg-slate-900">
        <p className="text-muted-foreground">Document URL not available</p>
      </div>
    );
  }

  const isImage = mimeType.startsWith("image/");
  const isPdf = mimeType === "application/pdf";

  if (isImage) {
    return (
      <div className="flex h-96 items-center justify-center overflow-hidden rounded-lg border bg-slate-100 dark:bg-slate-900">
        <img
          src={url}
          alt="Document preview"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <iframe
        src={`${url}#toolbar=0`}
        className="h-[600px] w-full rounded-lg border bg-white"
        title="PDF Preview"
      />
    );
  }

  return (
    <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
        <FileText className="h-8 w-8 text-slate-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">Preview not available</p>
        <p className="text-sm text-slate-500">
          This file type ({mimeType}) cannot be previewed.
        </p>
      </div>
      <Button onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download File
      </Button>
    </div>
  );
}
