"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDoctorPatients } from "@/hooks/use-doctor";
import { ROUTES } from "@/lib/constants";
import { formatDate, getInitials } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MyPatientsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDoctorPatients(page, 10);

  if (isLoading) return <LoadingSpinner className="h-96" />;

  const patients = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Patients"
        description="Patients who have granted you access to their records."
      />

      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description="You don't have access to any patient records yet."
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Access Granted</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((access) => (
                  <TableRow key={access.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={access.patient?.profileImage} />
                          <AvatarFallback>
                            {getInitials(
                              `${access.patient?.firstName} ${access.patient?.lastName}`
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {access.patient?.firstName} {access.patient?.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {access.patient?.gender} •{" "}
                            {formatDate(access.patient?.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(access.grantedAt)}</TableCell>
                    <TableCell>{formatDate(access.expiresAt)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          access.status === "ACTIVE"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {access.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`${ROUTES.DOCTOR_PATIENTS}/${access.patient?.userId}`}
                      >
                        <Button variant="outline" size="sm">
                          View Records
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
