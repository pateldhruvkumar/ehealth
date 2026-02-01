import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  CreateEmergencyContactInput,
  EmergencyContact,
  Patient,
  PatientDashboardStats,
  UpdateMedicalInfoInput,
  UpdatePatientProfileInput,
} from "@/types";

export const patientService = {
  getProfile: async () => {
    return apiClient.get<any, ApiResponse<Patient>>("/patient/profile");
  },

  updateProfile: async (data: UpdatePatientProfileInput) => {
    return apiClient.put<any, ApiResponse<Patient>>("/patient/profile", data);
  },

  getMedicalInfo: async () => {
    return apiClient.get<any, ApiResponse<Patient>>("/patient/medical-info");
  },

  updateMedicalInfo: async (data: UpdateMedicalInfoInput) => {
    return apiClient.put<any, ApiResponse<Patient>>(
      "/patient/medical-info",
      data
    );
  },

  getEmergencyContacts: async () => {
    return apiClient.get<any, ApiResponse<EmergencyContact[]>>(
      "/patient/emergency-contacts"
    );
  },

  createEmergencyContact: async (data: CreateEmergencyContactInput) => {
    return apiClient.post<any, ApiResponse<EmergencyContact>>(
      "/patient/emergency-contacts",
      data
    );
  },

  updateEmergencyContact: async (
    id: string,
    data: Partial<CreateEmergencyContactInput>
  ) => {
    return apiClient.put<any, ApiResponse<EmergencyContact>>(
      `/patient/emergency-contacts/${id}`,
      data
    );
  },

  deleteEmergencyContact: async (id: string) => {
    return apiClient.delete<any, ApiResponse<{ deleted: boolean }>>(
      `/patient/emergency-contacts/${id}`
    );
  },

  getDashboard: async () => {
    return apiClient.get<any, ApiResponse<PatientDashboardStats>>(
      "/patient/dashboard"
    );
  },
};
