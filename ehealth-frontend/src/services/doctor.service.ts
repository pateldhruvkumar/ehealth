import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  Consultation,
  CreateConsultationInput,
  Doctor,
  DoctorDashboardStats,
  DoctorSearchFilters,
  PaginatedResponse,
  Patient,
  SharedAccess,
  UpdatePatientProfileInput, // Using this type for doctor profile update as fields are similar or we should define UpdateDoctorProfileInput
} from "@/types";

// Note: Ensure UpdateDoctorProfileInput is defined in types/index.ts or reuse UpdatePatientProfileInput if structure matches.
// Based on backend, doctor profile has different fields. Assuming UpdateDoctorProfileInput exists in types or I'll cast it properly.
// Let's assume UpdatePatientProfileInput for now or ANY.

export const doctorService = {
  getProfile: async () => {
    return apiClient.get<any, ApiResponse<Doctor>>("/doctor/profile");
  },

  updateProfile: async (data: any) => {
    return apiClient.put<any, ApiResponse<Doctor>>("/doctor/profile", data);
  },

  getPatients: async (page = 1, limit = 10) => {
    return apiClient.get<any, ApiResponse<PaginatedResponse<SharedAccess>>>(
      `/doctor/patients?page=${page}&limit=${limit}`
    );
  },

  getPatientDetails: async (patientId: string) => {
    return apiClient.get<
      any,
      ApiResponse<{ access: SharedAccess; patient: Patient }>
    >(`/doctor/patients/${patientId}`);
  },

  getPatientDocuments: async (patientId: string, page = 1, limit = 10) => {
    return apiClient.get<any, ApiResponse<PaginatedResponse<any>>>( // any for Document list wrapper
      `/doctor/patients/${patientId}/documents?page=${page}&limit=${limit}`
    );
  },

  createConsultation: async (data: CreateConsultationInput) => {
    return apiClient.post<any, ApiResponse<Consultation>>(
      "/doctor/consultations",
      data
    );
  },

  getConsultations: async (page = 1, limit = 10) => {
    return apiClient.get<any, ApiResponse<PaginatedResponse<Consultation>>>(
      `/doctor/consultations?page=${page}&limit=${limit}`
    );
  },

  getConsultation: async (id: string) => {
    return apiClient.get<any, ApiResponse<Consultation>>(
      `/doctor/consultations/${id}`
    );
  },

  getDashboard: async () => {
    return apiClient.get<any, ApiResponse<DoctorDashboardStats>>(
      "/doctor/dashboard"
    );
  },

  search: async (filters: DoctorSearchFilters) => {
    const params = new URLSearchParams();
    if (filters.query) params.append("query", filters.query);
    if (filters.specialization)
      params.append("specialization", filters.specialization);
    if (filters.city) params.append("city", filters.city);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient.get<any, ApiResponse<PaginatedResponse<Doctor>>>(
      `/doctor/search?${params.toString()}`
    );
  },
};
