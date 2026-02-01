"use client";

import { DoctorProfileForm } from "@/components/forms/doctor-profile-form";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDoctorProfile } from "@/hooks/use-doctor";
import { CheckCircle2, XCircle } from "lucide-react";

export default function DoctorProfilePage() {
  const { data: profile, isLoading } = useDoctorProfile();

  if (isLoading) return <LoadingSpinner className="h-96" />;

  if (!profile) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-slate-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="Doctor Profile"
        description="Manage your professional information."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DoctorProfileForm initialData={profile} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.isVerified ? (
                <Alert className="border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">
                    Verified
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Your account is verified. You can access all features.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Not Verified</AlertTitle>
                  <AlertDescription>
                    Your account is pending verification. Some features may be
                    limited.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-500">
                  License Number
                </span>
                <p className="font-mono">{profile.licenseNumber}</p>
              </div>
              <p className="text-xs text-slate-500">
                Contact support to update your license number.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
