import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  RegisterDoctorInput,
  RegisterPatientInput,
  User,
} from "@/types";

export const authService = {
  registerPatient: async (data: RegisterPatientInput) => {
    return apiClient.post<any, ApiResponse<{ user: User; patient: any }>>(
      "/auth/register/patient",
      data
    );
  },

  registerDoctor: async (data: RegisterDoctorInput) => {
    return apiClient.post<any, ApiResponse<{ user: User; doctor: any }>>(
      "/auth/register/doctor",
      data
    );
  },

  getMe: async () => {
    return apiClient.get<any, ApiResponse<User>>("/auth/me");
  },

  deleteAccount: async () => {
    return apiClient.delete<any, ApiResponse<{ deleted: boolean }>>("/auth/me");
  },
};
