"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConsultations } from "@/hooks/use-doctor";
import { ROUTES } from "@/lib/constants";
import { formatDate, getInitials } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ConsultationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useConsultations(page, 10);

  if (isLoading) return <LoadingSpinner className="h-96" />;

  const consultations = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultations"
        description="History of all consultations recorded."
      />

      {consultations.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No consultations found"
          description="You haven't recorded any consultations yet."
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Notes Preview</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={consultation.patient?.profileImage}
                          />
                          <AvatarFallback>
                            {getInitials(
                              `${consultation.patient?.firstName} ${consultation.patient?.lastName}`
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {consultation.patient?.firstName}{" "}
                            {consultation.patient?.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(consultation.visitDate)}</TableCell>
                    <TableCell>
                      {consultation.diagnosis || "No diagnosis"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-slate-500">
                      {consultation.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`${ROUTES.DOCTOR_PATIENTS}/${consultation.patientId}`}
                      >
                        <Button variant="ghost" size="sm">
                          View Patient
                        </Button>
                      </Link>
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
