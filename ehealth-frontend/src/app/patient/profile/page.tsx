"use client";

import { EmergencyContactForm } from "@/components/forms/emergency-contact-form";
import { MedicalInfoForm } from "@/components/forms/medical-info-form";
import { ProfileForm } from "@/components/forms/profile-form";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteEmergencyContact, useEmergencyContacts, useMedicalInfo, usePatientProfile } from "@/hooks/use-patient";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } = usePatientProfile();
  const { data: medicalInfo, isLoading: medicalLoading } = useMedicalInfo();
  const { data: contacts, isLoading: contactsLoading } = useEmergencyContacts();
  const deleteContact = useDeleteEmergencyContact();

  const [showAddContact, setShowAddContact] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  if (profileLoading || medicalLoading || contactsLoading) {
    return <LoadingSpinner className="h-96" />;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="Profile Settings"
        description="Manage your personal and medical information."
      />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <ProfileForm initialData={profile} />
              ) : (
                <p>Failed to load profile.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent>
              {medicalInfo ? (
                <MedicalInfoForm initialData={medicalInfo} />
              ) : (
                <p>Failed to load medical info.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Emergency Contacts</CardTitle>
              {!showAddContact && (
                <Button size="sm" onClick={() => setShowAddContact(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {showAddContact && (
                <div className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-900/50">
                  <EmergencyContactForm
                    onSuccess={() => setShowAddContact(false)}
                    onCancel={() => setShowAddContact(false)}
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {contacts?.map((contact) => (
                  <div
                    key={contact.id}
                    className="relative flex flex-col justify-between rounded-lg border p-4 shadow-sm"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{contact.name}</h4>
                        {contact.isPrimary && (
                          <Badge variant="secondary">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {contact.relationship}
                      </p>
                      <p className="mt-2 text-sm">{contact.phone}</p>
                      {contact.email && (
                        <p className="text-sm">{contact.email}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-fit text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      onClick={() => setContactToDelete(contact.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
                {contacts?.length === 0 && !showAddContact && (
                  <p className="col-span-full py-8 text-center text-slate-500">
                    No emergency contacts added yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={!!contactToDelete}
        onOpenChange={(open) => !open && setContactToDelete(null)}
        title="Remove Contact"
        description="Are you sure you want to remove this emergency contact?"
        onConfirm={() => {
          if (contactToDelete) {
            deleteContact.mutate(contactToDelete);
            setContactToDelete(null);
          }
        }}
        variant="destructive"
        confirmText="Remove"
      />
    </div>
  );
}
