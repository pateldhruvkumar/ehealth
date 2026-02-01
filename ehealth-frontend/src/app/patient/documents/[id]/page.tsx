"use client";

import { DocumentViewer } from "@/components/documents/document-viewer";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorMessage } from "@/components/shared/error-message";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDeleteDocument, useDocument, useDownloadUrl } from "@/hooks/use-documents";
import { ROUTES } from "@/lib/constants";
import { formatDateTime, formatFileSize } from "@/lib/utils";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function DocumentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: document, isLoading, error } = useDocument(id);
  const { data: downloadData } = useDownloadUrl(id);
  const deleteDocument = useDeleteDocument();

  const handleDelete = async () => {
    await deleteDocument.mutateAsync(id);
    router.push(ROUTES.DOCUMENTS);
  };

  const handleDownload = () => {
    if (downloadData?.url) {
      window.open(downloadData.url, "_blank");
    }
  };

  if (isLoading) return <LoadingSpinner className="h-96" />;
  if (error || !document)
    return (
      <ErrorMessage
        title="Document not found"
        message="The document you are looking for does not exist or you do not have permission to view it."
        onRetry={() => router.push(ROUTES.DOCUMENTS)}
      />
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.DOCUMENTS}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader title={document.title} className="mb-0" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DocumentViewer
            url={downloadData?.url || null}
            mimeType={document.mimeType}
            onDownload={handleDownload}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-500">Type</span>
                <p>{document.documentType.replace("_", " ")}</p>
              </div>
              <Separator />
              <div>
                <span className="text-sm font-medium text-slate-500">
                  Uploaded
                </span>
                <p>{formatDateTime(document.uploadedAt)}</p>
              </div>
              <Separator />
              <div>
                <span className="text-sm font-medium text-slate-500">
                  Document Date
                </span>
                <p>{formatDateTime(document.documentDate || document.uploadedAt)}</p>
              </div>
              <Separator />
              <div>
                <span className="text-sm font-medium text-slate-500">Size</span>
                <p>{formatFileSize(document.fileSize)}</p>
              </div>
              {document.description && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium text-slate-500">
                      Description
                    </span>
                    <p className="text-sm">{document.description}</p>
                  </div>
                </>
              )}
              {document.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-500">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={handleDownload}
                disabled={!downloadData}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
