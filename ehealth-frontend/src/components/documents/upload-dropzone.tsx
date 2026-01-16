import { cn, formatFileSize } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone"; // Need to install this, or build custom. I'll build custom simple one or check deps.
// Deps check: 'react-dropzone' wasn't in list. I'll implement a simple drag-n-drop using standard events or suggest installing.
// I'll implement a simple one without extra deps to keep it lightweight as requested "Drag and drop zone".

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function UploadDropzone({
  onFileSelect,
  selectedFile,
  onClear,
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="relative flex items-center justify-between rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm text-slate-900 dark:text-slate-50">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800",
        isDragOver && "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
      )}
    >
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="mb-4 h-10 w-10 text-slate-400" />
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PDF, PNG, JPG, JPEG (MAX. 10MB)
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
      </label>
    </div>
  );
}
