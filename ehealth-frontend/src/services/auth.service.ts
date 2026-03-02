import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  LoginInput,
  RegisterDoctorInput,
  RegisterPatientInput,
  User,
  UserWithProfile,
} from "@/types";

export const authService = {
  login: async (data: LoginInput) => {
    return apiClient.post<any, ApiResponse<{ token: string; user: User }>>(
      "/auth/login",
      data
    );
  },

  registerPatient: async (data: RegisterPatientInput) => {
    return apiClient.post<any, ApiResponse<{ token: string; user: User; patient: any }>>(
      "/auth/register/patient",
      data
    );
  },

  registerDoctor: async (data: RegisterDoctorInput) => {
    return apiClient.post<any, ApiResponse<{ token: string; user: User; doctor: any }>>(
      "/auth/register/doctor",
      data
    );
  },

  getMe: async () => {
    return apiClient.get<any, ApiResponse<UserWithProfile>>("/auth/me");
  },

  deleteAccount: async () => {
    return apiClient.delete<any, ApiResponse<{ deleted: boolean }>>("/auth/me");
  },
};
