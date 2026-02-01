"use client";

import { DocumentCard } from "@/components/documents/document-card";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatientDetails, usePatientDocuments } from "@/hooks/use-doctor";
import { ROUTES } from "@/lib/constants";
import { formatDateTime, getInitials } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Phone,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PatientDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const { data: patientData, isLoading: patientLoading } = usePatientDetails(id);
  const { data: documentsData, isLoading: docsLoading } = usePatientDocuments(
    id,
    1,
    50
  );

  if (patientLoading || docsLoading) return <LoadingSpinner className="h-96" />;

  if (!patientData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-slate-500">Patient not found or access denied.</p>
      </div>
    );
  }

  const { patient } = patientData;
  const documents = documentsData?.items || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <Link href={ROUTES.DOCTOR_PATIENTS}>
            <Button variant="ghost" size="icon" className="mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.profileImage} />
              <AvatarFallback className="text-lg">
                {getInitials(`${patient.firstName} ${patient.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {patient.gender}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />{" "}
                  {new Date().getFullYear() -
                    new Date(patient.dateOfBirth).getFullYear()}{" "}
                  years old
                </span>
                {patient.bloodGroup && (
                  <Badge variant="secondary" className="ml-1">
                    {patient.bloodGroup}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Consultation</DialogTitle>
            </DialogHeader>
            <ConsultationForm
              patientId={patient.userId}
              onSuccess={() => setIsConsultationOpen(false)}
              onCancel={() => setIsConsultationOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {patient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>{patient.phone}</span>
                </div>
              )}
              {patient.user?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>{patient.user.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="mt-2 text-slate-600 dark:text-slate-400">
                  <p>{patient.address}</p>
                  <p>
                    {patient.city}, {patient.state} {patient.postalCode}
                  </p>
                  <p>{patient.country}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies?.length ? (
                    patient.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                      >
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">None recorded</span>
                  )}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-xs font-medium uppercase text-slate-500">
                  Chronic Conditions
                </span>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions?.length ? (
                    patient.chronicConditions.map((condition) => (
                      <Badge key={condition} variant="secondary">
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">None recorded</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">Consultation History</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-6">
              {documents.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No documents found"
                  description="This patient hasn't uploaded any documents yet."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {documents.map((doc: any) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardContent className="py-8 text-center text-slate-500">
                  Consultation history feature coming soon.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
