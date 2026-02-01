"use client";

import { DocumentCard } from "@/components/documents/document-card";
import { DocumentFiltersBar } from "@/components/documents/document-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/use-documents";
import { ROUTES } from "@/lib/constants";
import { DocumentFilters } from "@/types";
import { FileText, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFilters>({});
  const { data, isLoading } = useDocuments({ ...filters, limit: 100 }); // Pagination todo

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Documents"
        description="Manage your uploaded medical records."
      >
        <Link href={ROUTES.UPLOAD_DOCUMENT}>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </Link>
      </PageHeader>

      <DocumentFiltersBar onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description={
            Object.keys(filters).length
              ? "Try adjusting your filters"
              : "Upload your first document to see it here"
          }
          actionLabel={Object.keys(filters).length ? "Clear Filters" : "Upload"}
          onAction={
            Object.keys(filters).length
              ? () => setFilters({})
              : () => (window.location.href = ROUTES.UPLOAD_DOCUMENT)
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
