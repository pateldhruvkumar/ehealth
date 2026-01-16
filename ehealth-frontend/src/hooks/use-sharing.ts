import { sharingService } from "@/services/sharing.service";
import { GrantAccessInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useActiveShares() {
  return useQuery({
    queryKey: ["active-shares"],
    queryFn: async () => {
      const response = await sharingService.getActiveShares();
      return response.data || [];
    },
  });
}

export function useAccessLog(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["access-log", page, limit],
    queryFn: async () => {
      const response = await sharingService.getAccessLog(page, limit);
      return response.data;
    },
  });
}

export function useGrantAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GrantAccessInput) => sharingService.grantAccess(data),
    onSuccess: () => {
      toast.success("Access granted");
      queryClient.invalidateQueries({ queryKey: ["active-shares"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to grant access");
    },
  });
}

export function useRevokeAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => sharingService.revokeAccess(doctorId),
    onSuccess: () => {
      toast.success("Access revoked");
      queryClient.invalidateQueries({ queryKey: ["active-shares"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to revoke access");
    },
  });
}
