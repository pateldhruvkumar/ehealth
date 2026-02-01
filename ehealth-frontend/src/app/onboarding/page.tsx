"use client";

import { OnboardingDoctorForm } from "@/components/forms/onboarding-doctor-form";
import { OnboardingPatientForm } from "@/components/forms/onboarding-patient-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const isDoctor = role === "doctor";
  const isPatient = role === "patient";

  if (!isDoctor && !isPatient) {
    return (
      <div className="text-center">
        <p className="text-red-500">
          Invalid role specified. Please try registering again.
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Complete Your Profile
        </CardTitle>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Please provide a few more details to finish setting up your{" "}
          {isDoctor ? "Doctor" : "Patient"} account.
        </p>
      </CardHeader>
      <CardContent>
        {isDoctor ? <OnboardingDoctorForm /> : <OnboardingPatientForm />}
      </CardContent>
    </Card>
  );
}

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Suspense fallback={<div>Loading...</div>}>
        <OnboardingContent />
      </Suspense>
    </div>
  );
}
