"use client";

import { UploadDropzone } from "@/components/documents/upload-dropzone";
import { UploadProgress } from "@/components/documents/upload-progress";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDocument, useUploadUrl } from "@/hooks/use-documents";
import { DOCUMENT_TYPES, ROUTES } from "@/lib/constants";
import { CreateDocumentInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  documentType: z.enum(DOCUMENT_TYPES),
  description: z.string().optional(),
  documentDate: z.string().optional(), // HTML date input returns string
  tags: z.string().optional(), // Comma separated string
});

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const getUploadUrl = useUploadUrl();
  const createDocument = useCreateDocument();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      documentDate: "",
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof uploadSchema>) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // 1. Get Presigned URL
      const { data: presignedData } = await getUploadUrl.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        documentType: values.documentType,
      });

      if (!presignedData?.url) throw new Error("Failed to get upload URL");

      // 2. Upload to S3
      await axios.put(presignedData.url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: progressEvent => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || file.size)
          );
          setUploadProgress(percent);
        },
      });

      // 3. Create Document Record
      const docInput: CreateDocumentInput = {
        title: values.title,
        description: values.description,
        documentType: values.documentType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        s3Key: presignedData.key,
        s3Url: presignedData.s3Url,
        documentDate: values.documentDate
          ? new Date(values.documentDate)
          : undefined,
        tags: values.tags
          ? values.tags
              .split(",")
              .map(t => t.trim())
              .filter(Boolean)
          : [],
      };

      await createDocument.mutateAsync(docInput);

      toast.success("Document uploaded successfully");
      router.push(ROUTES.DOCUMENTS);
    } catch (error: any) {
      console.error("Upload failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Upload failed. Please try again.";
      toast.error(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <PageHeader
        title="Upload Document"
        description="Upload a new medical record to your account."
      />

      <div className="space-y-6">
        <UploadDropzone
          selectedFile={file}
          onFileSelect={setFile}
          onClear={() => setFile(null)}
        />

        {isUploading && (
          <UploadProgress
            fileName={file?.name || ""}
            progress={uploadProgress}
            status={uploadProgress === 100 ? "success" : "uploading"}
          />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Blood Test Results" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DOCUMENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="documentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="cardio, checkup, lab" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
