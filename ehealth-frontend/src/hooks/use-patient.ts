import { patientService } from "@/services/patient.service";
import {
  CreateEmergencyContactInput,
  UpdateMedicalInfoInput,
  UpdatePatientProfileInput,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePatientProfile() {
  return useQuery({
    queryKey: ["patient-profile"],
    queryFn: async () => {
      const response = await patientService.getProfile();
      return response.data;
    },
  });
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePatientProfileInput) =>
      patientService.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

export function useMedicalInfo() {
  return useQuery({
    queryKey: ["medical-info"],
    queryFn: async () => {
      const response = await patientService.getMedicalInfo();
      return response.data;
    },
  });
}

export function useUpdateMedicalInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMedicalInfoInput) =>
      patientService.updateMedicalInfo(data),
    onSuccess: () => {
      toast.success("Medical info updated");
      queryClient.invalidateQueries({ queryKey: ["medical-info"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update medical info");
    },
  });
}

export function useEmergencyContacts() {
  return useQuery({
    queryKey: ["emergency-contacts"],
    queryFn: async () => {
      const response = await patientService.getEmergencyContacts();
      return response.data || [];
    },
  });
}

export function useCreateEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmergencyContactInput) =>
      patientService.createEmergencyContact(data),
    onSuccess: () => {
      toast.success("Contact added");
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add contact");
    },
  });
}

export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.deleteEmergencyContact(id),
    onSuccess: () => {
      toast.success("Contact deleted");
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete contact");
    },
  });
}

export function usePatientDashboard() {
  return useQuery({
    queryKey: ["patient-dashboard"],
    queryFn: async () => {
      const response = await patientService.getDashboard();
      return response.data;
    },
  });
}
