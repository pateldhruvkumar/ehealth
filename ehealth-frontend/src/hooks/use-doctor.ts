import { doctorService } from "@/services/doctor.service";
import {
  CreateConsultationInput,
  DoctorSearchFilters,
  UpdatePatientProfileInput,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDoctorProfile() {
  return useQuery({
    queryKey: ["doctor-profile"],
    queryFn: async () => {
      const response = await doctorService.getProfile();
      return response.data;
    },
  });
}

export function useDoctorPatients(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["doctor-patients", page, limit],
    queryFn: async () => {
      const response = await doctorService.getPatients(page, limit);
      return response.data;
    },
  });
}

export function usePatientDetails(patientId: string) {
  return useQuery({
    queryKey: ["patient-details", patientId],
    queryFn: async () => {
      const response = await doctorService.getPatientDetails(patientId);
      return response.data;
    },
    enabled: !!patientId,
  });
}

export function usePatientDocuments(patientId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ["patient-documents", patientId, page, limit],
    queryFn: async () => {
      const response = await doctorService.getPatientDocuments(
        patientId,
        page,
        limit
      );
      return response.data;
    },
    enabled: !!patientId,
  });
}

export function useConsultations(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["consultations", page, limit],
    queryFn: async () => {
      const response = await doctorService.getConsultations(page, limit);
      return response.data;
    },
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConsultationInput) =>
      doctorService.createConsultation(data),
    onSuccess: () => {
      toast.success("Consultation recorded");
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create consultation");
    },
  });
}

export function useDoctorDashboard() {
  return useQuery({
    queryKey: ["doctor-dashboard"],
    queryFn: async () => {
      const response = await doctorService.getDashboard();
      return response.data;
    },
  });
}

export function useSearchDoctors(filters: DoctorSearchFilters) {
  return useQuery({
    queryKey: ["search-doctors", filters],
    queryFn: async () => {
      const response = await doctorService.search(filters);
      return response.data;
    },
    enabled: !!filters.query || !!filters.specialization || !!filters.city,
  });
}
