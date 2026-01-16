import { apiClient } from "@/lib/api-client";
import {
  AccessLog,
  ApiResponse,
  GrantAccessInput,
  PaginatedResponse,
  SharedAccess,
} from "@/types";

export const sharingService = {
  grantAccess: async (data: GrantAccessInput) => {
    return apiClient.post<any, ApiResponse<SharedAccess>>("/sharing/grant", data);
  },

  revokeAccess: async (doctorId: string) => {
    return apiClient.post<any, ApiResponse<{ revoked: boolean }>>(
      "/sharing/revoke",
      { doctorId }
    );
  },

  getActiveShares: async () => {
    return apiClient.get<any, ApiResponse<SharedAccess[]>>("/sharing/active");
  },

  getAccessLog: async (page = 1, limit = 10) => {
    return apiClient.get<any, ApiResponse<PaginatedResponse<AccessLog>>>(
      `/sharing/access-log?page=${page}&limit=${limit}`
    );
  },

  verifyAccessCode: async (code: string) => {
    return apiClient.get<
      any,
      ApiResponse<{ valid: boolean; access?: SharedAccess }>
    >(`/sharing/verify/${code}`);
  },
};
