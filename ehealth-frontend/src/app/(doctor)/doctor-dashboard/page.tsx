"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctorDashboard } from "@/hooks/use-doctor";
import { ROUTES } from "@/lib/constants";
import { formatDate, getInitials } from "@/lib/utils";
import {
  ClipboardList,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const { data: stats, isLoading } = useDoctorDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const consultations = stats?.recentConsultations || [];

  return (
    <div className="space-y-8">
      <PageHeader title="Doctor Dashboard" />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Active Patients"
          value={stats?.activePatients || 0}
          icon={Users}
          description="Patients sharing records"
        />
        <StatsCard
          title="Total Consultations"
          value={stats?.consultations || 0}
          icon={ClipboardList}
          description="Recorded on platform"
        />
        <StatsCard
          title="Verification Status"
          value="Verified"
          icon={ShieldCheck}
          className="text-green-600"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Consultations */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Consultations</CardTitle>
            <Link
              href={ROUTES.DOCTOR_CONSULTATIONS}
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {consultations.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title="No consultations yet"
                description="Start by viewing a patient's records."
                className="py-8"
              />
            ) : (
              <div className="space-y-6">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={consultation.patient?.profileImage} />
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
                        <p className="text-sm text-slate-500">
                          {consultation.diagnosis || "No diagnosis"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatDate(consultation.visitDate)}
                      </p>
                      <Link
                        href={`${ROUTES.DOCTOR_PATIENTS}/${consultation.patientId}`}
                      >
                        <Button variant="link" size="sm" className="h-auto p-0">
                          View Patient
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
