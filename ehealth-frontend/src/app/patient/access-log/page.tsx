"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccessLog } from "@/hooks/use-sharing";
import { formatDateTime } from "@/lib/utils";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { useState } from "react";

export default function AccessLogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAccessLog(page, 10);

  if (isLoading) return <LoadingSpinner className="h-96" />;

  const logs = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Access Log"
        description="View history of who accessed your medical records."
      />

      {logs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No access activity"
          description="Your records haven't been accessed yet."
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.sharedAccess?.doctor
                        ? `Dr. ${log.sharedAccess.doctor.firstName} ${log.sharedAccess.doctor.lastName}`
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {log.action.replace(/_/g, " ").toLowerCase()}
                    </TableCell>
                    <TableCell>{formatDateTime(log.accessedAt)}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {log.ipAddress || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
