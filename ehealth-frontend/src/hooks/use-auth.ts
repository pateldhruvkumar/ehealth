import { authService } from "@/services/auth.service";
import { RegisterDoctorInput, RegisterPatientInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await authService.getMe();
      return response.data;
    },
    retry: false,
  });
}

export function useRegisterPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterPatientInput) => authService.registerPatient(data),
    onSuccess: () => {
      toast.success("Registration successful!");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useRegisterDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDoctorInput) => authService.registerDoctor(data),
    onSuccess: () => {
      toast.success("Registration successful!");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });
}
