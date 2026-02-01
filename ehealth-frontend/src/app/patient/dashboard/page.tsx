"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDocuments } from "@/hooks/use-documents";
import { usePatientDashboard } from "@/hooks/use-patient";
import { ROUTES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Plus,
  Share2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = usePatientDashboard();
  const { data: documentsData, isLoading: docsLoading } = useDocuments({
    limit: 5,
  });

  if (statsLoading || docsLoading) {
    return <DashboardSkeleton />;
  }

  const recentDocs = documentsData?.items || [];

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard">
        <Link href={ROUTES.UPLOAD_DOCUMENT}>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </Link>
        <Link href={ROUTES.SHARE}>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Records
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Documents"
          value={stats?.documentCount || 0}
          icon={FileText}
          description="Stored securely"
        />
        <StatsCard
          title="Recent Uploads"
          value={stats?.recentUploads.length || 0}
          icon={Upload}
          description="In the last 7 days"
        />
        <StatsCard
          title="Active Shares"
          value={stats?.activeShares || 0}
          icon={Share2}
          description="Doctors with access"
        />
        <StatsCard
          title="Account Status"
          value="Active"
          icon={ShieldCheck}
          className="text-green-600"
        />
      </div>

      {/* Recent Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Documents
          </h2>
          <Link
            href={ROUTES.DOCUMENTS}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View All
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload your first medical document to get started."
            actionLabel="Upload Document"
            onAction={() => (window.location.href = ROUTES.UPLOAD_DOCUMENT)}
          />
        ) : (
          <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.documentType.replace("_", " ")}</TableCell>
                    <TableCell>
                      {formatDate(doc.documentDate || doc.uploadedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`${ROUTES.DOCUMENTS}/${doc.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
